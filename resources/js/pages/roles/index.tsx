import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    FolderLock,
    Info,
    KeyRound,
    Lock,
    Save,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { Permission, Role } from '@/types';

interface Props {
    roles: Role[];
    permissionGroups: Record<string, Permission[]>;
}

export default function RolePermissionPage({
    roles,
    permissionGroups,
}: Props) {
    useFlashToast();

    const [selectedRole, setSelectedRole] = useState<Role>(roles[0] || null);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
        roles[0]?.permissions?.map((p) => p.id) || []
    );
    const [isSaving, setIsSaving] = useState(false);

    // Switch Role Tab
    const handleSelectRole = (role: Role) => {
        setSelectedRole(role);
        setSelectedPermissionIds(role.permissions?.map((p) => p.id) || []);
    };

    // Toggle Permission
    const handleTogglePermission = (permId: number) => {
        if (selectedRole?.name === 'admin') {
            toast.info('Role Administrator memiliki hak akses penuh secara default.');
            return;
        }

        setSelectedPermissionIds((prev) =>
            prev.includes(permId)
                ? prev.filter((id) => id !== permId)
                : [...prev, permId]
        );
    };

    // Toggle All In Group
    const handleToggleGroup = (groupPerms: Permission[]) => {
        if (selectedRole?.name === 'admin') return;

        const groupIds = groupPerms.map((p) => p.id);
        const allChecked = groupIds.every((id) =>
            selectedPermissionIds.includes(id)
        );

        if (allChecked) {
            // Uncheck all in this group
            setSelectedPermissionIds((prev) =>
                prev.filter((id) => !groupIds.includes(id))
            );
        } else {
            // Check all in this group
            setSelectedPermissionIds((prev) => [
                ...prev,
                ...groupIds.filter((id) => !prev.includes(id)),
            ]);
        }
    };

    // Save Permissions
    const handleSavePermissions = () => {
        if (!selectedRole) return;
        setIsSaving(true);

        router.put(
            `/roles/${selectedRole.id}`,
            {
                permission_ids: selectedPermissionIds,
            },
            {
                onSuccess: () => setIsSaving(false),
                onError: () => setIsSaving(false),
            }
        );
    };

    return (
        <>
            <Head title="Role & Permissions - Layanan Taspen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Title & Description */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                <ShieldCheck className="size-6" />
                            </div>
                            Role & Hak Akses (Permissions)
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Konfigurasi matriks kewenangan dan hak akses fitur berdasarkan peran pengguna (RBAC).
                        </p>
                    </div>
                </div>

                {/* Role Switcher Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {roles.map((role) => {
                        const isSelected = selectedRole?.id === role.id;
                        const isAdmin = role.name === 'admin';

                        return (
                            <div
                                key={role.id}
                                onClick={() => handleSelectRole(role)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    isSelected
                                        ? 'border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/30 dark:bg-purple-950/20'
                                        : 'border-border bg-card/60 hover:bg-card/90'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2.5 rounded-lg ${
                                                isAdmin
                                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                            }`}
                                        >
                                            {isAdmin ? (
                                                <ShieldAlert className="size-5" />
                                            ) : (
                                                <UserCheck className="size-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-foreground flex items-center gap-2">
                                                {role.label}
                                                <Badge
                                                    variant={isSelected ? 'default' : 'outline'}
                                                    className="text-[10px] py-0 px-1.5"
                                                >
                                                    {role.name}
                                                </Badge>
                                            </h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {role.description || 'Hak akses sistem'}
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                            <CheckCircle2 className="size-4" /> Dipilih
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Permissions Matrix */}
                {selectedRole && (
                    <Card className="border-border/70 shadow-xs">
                        <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <KeyRound className="size-5 text-purple-600" /> Matriks Hak Akses: {selectedRole.label}
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih izin (permissions) yang diizinkan untuk peran ini.
                                    </CardDescription>
                                </div>

                                {selectedRole.name !== 'admin' && (
                                    <Button
                                        onClick={handleSavePermissions}
                                        disabled={isSaving}
                                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                                    >
                                        <Save className="mr-1.5 size-4" />{' '}
                                        {isSaving ? 'Menyimpan...' : 'Simpan Hak Akses'}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6 space-y-6">
                            {selectedRole.name === 'admin' && (
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                                    <Info className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                    <div>
                                        <span className="font-semibold block">Peran Administrator Super:</span>
                                        Role Administrator memiliki semua izin hak akses secara otomatis (Bypass Permission Check) demi keamanan dan kelancaran pemeliharaan sistem.
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-6 md:grid-cols-2">
                                {Object.entries(permissionGroups).map(
                                    ([groupName, perms]) => {
                                        const groupIds = perms.map((p) => p.id);
                                        const allChecked =
                                            selectedRole.name === 'admin' ||
                                            groupIds.every((id) =>
                                                selectedPermissionIds.includes(id)
                                            );
                                        const someChecked =
                                            selectedRole.name !== 'admin' &&
                                            groupIds.some((id) =>
                                                selectedPermissionIds.includes(id)
                                            ) &&
                                            !allChecked;

                                        return (
                                            <div
                                                key={groupName}
                                                className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-3"
                                            >
                                                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                                    <div className="flex items-center gap-2">
                                                        <FolderLock className="size-4 text-purple-600" />
                                                        <span className="font-semibold text-sm text-foreground">
                                                            {groupName}
                                                        </span>
                                                    </div>
                                                    {selectedRole.name !== 'admin' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleGroup(perms)}
                                                            className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            {allChecked ? 'Batal Semua' : 'Pilih Semua'}
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-2.5 pt-1">
                                                    {perms.map((p) => {
                                                        const isChecked =
                                                            selectedRole.name === 'admin' ||
                                                            selectedPermissionIds.includes(p.id);

                                                        return (
                                                            <div
                                                                key={p.id}
                                                                className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                                                                    isChecked
                                                                        ? 'bg-purple-500/10 text-purple-950 dark:text-purple-200'
                                                                        : 'hover:bg-muted/50 text-muted-foreground'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <Checkbox
                                                                        id={`perm-${p.id}`}
                                                                        checked={isChecked}
                                                                        disabled={selectedRole.name === 'admin'}
                                                                        onCheckedChange={() =>
                                                                            handleTogglePermission(p.id)
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`perm-${p.id}`}
                                                                        className="cursor-pointer font-medium leading-none"
                                                                    >
                                                                        {p.label}
                                                                    </Label>
                                                                </div>
                                                                <span className="font-mono text-[10px] opacity-70">
                                                                    {p.name}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </CardContent>

                        {selectedRole.name !== 'admin' && (
                            <CardFooter className="p-4 sm:p-6 border-t border-border flex justify-end">
                                <Button
                                    onClick={handleSavePermissions}
                                    disabled={isSaving}
                                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                                >
                                    <Save className="mr-1.5 size-4" />{' '}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Hak Akses'}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                )}
            </div>
        </>
    );
}

RolePermissionPage.layout = {
    breadcrumbs: [
        {
            title: 'Role & Permissions',
            href: '/roles',
        },
    ],
};
