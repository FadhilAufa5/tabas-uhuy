import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    KeyRound,
    Mail,
    Pencil,
    Plus,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { PaginatedData, Role, User } from '@/types';

interface Props {
    users: PaginatedData<User>;
    roles: Role[];
    filters: {
        search: string;
        role: string;
    };
    stats: {
        total: number;
        admins: number;
        users: number;
    };
}

export default function UserManagementPage({
    users,
    roles,
    filters,
    stats,
}: Props) {
    useFlashToast();
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentUser = auth?.user;

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: roles.find((r) => r.name === 'user')?.id.toString() || '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Filter
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/users',
            {
                search: searchQuery,
                role: roleFilter,
            },
            { preserveState: true }
        );
    };

    const handleRoleFilterChange = (val: string) => {
        setRoleFilter(val);
        router.get(
            '/users',
            {
                search: searchQuery,
                role: val,
            },
            { preserveState: true }
        );
    };

    // Open Create
    const handleOpenCreate = () => {
        const defaultRoleId = roles.find((r) => r.name === 'user')?.id.toString() || (roles[0]?.id.toString() ?? '');
        setFormData({
            name: '',
            email: '',
            password: '',
            role_id: defaultRoleId,
        });
        setFormErrors({});
        setIsCreateOpen(true);
    };

    // Open Edit
    const handleOpenEdit = (user: User) => {
        setSelectedUser(user);
        const userRoleId =
            user.roles && user.roles.length > 0
                ? user.roles[0].id.toString()
                : (roles.find((r) => r.name === user.role)?.id.toString() ?? '');

        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: userRoleId,
        });
        setFormErrors({});
        setIsEditOpen(true);
    };

    // Open Delete
    const handleOpenDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    // Submit Create
    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/users', formData, {
            onError: (err) => {
                setFormErrors(err);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsCreateOpen(false);
                setIsSubmitting(false);
            },
        });
    };

    // Submit Edit
    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSubmitting(true);
        router.put(`/users/${selectedUser.id}`, formData, {
            onError: (err) => {
                setFormErrors(err);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsEditOpen(false);
                setIsSubmitting(false);
            },
        });
    };

    // Confirm Delete
    const handleConfirmDelete = () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        router.delete(`/users/${selectedUser.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getUserRoleBadge = (user: User) => {
        const roleName = user.role || (user.roles?.[0]?.name ?? 'user');
        if (roleName === 'admin') {
            return (
                <Badge className="bg-rose-500/15 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 font-semibold gap-1">
                    <ShieldCheck className="size-3.5" /> Administrator
                </Badge>
            );
        }
        return (
            <Badge className="bg-blue-500/15 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 font-medium gap-1">
                <UserCheck className="size-3.5" /> User / Petugas
            </Badge>
        );
    };

    return (
        <>
            <Head title="Manajemen Pengguna - Layanan Taspen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Title & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <Users className="size-6" />
                            </div>
                            Manajemen Pengguna & Akun
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data akun pengguna, peran otorisasi, dan hak akses operasional.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
                        >
                            <UserPlus className="mr-1.5 size-4" /> Tambah Pengguna
                        </Button>
                    </div>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Pengguna
                            </CardTitle>
                            <Users className="size-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Akun aktif terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Administrator
                            </CardTitle>
                            <ShieldCheck className="size-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                {stats.admins}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Hak akses penuh sistem</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                User / Petugas
                            </CardTitle>
                            <UserCheck className="size-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.users}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Operasional layanan & kasus</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table & Filter Card */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="p-4 sm:p-6 pb-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau email pengguna..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-background/80"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" size="sm">
                                    Cari
                                </Button>
                            </form>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Filter Role:</span>
                                <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                                    <SelectTrigger className="w-[140px] h-9">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Role</SelectItem>
                                        <SelectItem value="admin">Administrator</SelectItem>
                                        <SelectItem value="user">User / Petugas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow>
                                        <TableHead className="w-[240px] font-semibold">Pengguna</TableHead>
                                        <TableHead className="min-w-[200px] font-semibold">Email</TableHead>
                                        <TableHead className="w-[160px] font-semibold">Role / Peran</TableHead>
                                        <TableHead className="w-[160px] font-semibold">Terdaftar Pada</TableHead>
                                        <TableHead className="w-[120px] text-right font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Users className="size-8 text-muted-foreground/60" />
                                                    <p className="font-medium">Tidak ada data pengguna yang sesuai.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((u) => (
                                            <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-9 border border-border">
                                                            <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-xs">
                                                                {getInitials(u.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                                                                {u.name}
                                                                {currentUser?.id === u.id && (
                                                                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal text-muted-foreground">
                                                                        Anda
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">ID: #{u.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                                                        <Mail className="size-3.5 text-muted-foreground" />
                                                        {u.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getUserRoleBadge(u)}</TableCell>
                                                <TableCell>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="size-3" />
                                                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                            onClick={() => handleOpenEdit(u)}
                                                            title="Edit Pengguna"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        {currentUser?.id !== u.id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                                onClick={() => handleOpenDelete(u)}
                                                                title="Hapus Pengguna"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {users.total > users.per_page && (
                            <div className="flex items-center justify-between p-4 border-t border-border">
                                <div className="text-xs text-muted-foreground">
                                    Menampilkan {users.from || 0} - {users.to || 0} dari {users.total} pengguna
                                </div>
                                <div className="flex items-center gap-1">
                                    {users.links.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            className="h-8 min-w-[32px] px-2.5 text-xs"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* CREATE MODAL */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-600">
                            <UserPlus className="size-5" /> Tambah Pengguna Baru
                        </DialogTitle>
                        <DialogDescription>
                            Daftarkan akun baru untuk staf atau administrator aplikasi.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitCreate} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Ahmad Subagyo, S.Kom"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            {formErrors.name && (
                                <p className="text-xs text-rose-500">{formErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">
                                Alamat Email <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ahmad.subagyo@taspen.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            {formErrors.email && (
                                <p className="text-xs text-rose-500">{formErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">
                                Kata Sandi / Password <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                            {formErrors.password && (
                                <p className="text-xs text-rose-500">{formErrors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="role_id">
                                Role / Peran Otorisasi <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                                value={formData.role_id}
                                onValueChange={(val) => setFormData({ ...formData, role_id: val })}
                            >
                                <SelectTrigger id="role_id">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            {r.label} ({r.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.role_id && (
                                <p className="text-xs text-rose-500">{formErrors.role_id}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Tambah Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-600">
                            <Pencil className="size-5" /> Edit Data Pengguna
                        </DialogTitle>
                        <DialogDescription>
                            Perbarui identitas, alamat email, peran, atau ubah kata sandi pengguna.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitEdit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_name">
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="edit_name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            {formErrors.name && (
                                <p className="text-xs text-rose-500">{formErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_email">
                                Alamat Email <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="edit_email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            {formErrors.email && (
                                <p className="text-xs text-rose-500">{formErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_password">
                                Ubah Password Baru (Kosongkan jika tidak diubah)
                            </Label>
                            <Input
                                id="edit_password"
                                type="password"
                                placeholder="Ketik kata sandi baru jika ingin diubah"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            {formErrors.password && (
                                <p className="text-xs text-rose-500">{formErrors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_role_id">Role / Peran Otorisasi</Label>
                            <Select
                                value={formData.role_id}
                                onValueChange={(val) => setFormData({ ...formData, role_id: val })}
                            >
                                <SelectTrigger id="edit_role_id">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            {r.label} ({r.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Perbarui Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <Trash2 className="size-5" /> Hapus Pengguna
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus akun pengguna{' '}
                            <span className="font-semibold text-foreground">
                                {selectedUser?.name}
                            </span>{' '}
                            ({selectedUser?.email})? Akun ini tidak akan dapat login kembali ke sistem.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menghapus...' : 'Hapus Pengguna'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UserManagementPage.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Pengguna',
            href: '/users',
        },
    ],
};
