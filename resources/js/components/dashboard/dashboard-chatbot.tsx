import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Bot,
    Check,
    ChevronRight,
    Coffee,
    Compass,
    Copy,
    ExternalLink,
    FileText,
    HeartHandshake,
    HelpCircle,
    LayoutGrid,
    Lightbulb,
    Maximize2,
    MessageCircle,
    Minimize2,
    Minus,
    RotateCcw,
    Scale,
    Send,
    Settings,
    ShieldCheck,
    Smile,
    Sparkles,
    Users,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ReferensiKasus } from '@/types';

export interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: string;
    relatedCase?: ReferensiKasus;
    suggestions?: string[];
    actionLink?: {
        label: string;
        href: string;
        icon?: string;
    };
}

interface DashboardChatbotProps {
    allCases?: ReferensiKasus[];
    userName?: string;
}

// ── KATEGORI TAB SARAN CEPAT ──────────────────────────────────────────
const QUICK_TOPICS = [
    { id: 'fitur', label: '🚀 Semua Fitur', query: 'Jelaskan semua fitur aplikasi ini' },
    { id: 'uu11', label: '📜 UU No. 11/1969', query: 'Rangkum materi utama UU 11 Tahun 1969' },
    { id: 'ba', label: '📝 Berita Acara', query: 'Bagaimana cara membuat Berita Acara?' },
    { id: 'santai', label: '☕ Tanya Santai', query: 'Ceritakan lelucon santai kantor' },
];

const DEFAULT_SUGGESTIONS = [
    'Apa saja semua fitur di aplikasi ini?',
    'Cara membuat Berita Acara & upload foto',
    'Syarat usia & masa kerja pensiun (UU 11/1969)',
    'Rumus perhitungan besaran uang pensiun',
    'Hak pensiun janda jika menikah lagi',
    'Ceritakan lelucon atau candaan santai',
];

// Kata hubung yang diabaikan saat pembobotan kata kunci
const INDONESIAN_STOPWORDS = new Set([
    'yang', 'untuk', 'pada', 'ke', 'di', 'dari', 'dan', 'atau', 'ini', 'itu',
    'dengan', 'adalah', 'yaitu', 'yakni', 'sebagai', 'secara', 'karena', 'oleh',
    'dalam', 'atas', 'tentang', 'apa', 'apakah', 'bagaimana', 'berapa', 'mengapa',
    'kapan', 'siapa', 'mana', 'bisa', 'dapat', 'kah', 'dong', 'tolong', 'mohon',
    'menurut', 'terkait', 'ada', 'tidak', 'gak', 'ga', 'bukan', 'punya', 'lu',
    'kamu', 'bot', 'taspen', 'baca', 'materi', 'pdf', 'tolong', 'kasih', 'tahu',
    'jelaskan', 'beritahu', 'ajarkan', 'coba'
]);

