import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { BeritaAcara, PaginatedData } from '@/types';
import {
    BaCreateModal,
    BaDeleteModal,
    BaDetailModal,
    BaEditModal,
    BaFotoModal,
    BaTable,
    BaUploadDokumentasiModal,
    formatTanggalInput,
} from '@/components/berita-acara';
import type { BeritaAcaraFormData, BeritaAcaraStats } from '@/components/berita-acara';

interface Props {
    items: PaginatedData<BeritaAcara>;
    filters: {
        search: string;
        status: string;
        dokumentasi?: string;
    };
    stats: BeritaAcaraStats;
}

export default function BeritaAcaraPage({ items, filters, stats }: Props) {
    useFlashToast();

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [dokumentasiFilter, setDokumentasiFilter] = useState(filters.dokumentasi || 'all');

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isUploadDokumentasiOpen, setIsUploadDokumentasiOpen] = useState(false);
    const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);
    const [isAfterPrintPrompt, setIsAfterPrintPrompt] = useState(false);

    const [selectedItem, setSelectedItem] = useState<BeritaAcara | null>(null);

    // Form states
    const defaultForm: BeritaAcaraFormData = {
        nomor_berita_acara: '',
        nama: '',
        no_hp: '',
        permasalahan: '',
        solusi: '',
        status: 'Selesai',
        tanggal_kejadian: new Date().toISOString().split('T')[0],
    };
    const [formData, setFormData] = useState<BeritaAcaraFormData>(defaultForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Filter Handlers
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/berita-acara',
            { search: searchQuery, status: statusFilter, dokumentasi: dokumentasiFilter },
            { preserveState: true }
        );
    };

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        router.get(
            '/berita-acara',
            { search: searchQuery, status: val, dokumentasi: dokumentasiFilter },
            { preserveState: true }
        );
    };

    const handleDokumentasiFilterChange = (val: string) => {
        setDokumentasiFilter(val);
        router.get(
            '/berita-acara',
            { search: searchQuery, status: statusFilter, dokumentasi: val },
            { preserveState: true }
        );
    };

    // Open Handlers
    const handleOpenCreate = () => {
        setFormData(defaultForm);
        setSelectedFile(null);
        setFormErrors({});
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (item: BeritaAcara) => {
        setSelectedItem(item);
        setFormData({
            nomor_berita_acara: item.nomor_berita_acara,
            nama: item.nama,
            no_hp: item.no_hp || '',
            permasalahan: item.permasalahan,
            solusi: item.solusi,
            status: item.status,
            tanggal_kejadian: formatTanggalInput(item.tanggal_kejadian) || new Date().toISOString().split('T')[0],
        });
        setSelectedFile(null);
        setFormErrors({});
        setIsEditOpen(true);
    };

    const handleOpenDetail = (item: BeritaAcara) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleOpenDelete = (item: BeritaAcara) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleOpenUploadDokumentasi = (item: BeritaAcara, isAfterPrint = false) => {
        setSelectedItem(item);
        setIsAfterPrintPrompt(isAfterPrint);
        setIsUploadDokumentasiOpen(true);
    };

    const handleOpenFotoModal = (item: BeritaAcara) => {
        setSelectedItem(item);
        setIsFotoModalOpen(true);
    };

    // Submit Create
    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('nomor_berita_acara', formData.nomor_berita_acara);
        data.append('nama', formData.nama);
        data.append('no_hp', formData.no_hp || '');
        data.append('permasalahan', formData.permasalahan);
        data.append('solusi', formData.solusi);
        data.append('status', formData.status);
        data.append('tanggal_kejadian', formData.tanggal_kejadian);
        if (selectedFile) data.append('file_notas', selectedFile);

        router.post('/berita-acara', data, {
            onError: (errors) => { setFormErrors(errors); setIsSubmitting(false); },
            onSuccess: () => { setIsCreateOpen(false); setIsSubmitting(false); },
        });
    };

    // Submit Edit
    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        setIsSubmitting(true);

        const data = new FormData();
        data.append('nomor_berita_acara', formData.nomor_berita_acara);
        data.append('nama', formData.nama);
        data.append('no_hp', formData.no_hp || '');
        data.append('permasalahan', formData.permasalahan);
        data.append('solusi', formData.solusi);
        data.append('status', formData.status);
        data.append('tanggal_kejadian', formData.tanggal_kejadian);
        if (selectedFile) data.append('file_notas', selectedFile);

        router.post(`/berita-acara/${selectedItem.id}`, data, {
            onError: (errors) => { setFormErrors(errors); setIsSubmitting(false); },
            onSuccess: () => { setIsEditOpen(false); setIsSubmitting(false); },
        });
    };

    // Confirm Delete
    const handleConfirmDelete = () => {
        if (!selectedItem) return;
        setIsSubmitting(true);
        router.delete(`/berita-acara/${selectedItem.id}`, {
            onSuccess: () => { setIsDeleteOpen(false); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Berita Acara - Layanan Taspen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <BaTable
                    items={items}
                    stats={stats}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    dokumentasiFilter={dokumentasiFilter}
                    onSearchChange={setSearchQuery}
                    onSearch={handleSearch}
                    onStatusFilterChange={handleStatusFilterChange}
                    onDokumentasiFilterChange={handleDokumentasiFilterChange}
                    onOpenDetail={handleOpenDetail}
                    onOpenEdit={handleOpenEdit}
                    onOpenDelete={handleOpenDelete}
                    onOpenCreate={handleOpenCreate}
                    onOpenUploadDokumentasi={handleOpenUploadDokumentasi}
                    onOpenFotoModal={handleOpenFotoModal}
                />
            </div>

            <BaCreateModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitCreate}
                onFileChange={setSelectedFile}
            />

            <BaEditModal
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                selectedItem={selectedItem}
                onSubmit={handleSubmitEdit}
                onFileChange={setSelectedFile}
            />

            <BaDetailModal
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                item={selectedItem}
                onOpenUploadDokumentasi={handleOpenUploadDokumentasi}
                onOpenFotoModal={handleOpenFotoModal}
            />

            <BaUploadDokumentasiModal
                open={isUploadDokumentasiOpen}
                onOpenChange={setIsUploadDokumentasiOpen}
                item={selectedItem}
                isAfterPrint={isAfterPrintPrompt}
            />

            <BaFotoModal
                open={isFotoModalOpen}
                onOpenChange={setIsFotoModalOpen}
                item={selectedItem}
                onOpenUpload={handleOpenUploadDokumentasi}
            />

            <BaDeleteModal
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                item={selectedItem}
                isSubmitting={isSubmitting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

BeritaAcaraPage.layout = {
    breadcrumbs: [
        {
            title: 'Berita Acara',
            href: '/berita-acara',
        },
    ],
};
