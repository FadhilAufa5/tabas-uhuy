<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Default configuration for image optimization.
     */
    protected array $defaultImageConfig = [
        'max_width' => 1920,
        'max_height' => 1920,
        'quality' => 82,
        'convert_to_webp' => true,
    ];

    /**
     * Upload an arbitrary file to storage with structured directory partitioning.
     *
     * @param  string  $directory  Base directory (e.g., 'notas', 'dokumen')
     * @param  array  $options  [disk => 'public', subfolder_date => true, custom_name => null]
     * @return array{path: string, name: string, size: int, mime_type: string, disk: string}
     */
    public function uploadFile(UploadedFile $file, string $directory, array $options = []): array
    {
        $disk = $options['disk'] ?? 'public';
        $subfolderDate = $options['subfolder_date'] ?? true;
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();

        $targetDirectory = $this->buildDirectoryPath($directory, $subfolderDate);
        $fileName = ($options['custom_name'] ?? Str::uuid()->toString()).($extension ? '.'.strtolower($extension) : '');

        $storedPath = Storage::disk($disk)->putFileAs($targetDirectory, $file, $fileName);

        $fileSize = Storage::disk($disk)->size($storedPath);
        $mimeType = $file->getClientMimeType();

        return [
            'path' => $storedPath,
            'name' => $originalName,
            'size' => $fileSize,
            'mime_type' => $mimeType,
            'disk' => $disk,
        ];
    }

    /**
     * Upload an image with automatic resizing and compression (drastically reduces file size for database & disk).
     *
     * @param  string  $directory  Base directory (e.g., 'dokumentasi_ba')
     * @param  array  $options  [disk, max_width, max_height, quality, convert_to_webp, subfolder_date]
     * @return array{path: string, name: string, size: int, mime_type: string, disk: string}
     */
    public function uploadImage(UploadedFile $file, string $directory, array $options = []): array
    {
        $disk = $options['disk'] ?? 'public';
        $subfolderDate = $options['subfolder_date'] ?? true;
        $originalName = $file->getClientOriginalName();

        $config = array_merge($this->defaultImageConfig, $options);

        // Try optimizing the image with GD
        $optimized = $this->optimizeImage($file, $config);

        if ($optimized !== null) {
            $targetDirectory = $this->buildDirectoryPath($directory, $subfolderDate);
            $fileName = ($options['custom_name'] ?? Str::uuid()->toString()).'.'.$optimized['extension'];
            $targetPath = $targetDirectory.'/'.$fileName;

            Storage::disk($disk)->put($targetPath, $optimized['content']);

            // Cleanup temp file if created
            if (isset($optimized['temp_path']) && file_exists($optimized['temp_path'])) {
                @unlink($optimized['temp_path']);
            }

            return [
                'path' => $targetPath,
                'name' => $originalName,
                'size' => strlen($optimized['content']),
                'mime_type' => $optimized['mime_type'],
                'disk' => $disk,
            ];
        }

        // Fallback: If GD optimization was not possible or failed, upload standard file
        return $this->uploadFile($file, $directory, $options);
    }

    /**
     * Replace an existing file with a new uploaded file, automatically deleting the old file.
     *
     * @param  string|null  $oldPath  Existing file path in storage
     * @param  array  $options  [is_image => bool, disk => 'public', ...]
     * @return array{path: string, name: string, size: int, mime_type: string, disk: string}
     */
    public function replaceFile(?string $oldPath, UploadedFile $newFile, string $directory, array $options = []): array
    {
        $disk = $options['disk'] ?? 'public';

        // Delete old file if present
        $this->deleteFile($oldPath, $disk);

        $isImage = $options['is_image'] ?? $this->isImageFile($newFile);

        if ($isImage) {
            return $this->uploadImage($newFile, $directory, $options);
        }

        return $this->uploadFile($newFile, $directory, $options);
    }

    /**
     * Safely delete a file from storage if it exists.
     */
    public function deleteFile(?string $path, string $disk = 'public'): bool
    {
        if (! $path) {
            return false;
        }

        try {
            if (Storage::disk($disk)->exists($path)) {
                return Storage::disk($disk)->delete($path);
            }
        } catch (\Throwable $e) {
            Log::warning("Failed to delete file at path: {$path} on disk: {$disk}. Error: {$e->getMessage()}");
        }

        return false;
    }

    /**
     * Get the public URL for a stored file.
     */
    public function getFileUrl(?string $path, string $disk = 'public'): ?string
    {
        if (! $path) {
            return null;
        }

        return Storage::disk($disk)->url($path);
    }

    /**
     * Optimize, auto-orient, resize, and compress an image file using PHP GD.
     *
     * @return array{content: string, mime_type: string, extension: string, temp_path?: string}|null
     */
    protected function optimizeImage(UploadedFile $file, array $config): ?array
    {
        if (! extension_loaded('gd')) {
            return null;
        }

        $filePath = $file->getRealPath();
        if (! $filePath || ! file_exists($filePath)) {
            return null;
        }

        $imageInfo = @getimagesize($filePath);
        if (! $imageInfo) {
            return null;
        }

        [$width, $height, $imageType] = $imageInfo;

        // Create GD resource from original image
        $sourceImage = match ($imageType) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($filePath),
            IMAGETYPE_PNG => @imagecreatefrompng($filePath),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : null,
            IMAGETYPE_GIF => @imagecreatefromgif($filePath),
            default => null,
        };

        if (! $sourceImage) {
            return null;
        }

        // Auto-orient based on EXIF if JPEG
        if ($imageType === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
            $sourceImage = $this->autoOrientExif($sourceImage, $filePath);
            $width = imagesx($sourceImage);
            $height = imagesy($sourceImage);
        }

        // Calculate proportional dimensions
        $maxWidth = $config['max_width'] ?? 1920;
        $maxHeight = $config['max_height'] ?? 1920;

        $targetWidth = $width;
        $targetHeight = $height;

        if ($width > $maxWidth || $height > $maxHeight) {
            $ratio = min($maxWidth / $width, $maxHeight / $height);
            $targetWidth = (int) round($width * $ratio);
            $targetHeight = (int) round($height * $ratio);
        }

        // Create resized canvas
        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);

        // Preserve transparency for PNG and WebP
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);
        $transparent = imagecolorallocatealpha($canvas, 255, 255, 255, 127);
        imagefilledrectangle($canvas, 0, 0, $targetWidth, $targetHeight, $transparent);

        imagecopyresampled(
            $canvas,
            $sourceImage,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $width,
            $height
        );

        imagedestroy($sourceImage);

        // Determine output format
        $quality = (int) ($config['quality'] ?? 82);
        $useWebp = ($config['convert_to_webp'] ?? true) && function_exists('imagewebp');

        ob_start();
        if ($useWebp) {
            imagewebp($canvas, null, $quality);
            $mimeType = 'image/webp';
            $extension = 'webp';
        } else {
            imagejpeg($canvas, null, $quality);
            $mimeType = 'image/jpeg';
            $extension = 'jpg';
        }
        $content = ob_get_clean();

        imagedestroy($canvas);

        if (! $content) {
            return null;
        }

        return [
            'content' => $content,
            'mime_type' => $mimeType,
            'extension' => $extension,
        ];
    }

    /**
     * Fix orientation using EXIF data.
     */
    protected function autoOrientExif(\GdImage $image, string $filePath): \GdImage
    {
        try {
            $exif = @exif_read_data($filePath);
            $orientation = $exif['Orientation'] ?? null;

            if ($orientation === 3) {
                return imagerotate($image, 180, 0);
            } elseif ($orientation === 6) {
                return imagerotate($image, -90, 0);
            } elseif ($orientation === 8) {
                return imagerotate($image, 90, 0);
            }
        } catch (\Throwable) {
            // Ignore exif reading errors
        }

        return $image;
    }

    /**
     * Build directory path with optional date partitioning.
     */
    protected function buildDirectoryPath(string $directory, bool $subfolderDate): string
    {
        $directory = trim($directory, '/');

        if ($subfolderDate) {
            return $directory.'/'.date('Y').'/'.date('m');
        }

        return $directory;
    }

    /**
     * Check whether an uploaded file is an image by MIME type.
     */
    protected function isImageFile(UploadedFile $file): bool
    {
        $mime = $file->getClientMimeType();

        return str_starts_with($mime, 'image/');
    }
}