// ── KNOWLEDGE BASE: JELASAN LENGKAP FITUR APLIKASI ──────────────────────
const APP_FEATURES_KNOWLEDGE = {
    all_features: {
        title: '🌟 Seluruh Fitur Sistem Layanan Taspen',
        text: `Aplikasi **Sistem Rekap Kasus & Berita Acara Taspen** ini dirancang komprehensif untuk mendigitalkan seluruh alur pelayanan dan dokumentasi pensiun:\n\n` +
            `1. 📊 **Dashboard Analytics & Monitoring**\n` +
            `   - Statistik KPI: Total Berita Acara, status penyelesaian, total referensi kasus, & jumlah pengguna.\n` +
            `   - Grafik Tren Bulanan interaktif dengan filter per Bulan & Tahun.\n` +
            `   - Grafik Distribusi Kategori Kasus (Klaim, Pensiun, Kepesertaan, dll).\n` +
            `   - Pencarian cepat kasus operasional dengan tombol **Salin Solusi** 1-klik.\n\n` +
            `2. 📝 **Modul Kelola Berita Acara (BA)**\n` +
            `   - Input Berita Acara digital dengan nomor NOTAS/BA, identitas pelapor, & kronologi.\n` +
            `   - Unggah lampiran berkas pendukung (PDF/dokumen).\n` +
            `   - Cetak / Download Berita Acara resmi berformat standar Taspen.\n` +
            `   - **Upload Foto Dokumentasi Fisik**: Unggah bukti arsip foto BA yang telah ditandatangani basah oleh pemohon.\n` +
            `   - Filter status penanganan (*Selesai* vs *Dalam Proses*) & filter bukti dokumentasi fisik.\n\n` +
            `3. 📚 **Bank Referensi Kasus & Regulasi UU 11/1969**\n` +
            `   - Pusat panduan solusi operasional komprehensif (Klaim, Kepesertaan, Pensiun, Teknis, Mutasi, Kasus Hukum, dll).\n` +
            `   - Terintegrasi penuh regulasi UU No. 11 Tahun 1969.\n` +
            `   - **Ekspor CSV**: Unduh seluruh data kasus ke format spreadsheet Excel.\n` +
            `   - **Impor CSV**: Sinkronisasi massal data kasus dengan mudah.\n\n` +
            `4. 👥 **Manajemen Pengguna & Akses (Khusus Admin)**\n` +
            `   - Tambah petugas/staf baru, ubah role, dan nonaktifkan akun.\n` +
            `   - Pengaturan hak akses (Role & Permissions).\n\n` +
            `5. ⚙️ **Pengaturan Profil & Keamanan Modern**\n` +
            `   - Ganti Password & dukungan **Passkey (WebAuthn / Biometrik)**.\n` +
            `   - Kustomisasi tampilan: Tema Gelap (Dark Mode), Terang, atau Sistem.\n\n` +
            `6. 🤖 **Taspen AI Assistant**\n` +
            `   - Siap 24/7 menjawab regulasi pensiun, alur SOP, dan pertanyaan santai!`,
        suggestions: [
            'Jelaskan fitur Berita Acara',
            'Jelaskan fitur Bank Referensi Kasus',
            'Fitur ekspor impor CSV kasus',
            'Fitur keamanan Passkey',
        ],
        actionLink: {
            label: 'Lihat Menu Berita Acara',
            href: '/berita-acara',
        },
    },

    berita_acara: {
        title: '📝 Panduan Fitur Berita Acara (BA)',
        text: `Modul **Berita Acara** berfungsi mendokumentasikan setiap kasus/keluhan peserta secara tertib dan akuntabel:\n\n` +
            `🔹 **Cara Membuat Berita Acara Baru:**\n` +
            `1. Buka menu **Berita Acara** di sidebar kiri.\n` +
            `2. Klik tombol biru **+ Buat Berita Acara** di kanan atas.\n` +
            `3. Isi Nomor NOTAS/BA, Nama Pemohon/Pelapor, No. HP/WhatsApp, Permasalahan, dan Solusi yang diberikan.\n` +
            `4. Unggah berkas pendukung (PDF/dokumen, maks 10MB).\n` +
            `5. Tentukan Status (*Selesai* atau *Dalam Proses*).\n\n` +
            `🔹 **Download & Upload Dokumentasi Fisik:**\n` +
            `- Klik ikon **Cetak/Download** untuk mencetak formulir Berita Acara resmi.\n` +
            `- Setelah formulir ditandatangani basah oleh pemohon & petugas, klik tombol **Upload Foto** pada baris data untuk mengunggah foto fisik dokumen.\n` +
            `- Anda dapat melihat pratinjau foto dokumentasi kapan saja lewat tombol **Lihat Foto**.\n\n` +
            `🔹 **Pencarian & Filter:**\n` +
            `- Filter cepat berdasarkan Status penanganan maupun Kelengkapan Bukti Foto (Ada Foto / Belum Ada Foto).`,
        suggestions: [
            'Berapa ukuran maksimal file lampiran BA?',
            'Bagaimana jika nomor NOTAS ganda?',
            'Jelaskan fitur Bank Referensi Kasus',
        ],
        actionLink: {
            label: 'Buka Halaman Berita Acara',
            href: '/berita-acara',
        },
    },

    referensi_kasus: {
        title: '📚 Panduan Fitur Bank Referensi Kasus',
        text: `Modul **Referensi Kasus** adalah repositori pengetahuan cerdas yang menjadi pedoman petugas dalam menangani aneka permasalahan peserta:\n\n` +
            `🔹 **Kategori Kasus:**\n` +
            `- **Klaim, Kepesertaan, Pensiun, Teknis, Mutasi, Administrasi, Kasus Hukum, Keuangan, dan Umum**.\n\n` +
            `🔹 **Fitur Utama yang Tersedia:**\n` +
            `1. **Pencarian Instan**: Cari berdasarkan kata kunci kasus, solusi, dasar aturan, atau kode kasus (misal: \`UU11-001\`).\n` +
            `2. **Salin Solusi 1-Klik**: Salin teks solusi langsung ke clipboard untuk keperluan draft jawaban atau WA nasabah.\n` +
            `3. **Detail Kasus**: Modal pop-up dengan rujukan pasal hukum yang lengkap.\n` +
            `4. **Ekspor CSV**: Ekspor seluruh bank kasus ke file spreadsheet untuk arsip offline.\n` +
            `5. **Impor CSV**: Unggah file CSV untuk menambahkan puluhan kasus sekaligus tanpa input manual satu per satu!`,
        suggestions: [
            'Bagaimana format impor CSV kasus?',
            'Rangkum materi utama UU 11 Tahun 1969',
            'Jelaskan fitur Berita Acara',
        ],
        actionLink: {
            label: 'Buka Bank Referensi Kasus',
            href: '/referensi-kasus',
        },
    },

    dashboard_feature: {
        title: '📊 Panduan Fitur Dashboard & Statistik',
        text: `Halaman **Dashboard** menyajikan gambaran operasional secara real-time:\n\n` +
            `1. **4 Kartu Metrik Utama**: Total Berita Acara, BA Selesai, Total Bank Kasus, dan Pengguna Terdaftar.\n` +
            `2. **Grafik Tren Bulanan**: Menampilkan volume penyelesaian kasus dari bulan ke bulan. Dilengkapi filter Tahun & Bulan.\n` +
            `3. **Grafik Distribusi Kategori**: Visualisasi proporsi kategori kasus yang paling sering ditangani.\n` +
            `4. **Widget Pencarian Cepat**: Cari solusi kasus tanpa harus berpindah ke menu lain.\n` +
            `5. **Floating AI Assistant (Bot ini!)**: Siap mendampingi Anda di mana pun Anda berada.`,
        suggestions: [
            'Jelaskan fitur Berita Acara',
            'Jelaskan fitur Manajemen User',
            'Apa saja fitur di aplikasi ini?',
        ],
        actionLink: {
            label: 'Kembali ke Dashboard Utama',
            href: '/dashboard',
        },
    },

    user_roles: {
        title: '👥 Manajemen User & Role Permissions',
        text: `Sistem ini menerapkan kendali akses berbasis peran (*Role-Based Access Control*):\n\n` +
            `🔹 **Peran Pengguna (Roles):**\n` +
            `- **Admin**: Memiliki akses penuh termasuk menu Manajemen Pengguna, pengaturan Role & Permissions, serta ekspor/impor data.\n` +
            `- **User / Petugas**: Berwenang mengelola Berita Acara, mencari referensi kasus, mencetak dokumen, dan mengunggah dokumentasi fisik.\n\n` +
            `🔹 **Manajemen Pengguna (Menu /users):**\n` +
            `- Admin dapat menambah user baru dengan email kedinasan, mengubah role, atau menonaktifkan akun staf yang telah mutasi.`,
        suggestions: [
            'Fitur keamanan Passkey',
            'Jelaskan fitur Pengaturan Akun',
            'Apa saja fitur di aplikasi ini?',
        ],
        actionLink: {
            label: 'Buka Manajemen User',
            href: '/users',
        },
    },

    security_settings: {
        title: '⚙️ Pengaturan Profil, Keamanan, & Passkey',
        text: `Di menu **Pengaturan (Settings)**, Anda dapat mengelola akun dan preferensi pribadi:\n\n` +
            `1. **Profil**: Ubah nama tampilan dan alamat email resmi.\n` +
            `2. **Keamanan & Password**: Perbarui kata sandi berkala demi keamanan data peserta Taspen.\n` +
            `3. **Passkey (WebAuthn / FIDO2)**: Login ultra-aman dan cepat menggunakan sidik jari (fingerprint), Face ID, atau Windows Hello tanpa perlu menghafal kata sandi rumit.\n` +
            `4. **Tema Tampilan (Appearance)**: Pilih mode Gelap (*Dark Mode*), Terang (*Light Mode*), atau ikuti setelan sistem perangkat Anda.`,
        suggestions: [
            'Apa saja fitur di aplikasi ini?',
            'Jelaskan fitur Berita Acara',
            'Ceritakan lelucon santai kantor',
        ],
        actionLink: {
            label: 'Buka Pengaturan Profil',
            href: '/settings/profile',
        },
    },
};

