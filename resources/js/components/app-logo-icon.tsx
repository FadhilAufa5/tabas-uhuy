export default function AppLogoIcon({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/taspediauhuy.png"
            alt="Taspedia Logo"
            className={className}
            {...props}
        />
    );
}
