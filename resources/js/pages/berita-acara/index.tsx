import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { BeritaAcara, PaginatedData } from '@/types';
import {
    BaCreateModal,
    BaDeleteModal,
    BaDetailModal,
    BaEditModal,
    BaStats,
    BaTable,
} from '@/components/berita-acara';
import type { BeritaAcaraFormData, BeritaAcaraStats } from '@/components/berita-acara';

interface Props {
    items: PaginatedData<BeritaAcara>;
    filters: {
        search: string;
        status: string;
    };
    stats: BeritaAcaraStats;
}

export default function BeritaAcaraPage({ items, filters, stats }: Props) {
    useFlashToast();

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<BeritaAcara | null>(null);

    // Form states
    const defaultForm: BeritaAcaraFormData = {
        nomor_berita_acara: '',
        nama: '',
        permasalahan: '',
        solusi: '',
        status: 'Selesai',
        tanggal_kejadian: new Date().toISOString().split('T')[0],
    };
    const [formData, setFormData] = useState<BeritaAcaraFormData>(defaultForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search Handler
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/berita-acara', { search: searchQuery, status: statusFilter }, { preserveState: true });
    };

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        router.get('/berita-acara', { search: searchQuery, status: val }, { preserveState: true });
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
            permasalahan: item.permasalahan,
            solusi: item.solusi,
            status: item.status,
            tanggal_kejadian: item.tanggal_kejadian || new Date().toISOString().split('T')[0],
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

    // Submit Create
    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('nomor_berita_acara', formData.nomor_berita_acara);
        data.append('nama', formData.nama);
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
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchQuery}
                    onSearch={handleSearch}
                    onStatusFilterChange={handleStatusFilterChange}
                    onOpenDetail={handleOpenDetail}
                    onOpenEdit={handleOpenEdit}
                    onOpenDelete={handleOpenDelete}
                    onOpenCreate={handleOpenCreate}
                />

                 <BaStats stats={stats} />
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