// ── KNOWLEDGE BASE: CHIT-CHAT & RANDOM TOPICS ──────────────────────────
const CHIT_CHAT_RESPONSES = {
    jokes: [
        `😄 **Lelucon Santai Kantor Pensiun:**\n\n**Tanya:** "Berkas apa yang paling setia dan penyabar di dunia?"\n**Jawab:** "Berkas Pensiun!\nKarena dia rela menunggu pengabdian puluhan tahun masa kerja, baru akhirnya bisa mencairkan kebahagiaan hak pensiunan!" ☕📋`,
        `😂 **Jokes Rekan Kerja Taspen:**\n\nPetugas A: "Bro, kenapa komputer layanan Taspen gak pernah masuk angin?"\nPetugas B: "Wah kenapa tuh?"\nPetugas A: "Soalnya dari pagi sampai sore selalu melayani dengan hangat dan penuh empati!" 🩺💻`,
        `😆 **Tebak-tebakan Santai:**\n\n**Tanya:** "Kopi apa yang paling taat administrasi?"\n**Jawab:** "**Kopi-kasi Berita Acara** lengkap dengan foto dokumentasi bertandatangan basah!" ☕✨`,
        `😁 **Pantun Semangat Kerja:**\n\n*Jalan-jalan ke kota Medan,*\n*Singgah sebentar membeli duku.*\n*Biar lelah melayani nasabah seharian,*\n*Pensiunan tersenyum, hati pun sejuk selalu!* 🌸👏`,
    ],

    motivasi: [
        `💪 **Semangat untuk Rekan Pejuang Layanan!**\n\nPekerjaan Anda hari ini bukan sekadar menginput data atau mencetak lembar Berita Acara.\n\nAnda sedang menjaga senyum, martabat, dan hak para abdi negara yang telah mengorbankan masa mudanya puluhan tahun untuk Indonesia.\n\nJika merasa lelah, ambil nafas dalam-dalam, regangkan otot sejenak, minum segelas air hangat atau seruput kopi. Anda luar biasa! 🌟☕`,
        `🌟 **Catatan Hangat Hari Ini:**\n\nMenghadapi peserta lansia yang bingung atau cemas memang butuh kesabaran ekstra. Tapi ingat, di balik setiap tumpukan berkas, ada doa tulus dari para pensiunan yang terbantu oleh ketulusan Anda.\n\nTetap semangat ya! AI Taspen siap menemani proses kerja Anda kapan saja! 😊🤝`,
    ],

    taspen_trivia: `🏢 **Tentang PT TASPEN (Persero):**\n\n` +
        `• **Kepanjangan**: Tabungan dan Asuransi Pegawai Negeri.\n` +
        `• **Tanggal Berdiri**: **17 April 1963** (lebih dari 60 tahun mengabdi untuk jaminan sosial ASN).\n` +
        `• **Slogan / Motto**: *"Melayani Lebih Baik"* & *"Andal Melayani"*.\n` +
        `• **Filosofi Pelayanan 5T**:\n` +
        `  1. **Tepat Orang**: Hak jatuh ke penerima sah yang terverifikasi.\n` +
        `  2. **Tepat Jumlah**: Besaran rupiah sesuai rumus regulasi tanpa potongan liar.\n` +
        `  3. **Tepat Waktu**: Pencairan tidak terlambat dari tanggal hak.\n` +
        `  4. **Tepat Tempat**: Akses kantor cabang & mitra bayar terjangkau.\n` +
        `  5. **Tepat Administrasi**: Berkas, SK, dan Berita Acara tertib arsip.`,

    who_am_i: `🤖 **Tentang Saya:**\n\n` +
        `Saya adalah **Taspen AI Assistant**, asisten digital cerdas internal yang dikembangkan khusus untuk portal operasional ini.\n\n` +
        `**Kemampuan Utama Saya:**\n` +
        `1. Menjawab materi regulasi **UU No. 11 Tahun 1969** secara rinci.\n` +
        `2. Mencari solusi kasus dari bank referensi operasional Taspen.\n` +
        `3. Memandu tata cara penggunaan seluruh fitur aplikasi (Berita Acara, Cetak, Upload Foto, Impor/Ekspor CSV, dll).\n` +
        `4. Menemani Anda mengobrol santai, berbagi jokes, dan menyuntikkan semangat kerja! ☕`,
};

export function DashboardChatbot({
    allCases = [],
    userName = 'Rekan Taspen',
}: DashboardChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1);
    const [copiedCaseId, setCopiedCaseId] = useState<number | null>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    const initialGreeting = `Halo **${userName}**! 👋 Selamat datang di **Asisten AI Taspen**.\n\nSaya siap membantu Anda dalam:\n• 🌟 **Menjelaskan semua fitur aplikasi** (Berita Acara, Upload Foto, Export/Import CSV, User Management, dll)\n• 📜 **Konsultasi regulasi pensiun** UU No. 11 Tahun 1969 & SOP kasus\n• ☕ **Tanya jawab santai**, jokes kantor, atau sekadar berbagi semangat kerja!\n\nAda yang bisa saya bantu hari ini?`;

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'initial-1',
            sender: 'bot',
            text: initialGreeting,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
            suggestions: DEFAULT_SUGGESTIONS,
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll on new message
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setUnreadCount(0);
        }
    }, [messages, isTyping, isOpen, isExpanded]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen]);

    // ── SEARCH & INTELLIGENCE ENGINE ───────────────────────────────────
    const searchKnowledgeBase = (
        query: string
    ): {
        text: string;
        relatedCase?: ReferensiKasus;
        suggestions?: string[];
        actionLink?: { label: string; href: string };
    } => {
        const lower = query.toLowerCase().trim();

        // 1. Sapaan & Ramah-tamah
        if (lower.match(/^(halo|hai|hi|hey|helo|pagi|siang|sore|malam|assalamu|permisi|oy|bro|sis)/)) {
            const timeHour = new Date().getHours();
            let salamWaktu = 'Selamat bertugas';
            if (timeHour >= 5 && timeHour < 11) salamWaktu = 'Selamat pagi';
            else if (timeHour >= 11 && timeHour < 15) salamWaktu = 'Selamat siang';
            else if (timeHour >= 15 && timeHour < 18) salamWaktu = 'Selamat sore';
            else salamWaktu = 'Selamat malam';

            return {
                text: `${salamWaktu}, **${userName}**! Senang bisa menyapa Anda. 😊\n\nAda yang ingin ditanyakan seputar **fitur aplikasi**, ketentuan pensiun **UU No. 11/1969**, atau butuh panduan pembuatan **Berita Acara**?`,
                suggestions: [
                    'Apa saja fitur di aplikasi ini?',
                    'Cara membuat Berita Acara baru',
                    'Syarat pensiun normal UU 11/1969',
                    'Ceritakan lelucon santai kantor',
                ],
            };
        }

        // 2. Kabar / Small Talk
        if (lower.includes('apa kabar') || lower.includes('bagaimana kabarmu') || lower.includes('gimana kabarmu') || lower.includes('sehat')) {
            return {
                text: `Kabar saya luar biasa sehat dan sistem berjalan dengan performa 100%, **${userName}**! 🚀\n\nBagaimana dengan Anda? Semoga tugas pelayanan hari ini lancar dan penuh berkah. Ada yang bisa saya bantu di sistem Taspen?`,
                suggestions: [
                    'Apa saja fitur di aplikasi ini?',
                    'Beri saya motivasi kerja',
                    'Ceritakan jokes bapak-bapak',
                ],
            };
        }

        // 3. Identitas Bot ("Siapa kamu", "Kamu siapa", "Siapa yang buat kamu")
        if (
            lower.includes('siapa kamu') ||
            lower.includes('kamu siapa') ||
            lower.includes('tentang kamu') ||
            lower.includes('siapa pembuat') ||
            lower.includes('siapa bikin') ||
            lower.includes('kamu robot') ||
            lower.includes('apa kemampuanmu') ||
            lower.includes('bisa apa')
        ) {
            return {
                text: CHIT_CHAT_RESPONSES.who_am_i,
                suggestions: [
                    'Apa saja fitur di aplikasi ini?',
                    'Tentang PT Taspen (Trivia)',
                    'Rangkum UU 11 Tahun 1969',
                ],
            };
        }

        // 4. Candaan / Jokes / Lelucon / Humor
        if (
            lower.includes('lelucon') ||
            lower.includes('joke') ||
            lower.includes('jokes') ||
            lower.includes('canda') ||
            lower.includes('tebak') ||
            lower.includes('lucu') ||
            lower.includes('hibur') ||
            lower.includes('pantun')
        ) {
            const randomJoke =
                CHIT_CHAT_RESPONSES.jokes[
                    Math.floor(Math.random() * CHIT_CHAT_RESPONSES.jokes.length)
                ];
            return {
                text: `${randomJoke}\n\n*Semoga bisa sedikit mencairkan suasana di meja kerja! Ada lagi yang mau ditanyakan?* ☕`,
                suggestions: [
                    'Lelucon lainnya dong!',
                    'Beri motivasi kerja',
                    'Apa saja fitur di aplikasi ini?',
                    'Syarat pensiun normal (UU 11/1969)',
                ],
            };
        }

        // 5. Curhat, Capek, Burnout, Motivasi
        if (
            lower.includes('capek') ||
            lower.includes('lelah') ||
            lower.includes('pusing') ||
            lower.includes('stres') ||
            lower.includes('mumet') ||
            lower.includes('semangat') ||
            lower.includes('motivasi') ||
            lower.includes('males') ||
            lower.includes('banyak kerjaan')
        ) {
            const randomMotivation =
                CHIT_CHAT_RESPONSES.motivasi[
                    Math.floor(Math.random() * CHIT_CHAT_RESPONSES.motivasi.length)
                ];
            return {
                text: randomMotivation,
                suggestions: [
                    'Ceritakan lelucon santai kantor',
                    'Tentang PT Taspen (Trivia)',
                    'Apa saja fitur di aplikasi ini?',
                ],
            };
        }

        // 6. Trivia Taspen (Apa itu Taspen, Sejarah, Kapan berdiri, Slogan)
        if (
            lower.includes('apa itu taspen') ||
            lower.includes('sejarah taspen') ||
            lower.includes('kapan berdiri') ||
            lower.includes('kapan taspen') ||
            lower.includes('filosofi taspen') ||
            lower.includes('prinsip 5t') ||
            lower.includes('kepanjangan taspen') ||
            lower.includes('slogan taspen')
        ) {
            return {
                text: CHIT_CHAT_RESPONSES.taspen_trivia,
                suggestions: [
                    'Rangkum UU 11 Tahun 1969',
                    'Apa saja fitur di aplikasi ini?',
                    'Panduan Berita Acara',
                ],
            };
        }

        // 7. Santai Kopi / Ngopi / Istirahat / Makan
        if (
            lower.includes('kopi') ||
            lower.includes('ngopi') ||
            lower.includes('makan') ||
            lower.includes('istirahat') ||
            lower.includes('laper') ||
            lower.includes('lapar')
        ) {
            return {
                text: `☕ **Waktunya Rehat Sejenak!**\n\nMenyeruput secangkir kopi hitam atau teh hangat sembari menyantap camilan sangat dianjurkan untuk menyegarkan fokus pikiran Anda kembali.\n\nJangan lupa tetap jaga asupan air putih ya, **${userName}**! Kapan pun Anda siap melanjutkan penginputan data atau verifikasi Berita Acara, saya selalu stand-by di sini. 😉`,
                suggestions: [
                    'Ceritakan lelucon santai kantor',
                    'Apa saja fitur di aplikasi ini?',
                    'Buka Berita Acara',
                ],
            };
        }

        // 8. Ucapan Terima Kasih
        if (lower.includes('makasih') || lower.includes('terima kasih') || lower.includes('thanks') || lower.includes('tengkyu')) {
            return {
                text: `Sama-sama, **${userName}**! Senang sekali bisa membantu Anda. Jangan ragu bertanya lagi jika ada berkas atau regulasi yang perlu ditelaah. Selamat melanjutkan karya terbaik Anda! 🌟🤝`,
                suggestions: [
                    'Apa saja fitur di aplikasi ini?',
                    'Rangkum UU 11 Tahun 1969',
                    'Ceritakan lelucon santai kantor',
                ],
            };
        }

        // ── INTENT FITUR APLIKASI ───────────────────────────────────────

        // 9. Penjelasan SEMUA Fitur Aplikasi (All Features Overview)
        if (
            (lower.includes('semua fitur') ||
                lower.includes('fitur apa saja') ||
                lower.includes('apa saja fitur') ||
                lower.includes('fitur yang ada') ||
                lower.includes('menu apa saja') ||
                lower.includes('kemampuan aplikasi') ||
                lower.includes('fitur aplikasi')) &&
            !lower.includes('uu 11')
        ) {
            return {
                text: APP_FEATURES_KNOWLEDGE.all_features.text,
                suggestions: APP_FEATURES_KNOWLEDGE.all_features.suggestions,
                actionLink: APP_FEATURES_KNOWLEDGE.all_features.actionLink,
            };
        }

        // 10. Fitur Berita Acara (BA)
        if (
            lower.includes('fitur berita acara') ||
            lower.includes('fitur ba') ||
            lower.includes('cara buat ba') ||
            lower.includes('cara membuat berita acara') ||
            lower.includes('upload foto') ||
            lower.includes('dokumentasi fisik') ||
            lower.includes('cetak berita acara') ||
            lower.includes('download ba') ||
            (lower.includes('notas') && lower.includes('buat'))
        ) {
            return {
                text: APP_FEATURES_KNOWLEDGE.berita_acara.text,
                suggestions: APP_FEATURES_KNOWLEDGE.berita_acara.suggestions,
                actionLink: APP_FEATURES_KNOWLEDGE.berita_acara.actionLink,
            };
        }

        // 11. Fitur Referensi Kasus & Ekspor/Impor CSV
        if (
            lower.includes('fitur referensi kasus') ||
            lower.includes('bank kasus') ||
            lower.includes('fitur kasus') ||
            lower.includes('ekspor csv') ||
            lower.includes('export csv') ||
            lower.includes('impor csv') ||
            lower.includes('import csv')
        ) {
            return {
                text: APP_FEATURES_KNOWLEDGE.referensi_kasus.text,
                suggestions: APP_FEATURES_KNOWLEDGE.referensi_kasus.suggestions,
                actionLink: APP_FEATURES_KNOWLEDGE.referensi_kasus.actionLink,
            };
        }

        // 12. Fitur Dashboard & Statistik
        if (
            lower.includes('fitur dashboard') ||
            lower.includes('grafik') ||
            lower.includes('statistik') ||
            lower.includes('tren bulanan') ||
            lower.includes('distribusi kategori')
        ) {
            return {
                text: APP_FEATURES_KNOWLEDGE.dashboard_feature.text,
                suggestions: APP_FEATURES_KNOWLEDGE.dashboard_feature.suggestions,
                actionLink: APP_FEATURES_KNOWLEDGE.dashboard_feature.actionLink,
            };
        }

        // 13. Fitur Manajemen User & Roles
        if (
            lower.includes('fitur user') ||
            lower.includes('manajemen user') ||
            lower.includes('kelola user') ||
            lower.includes('tambah user') ||
            lower.includes('role') ||
            lower.includes('permission') ||
            lower.includes('hak akses')
        ) {
            return {
                text: APP_FEATURES_KNOWLEDGE.user_roles.text,
                suggestions: APP_FEATURES_KNOWLEDGE.user_roles.suggestions,
                actionLink: APP_FEATURES_KNOWLEDGE.user_roles.actionLink,
            };
        }

        // 14. Fitur Pengaturan, Profil, & Passkey
        if (
            lower.includes('fitur setting') ||
            lower.includes('pengaturan') ||
            lower.includes('passkey') ||
            lower.includes('ganti password') ||
            lower.includes('dark mode') ||
            lower.includes('tema') ||
            lower.includes('profil')
        ) {
            return {
                text: APP_FEATURES_KNOWLEDGE.security_settings.text,
                suggestions: APP_FEATURES_KNOWLEDGE.security_settings.suggestions,
                actionLink: APP_FEATURES_KNOWLEDGE.security_settings.actionLink,
            };
        }

        // ── INTENT REGULASI UU 11/1969 & SOP ─────────────────────────────

        // 15. Ringkasan umum UU Nomor 11 Tahun 1969
        if (
            (lower.includes('uu 11') ||
                lower.includes('uu nomor 11') ||
                lower.includes('1969')) &&
            (lower.includes('rangkum') ||
                lower.includes('ringkas') ||
                lower.includes('apa itu') ||
                lower.includes('tentang apa') ||
                lower.includes('isi') ||
                lower.includes('materi'))
        ) {
            return {
                text: `📜 **Ringkasan Inti UU No. 11 Tahun 1969 (Pensiun Pegawai & Janda/Duda):**\n\n` +
                    `1. **Sifat Hak Pensiun (Pasal 1):** Jaminan hari tua dan penghargaan atas jasa pengabdian pegawai negeri kepada negara.\n` +
                    `2. **Syarat Pensiun Normal (Pasal 9 Ayat 1a):** Usia min. **50 tahun** & masa kerja min. **20 tahun** diberhentikan dengan hormat.\n` +
                    `3. **Cacat Akibat Dinas (Pasal 9 & 11):** Berhak langsung memperoleh pensiun sebesar **75%** tanpa syarat batas umur & masa kerja!\n` +
                    `4. **Rumus Pensiun Bulanan (Pasal 11):** **2,5% x tahun masa kerja x gaji pokok terakhir** (maks. 75%, min. gaji pokok terendah).\n` +
                    `5. **Pensiun Janda/Duda Biasa (Pasal 17):** **36%** dari gaji pokok terakhir almarhum/almarhumah.\n` +
                    `6. **Pensiun Janda/Duda Pegawai TEWAS (Pasal 17 Ayat 3):** Diberikan istimewa sebesar **72%** dari dasar pensiun.\n` +
                    `7. **Hak Pensiun Anak (Pasal 18 & 19):** Diberikan hingga usia **25 tahun**, syarat belum menikah & belum bekerja mandiri.\n` +
                    `8. **Janda Kawin Lagi (Pasal 28):** Hak pensiun dibatalkan/dialihkan ke anak; namun bila kelak bercerai, dapat diaktifkan kembali.\n` +
                    `9. **SK Pensiun (Pasal 30 & 31):** Sah sebagai agunan hanya pada bank resmi yang ditunjuk Menkeu; **DILARANG KERAS** digadaikan ke rentenir/perorangan.`,
                suggestions: [
                    'Rumus perhitungan besaran uang pensiun',
                    'Hak pensiun janda jika menikah lagi',
                    'Batasan usia anak penerima pensiun',
                    'Apakah SK Pensiun boleh digadaikan?',
                ],
                actionLink: {
                    label: 'Buka Bank Kasus UU 11/1969',
                    href: '/referensi-kasus',
                },
            };
        }

        // 16. Kasus Dokumen / SK Hilang
        if (
            lower.includes('sk hilang') ||
            lower.includes('surat hilang') ||
            lower.includes('dokumen hilang') ||
            lower.includes('karpeg hilang')
        ) {
            return {
                text: `📌 **SOP Penanganan Dokumen/SK Pensiun Hilang:**\n\n` +
                    `1. **Surat Kehilangan Resmi**: Peserta wajib melampirkan Surat Tanda Penerimaan Laporan Kehilangan resmi dari Kepolisian setempat.\n` +
                    `2. **Kartu Identitas**: Fotokopi e-KTP dan Kartu Keluarga (KK) yang masih berlaku.\n` +
                    `3. **Penerbitan Berita Acara**: Petugas menerbitkan **Berita Acara Klarifikasi Kehilangan Dokumen** di sistem ini.\n` +
                    `4. **Konfirmasi Database**: Lakukan pencocokan nomor SK pada database BKN/Taspen untuk memproses penerbitan Salinan/Surat Keterangan Pengganti SK resmi.`,
                suggestions: [
                    'Cara membuat Berita Acara kasus ini',
                    'Syarat dan berkas pengajuan pensiun pertama',
                    'Jelaskan semua fitur aplikasi ini',
                ],
                actionLink: {
                    label: 'Buat Berita Acara Kehilangan',
                    href: '/berita-acara',
                },
            };
        }

        // 17. Intelligent Weighted Ranking Matcher over allCases
        if (allCases.length > 0) {
            const words = lower
                .replace(/[^a-z0-9\s]/g, ' ')
                .split(/\s+/)
                .filter((w) => w.length > 1 && !INDONESIAN_STOPWORDS.has(w));

            let highestScore = 0;
            let bestCase: ReferensiKasus | null = null;

            for (const item of allCases) {
                let score = 0;
                const cKode = (item.kode_kasus || '').toLowerCase();
                const cKasus = item.kasus.toLowerCase();
                const cSolusi = item.penyelesaian.toLowerCase();
                const cAturan = (item.aturan || '').toLowerCase();
                const cKategori = (item.kategori || '').toLowerCase();

                // Exact match phrase boost
                if (cKasus.includes(lower)) score += 35;
                if (cSolusi.includes(lower)) score += 20;

                // Keyword match scoring
                for (const word of words) {
                    if (cKode === word) score += 30;
                    if (cKasus.includes(word)) score += 12;
                    if (cSolusi.includes(word)) score += 7;
                    if (cAturan.includes(word)) score += 10;
                    if (cKategori.includes(word)) score += 4;
                }

                // Domain intent synonyms
                if ((lower.includes('1969') || lower.includes('uu 11') || lower.includes('uu11')) && cAturan.includes('1969')) {
                    score += 15;
                }
                if ((lower.includes('mati') || lower.includes('meninggal') || lower.includes('wafat') || lower.includes('tewas') || lower.includes('gugur')) && (cKasus.includes('tewas') || cKasus.includes('meninggal'))) {
                    score += 18;
                }
                if ((lower.includes('janda') || lower.includes('duda') || lower.includes('istri') || lower.includes('suami')) && (cKasus.includes('janda') || cKasus.includes('duda'))) {
                    score += 18;
                }
                if ((lower.includes('nikah') || lower.includes('kawin') || lower.includes('remarriage')) && (cKasus.includes('menikah') || cSolusi.includes('nikah') || cKasus.includes('kawin'))) {
                    score += 25;
                }
                if ((lower.includes('anak') || lower.includes('yatim') || lower.includes('piatu') || lower.includes('25 tahun')) && (cKasus.includes('anak') || cSolusi.includes('anak'))) {
                    score += 22;
                }
                if ((lower.includes('gadai') || lower.includes('pinjam') || lower.includes('agunan') || lower.includes('rentenir')) && (cKasus.includes('pinjaman') || cKasus.includes('gadai'))) {
                    score += 25;
                }
                if ((lower.includes('rumus') || lower.includes('hitung') || lower.includes('persen') || lower.includes('gaji pokok') || lower.includes('2,5') || lower.includes('75%')) && (cKasus.includes('rumus') || cKasus.includes('perhitungan'))) {
                    score += 25;
                }
                if ((lower.includes('uang muka') || lower.includes('panjar') || lower.includes('sk belum') || lower.includes('sementara')) && (cKasus.includes('uang muka') || cSolusi.includes('uang muka'))) {
                    score += 25;
                }
                if ((lower.includes('cacat') || lower.includes('sakit') || lower.includes('lumpuh') || lower.includes('uzur')) && (cKasus.includes('cacat') || cKasus.includes('uzur'))) {
                    score += 22;
                }
                if ((lower.includes('organisasi') || lower.includes('perampingan') || lower.includes('bup') || lower.includes('usia') || lower.includes('50 tahun')) && (cKasus.includes('usia') || cKasus.includes('perampingan'))) {
                    score += 16;
                }

                if (score > highestScore) {
                    highestScore = score;
                    bestCase = item;
                }
            }

            if (bestCase && highestScore >= 12) {
                const otherSuggestions: string[] = [];
                if (bestCase.kode_kasus?.startsWith('UU11')) {
                    otherSuggestions.push('Rumus perhitungan uang pensiun (Pasal 11)');
                    otherSuggestions.push('Hak pensiun anak yatim/piatu (Pasal 18)');
                } else {
                    otherSuggestions.push('Lihat rujukan aturan terkait');
                    otherSuggestions.push('Cara buat Berita Acara kasus ini');
                }
                otherSuggestions.push('Jelaskan semua fitur aplikasi ini');

                return {
                    text: `Ditemukan rujukan kasus & ketentuan hukum resmi di sistem:\n\n📌 **${bestCase.kasus}**\n\n💡 **Ketentuan & Solusi:**\n${bestCase.penyelesaian}\n\n📜 **Dasar Regulasi:**\n${bestCase.aturan || 'SOP Layanan Taspen Terkait'}`,
                    relatedCase: bestCase,
                    suggestions: otherSuggestions,
                    actionLink: {
                        label: 'Lihat di Bank Referensi Kasus',
                        href: '/referensi-kasus',
                    },
                };
            }
        }

        // 18. Fallback Cerdas & Ramah untuk Hal Random di luar database
        return {
            text: `Terima kasih atas pertanyaannya mengenai **"${query}"**! 😊\n\nSebagai Asisten AI Layanan Taspen, wawasan santai saya sangat luas, namun fokus utama keahlian saya adalah mendampingi operasional Anda seputar:\n` +
                `1. 🚀 **Semua Fitur Aplikasi** (Berita Acara, Cetak, Upload Foto, Export/Import CSV, User Management, Passkey)\n` +
                `2. 📜 **Materi Regulasi UU No. 11 Tahun 1969** (Syarat pensiun, perhitungan uang pensiun, hak janda/anak, aturan gadai SK)\n` +
                `3. ☕ **Tanya jawab santai & jokes kantor** untuk menyegarkan hari kerja Anda!\n\nCoba pilih salah satu topik di bawah atau ketik langsung pertanyaan Anda:`,
            suggestions: [
                'Jelaskan semua fitur aplikasi ini',
                'Cara membuat Berita Acara baru',
                'Syarat usia & masa kerja pensiun (UU 11/1969)',
                'Ceritakan lelucon santai kantor',
            ],
        };
    };

    const handleSendMessage = (textToSend?: string) => {
        const query = textToSend || inputValue.trim();
        if (!query) return;

        const userTimestamp = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const newUserMsg: Message = {
            id: 'user-' + Date.now(),
            sender: 'user',
            text: query,
            timestamp: userTimestamp,
        };

        setMessages((prev) => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulasi delay ketik yang natural (500-700ms)
        setTimeout(() => {
            const answer = searchKnowledgeBase(query);
            const botTimestamp = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });

            const newBotMsg: Message = {
                id: 'bot-' + Date.now(),
                sender: 'bot',
                text: answer.text,
                timestamp: botTimestamp,
                relatedCase: answer.relatedCase,
                suggestions: answer.suggestions,
                actionLink: answer.actionLink,
            };

            setMessages((prev) => [...prev, newBotMsg]);
            setIsTyping(false);
        }, 550);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleResetChat = () => {
        setMessages([
            {
                id: 'initial-1',
                sender: 'bot',
                text: initialGreeting,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                suggestions: DEFAULT_SUGGESTIONS,
            },
        ]);
        toast.info('Percakapan bot telah direset ke awal.');
    };

    const handleCopyText = (text: string, msgId?: string, caseId?: number) => {
        navigator.clipboard.writeText(text);
        if (caseId) {
            setCopiedCaseId(caseId);
            setTimeout(() => setCopiedCaseId(null), 2000);
        }
        if (msgId) {
            setCopiedMessageId(msgId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        }
        toast.success('Teks berhasil disalin ke clipboard!');
    };

    return (
        <TooltipProvider delayDuration={150}>
            {/* 1. FLOATING CHATBOT ACTION TRIGGER */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {/* Floating Notification Badge Pill (when closed) */}
                {!isOpen && (
                    <div
                        onClick={() => setIsOpen(true)}
                        className="group flex cursor-pointer items-center gap-2 rounded-full border border-blue-200/90 bg-white/95 px-4 py-2 text-xs font-semibold text-blue-900 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:shadow-2xl dark:border-blue-900/60 dark:bg-slate-900/95 dark:text-blue-200"
                    >
                        <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                            Tanya AI Taspen
                        </span>
                        <Badge
                            variant="secondary"
                            className="bg-blue-100 text-[10px] text-blue-800 font-semibold px-1.5 py-0 dark:bg-blue-950 dark:text-blue-300"
                        >
                            Fitur & Regulasi
                        </Badge>
                    </div>
                )}

                {/* Main Floating Trigger Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Tutup Chat Asisten' : 'Buka Asisten AI Taspen'}
                            className={`group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/35 ring-4 ring-white/90 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-600/60 active:scale-95 dark:ring-slate-900 ${
                                isOpen ? 'rotate-90 bg-slate-800' : ''
                            }`}
                        >
                            {!isOpen && unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-900">
                                    {unreadCount}
                                </span>
                            )}

                            {!isOpen && (
                                <span className="absolute -z-10 inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-30" />
                            )}

                            {isOpen ? (
                                <X className="size-6 transition-transform duration-200" />
                            ) : (
                                <div className="relative flex items-center justify-center">
                                    <Bot className="size-7 transition-transform duration-200 group-hover:scale-110" />
                                    <Sparkles className="absolute -top-1.5 -right-1.5 size-3.5 text-amber-300 animate-bounce" />
                                </div>
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="font-semibold">
                        {isOpen ? 'Tutup Chat' : 'Buka Asisten AI Taspen'}
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* 2. CHATBOT WINDOW (MODERN, RESPONSIVE, EXPANDABLE) */}
            {isOpen && (
                <Card
                    className={`fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-blue-200/80 bg-card/98 text-card-foreground shadow-2xl shadow-blue-900/30 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200 dark:border-slate-800 dark:shadow-black/60 ${
                        isExpanded
                            ? 'bottom-4 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[760px] h-[calc(100vh-2rem)] sm:h-[680px] max-h-[92vh]'
                            : 'bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[85vh]'
                    }`}
                >
                    {/* Header with Taspen Royal Gradient */}
                    <CardHeader className="relative flex-none bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="size-10 border-2 border-white/90 bg-white/20 shadow-inner">
                                        <AvatarFallback className="bg-white/25 text-white font-bold">
                                            <Bot className="size-5.5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-blue-700 bg-emerald-400 ring-1 ring-emerald-300" />
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                                            Taspen AI Assistant
                                            <Sparkles className="size-3.5 text-amber-300" />
                                        </CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className="h-4.5 border-none bg-emerald-500/30 px-1.5 text-[10px] font-semibold text-emerald-100 backdrop-blur-xs"
                                        >
                                            Online 24/7
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs text-blue-100/90 line-clamp-1">
                                        Panduan Fitur, Regulasi UU 11/1969, & Konsultasi
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Header Action Controls */}
                            <div className="flex items-center gap-1">
                                {/* Maximize / Expand Window */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="size-8 text-white/80 hover:bg-white/20 hover:text-white"
                                        >
                                            {isExpanded ? (
                                                <Minimize2 className="size-4" />
                                            ) : (
                                                <Maximize2 className="size-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        {isExpanded ? 'Kecilkan Tampilan' : 'Perbesar Tampilan'}
                                    </TooltipContent>
                                </Tooltip>

                                {/* Reset Chat */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleResetChat}
                                            className="size-8 text-white/80 hover:bg-white/20 hover:text-white"
                                        >
                                            <RotateCcw className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Reset Percakapan</TooltipContent>
                                </Tooltip>

                                {/* Minimize */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsOpen(false)}
                                            className="size-8 text-white/80 hover:bg-white/20 hover:text-white"
                                        >
                                            <Minus className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Minimalkan</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Quick Topics Pill Bar */}
                        <div className="mt-3 -mx-1 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {QUICK_TOPICS.map((topic) => (
                                <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => handleSendMessage(topic.query)}
                                    className="shrink-0 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/30 hover:border-white/40 active:scale-95"
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>

                    {/* Chat Messages Body */}
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${
                                    msg.sender === 'user' ? 'items-end' : 'items-start'
                                }`}
                            >
                                <div
                                    className={`flex gap-2.5 max-w-[94%] ${
                                        msg.sender === 'user'
                                            ? 'flex-row-reverse'
                                            : 'flex-row'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <Avatar className="size-7.5 shrink-0 border mt-0.5 shadow-xs">
                                        <AvatarFallback
                                            className={
                                                msg.sender === 'user'
                                                    ? 'bg-blue-600 text-white text-[11px] font-bold'
                                                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                            }
                                        >
                                            {msg.sender === 'user' ? (
                                                userName.charAt(0).toUpperCase()
                                            ) : (
                                                <Bot className="size-4" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Message Bubble Container */}
                                    <div className="flex flex-col gap-1.5">
                                        <div
                                            className={`group relative rounded-2xl px-4 py-3 text-sm shadow-xs transition-all ${
                                                msg.sender === 'user'
                                                    ? 'rounded-tr-xs bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                                                    : 'rounded-tl-xs border border-slate-200/90 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                                            }`}
                                        >
                                            {/* Text Content with Enhanced Markdown Parsing */}
                                            <div className="space-y-1.5 leading-relaxed text-sm">
                                                {msg.text.split('\n').map((line, i) => {
                                                    if (line.trim() === '') {
                                                        return <div key={i} className="h-2" />;
                                                    }

                                                    // Bullet items
                                                    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
                                                    const cleanLine = isBullet ? line.replace(/^[\s•\-\*]+\s*/, '') : line;

                                                    // Process bold segments
                                                    const parts = cleanLine.split('**');

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`flex items-start gap-1.5 ${
                                                                isBullet ? 'pl-2' : ''
                                                            }`}
                                                        >
                                                            {isBullet && (
                                                                <span className="text-blue-500 font-bold shrink-0 mt-0.5">
                                                                    •
                                                                </span>
                                                            )}
                                                            <div className="flex-1">
                                                                {parts.map((part, idx) =>
                                                                    idx % 2 === 1 ? (
                                                                        <strong
                                                                            key={idx}
                                                                            className={
                                                                                msg.sender === 'user'
                                                                                    ? 'font-bold text-white'
                                                                                    : 'font-semibold text-blue-900 dark:text-blue-300'
                                                                            }
                                                                        >
                                                                            {part}
                                                                        </strong>
                                                                    ) : (
                                                                        part
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Action Link Button if Available */}
                                            {msg.actionLink && (
                                                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-medium text-white shadow-xs hover:from-blue-700 hover:to-indigo-700"
                                                    >
                                                        <Link href={msg.actionLink.href}>
                                                            <span>{msg.actionLink.label}</span>
                                                            <ArrowRight className="ml-1.5 size-3.5" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Related Case Card if matched */}
                                            {msg.relatedCase && (
                                                <div className="mt-3 rounded-xl border border-blue-200/90 bg-blue-50/80 p-3 text-xs text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                                                    <div className="flex items-center justify-between pb-1.5 font-bold text-blue-800 dark:text-blue-300">
                                                        <span className="flex items-center gap-1.5">
                                                            <Badge
                                                                variant="outline"
                                                                className="border-blue-300 bg-blue-100/60 px-1.5 text-[10px] font-bold text-blue-900 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                                                            >
                                                                {msg.relatedCase.kode_kasus || 'KASUS'}
                                                            </Badge>
                                                            <span>{msg.relatedCase.kategori}</span>
                                                        </span>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleCopyText(
                                                                    `[KASUS]: ${msg.relatedCase?.kasus}\n[SOLUSI]: ${msg.relatedCase?.penyelesaian}\n[ATURAN]: ${msg.relatedCase?.aturan || '-'}`,
                                                                    undefined,
                                                                    msg.relatedCase?.id
                                                                )
                                                            }
                                                            className="h-6 px-2 text-[11px] font-semibold text-blue-700 hover:bg-blue-200/60 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                                        >
                                                            {copiedCaseId === msg.relatedCase.id ? (
                                                                <>
                                                                    <Check className="mr-1 size-3 text-emerald-600" />
                                                                    Tersalin
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="mr-1 size-3" />
                                                                    Salin Solusi
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <div className="italic text-slate-700 line-clamp-2 dark:text-slate-300">
                                                        "{msg.relatedCase.penyelesaian}"
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quick Copy Message Action for Bot */}
                                            {msg.sender === 'bot' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyText(msg.text, msg.id)}
                                                    aria-label="Salin Jawaban"
                                                    className="absolute -bottom-2.5 right-3 flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                >
                                                    {copiedMessageId === msg.id ? (
                                                        <>
                                                            <Check className="size-2.5 text-emerald-600" />
                                                            <span>Tersalin</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="size-2.5" />
                                                            <span>Salin</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Timestamp */}
                                        <span
                                            className={`text-[10px] text-muted-foreground px-1 ${
                                                msg.sender === 'user' ? 'text-right' : 'text-left'
                                            }`}
                                        >
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>

                                {/* Suggestion Chips */}
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="mt-2 pl-10 flex flex-wrap gap-1.5">
                                        {msg.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSendMessage(suggestion)}
                                                className="group inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-3 py-1 text-xs font-medium text-blue-700 shadow-2xs transition-all hover:bg-blue-50 hover:border-blue-300 hover:scale-[1.02] active:scale-98 dark:border-blue-900/60 dark:bg-slate-900/90 dark:text-blue-300 dark:hover:bg-slate-800"
                                            >
                                                <Lightbulb className="size-3 text-amber-500 group-hover:rotate-12 transition-transform" />
                                                <span>{suggestion}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator bubble */}
                        {isTyping && (
                            <div className="flex items-center gap-2.5">
                                <Avatar className="size-7.5 shrink-0 border">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                        <Bot className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white px-4 py-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                                        <span className="size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                                        <span className="size-2 rounded-full bg-blue-500 animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Chat Input Footer */}
                    <CardFooter className="flex-none flex-col border-t bg-card p-3 gap-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex w-full items-center gap-2"
                        >
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tanya fitur aplikasi, UU 11/1969, atau sapa bot..."
                                disabled={isTyping}
                                className="h-10 text-sm focus-visible:ring-blue-500 rounded-xl"
                            />

                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim() || isTyping}
                                className="size-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                            >
                                <Send className="size-4" />
                            </Button>
                        </form>

                        <div className="flex items-center justify-between w-full px-1 text-[11px] text-muted-foreground">
                            {/* <span className="flex items-center gap-1">
                                <Sparkles className="size-3 text-amber-500" />
                                AI Layanan Taspen • Selalu Siap 24/7
                            </span> */}
                            {/* <span>Tekan Enter ↵ untuk kirim</span> */}
                        </div>
                    </CardFooter>
                </Card>
            )}
        </TooltipProvider>
    );
}
