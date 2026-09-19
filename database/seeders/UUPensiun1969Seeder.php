<?php

namespace Database\Seeders;

use App\Models\ReferensiKasus;
use Illuminate\Database\Seeder;

class UUPensiun1969Seeder extends Seeder
{
    /**
     * Run the database seeds.
     * Mengisi materi referensi kasus dan panduan operasional Taspen
     * yang bersumber dari UU No. 11 Tahun 1969 (Pensiun Pegawai dan Janda/Duda).
     */
    public function run(): void
    {
        $cases = [
            [
                'kode_kasus'   => 'UU11-001',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Syarat usia minimum dan masa kerja untuk memperoleh hak pensiun pegawai biasa yang diberhentikan dengan hormat.',
                'penyelesaian' => "Berdasarkan UU No. 11 Tahun 1969 Pasal 9 Ayat (1) huruf a:\n1. Pegawai wajib diberhentikan dengan hormat dari dinas pemerintah.\n2. Telah mencapai usia sekurang-kurangnya 50 (lima puluh) tahun.\n3. Memiliki masa kerja untuk pensiun sekurang-kurangnya 20 (dua puluh) tahun.\nPetugas memverifikasi SK Pemberhentian Dengan Hormat dari PPK/BKN dan lembar riwayat masa kerja resmi.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 9 Ayat (1) Huruf a',
            ],
            [
                'kode_kasus'   => 'UU11-002',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Hak pensiun pegawai yang mengalami kecelakaan dinas / cacat jasmani atau rohani karena menjalankan tugas kewajiban.',
                'penyelesaian' => "Berdasarkan Pasal 9 Ayat (1) huruf b jo. Pasal 11 Ayat (1) huruf b:\n1. Pegawai yang dinyatakan tidak dapat bekerja lagi dalam jabatan apapun karena cacat jasmani/rohani akibat menjalankan tugas kedinasan berhak langsung memperoleh hak pensiun.\n2. TIDAK terikat syarat batas usia minimum 50 tahun maupun masa kerja 20 tahun.\n3. Besaran pensiun pegawai sebulan langsung ditetapkan maksimum 75% dari dasar pensiun dan dipertinggi dengan tunjangan kecacatan dinas sesuai ketentuan PP yang berlaku.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 9 Ayat (1) Huruf b jo. Pasal 11 Ayat (1) & (2)',
            ],
            [
                'kode_kasus'   => 'UU11-003',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Hak pensiun pegawai yang dinyatakan uzur/sakit permanen BUKAN karena menjalankan kewajiban dinas.',
                'penyelesaian' => "Berdasarkan Pasal 9 Ayat (1) huruf c:\nPegawai yang dinyatakan oleh Tim Penguji Kesehatan tidak dapat bekerja lagi dalam jabatan apapun karena keadaan jasmani/rohani di luar dinas berhak menerima pensiun pegawai apabila telah memiliki masa kerja sekurang-kurangnya 4 (empat) tahun.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 9 Ayat (1) Huruf c',
            ],
            [
                'kode_kasus'   => 'UU11-004',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Pegawai diberhentikan karena perampingan organisasi / penertiban aparatur negara sebelum mencapai usia 50 tahun.',
                'penyelesaian' => "Berdasarkan Pasal 9 Ayat (2) dan Ayat (4):\n1. Pegawai yang diberhentikan dengan hormat karena perampingan susunan pegawai/penertiban aparatur berhak pensiun jika memiliki masa kerja sekurang-kurangnya 10 tahun.\n2. Jika pada saat diberhentikan usianya belum mencapai 50 tahun, maka pemberian dan pembayaran pensiunnya ditangguhkan dan baru mulai dibayarkan pada bulan berikutnya saat yang bersangkutan genap berusia 50 tahun.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 9 Ayat (2) & Ayat (4)',
            ],
            [
                'kode_kasus'   => 'UU11-005',
                'kategori'     => 'Keuangan',
                'kasus'        => 'Rumus dan tata cara perhitungan besaran uang pensiun bulanan pegawai negeri.',
                'penyelesaian' => "Berdasarkan Pasal 11 Ayat (1) jo. Pasal 5:\n1. Dasar pensiun dihitung dari gaji pokok terakhir sebulan (termasuk gaji pokok tambahan yang sah).\n2. Besarnya pensiun sebulan adalah 2,5% (dua setengah persen) dari dasar pensiun untuk tiap-tiap satu tahun masa kerja.\n3. Maksimal besaran pensiun sebulan adalah 75% dari dasar pensiun.\n4. Nominal pensiun bulanan tidak boleh lebih rendah dari gaji pokok terendah menurut peraturan gaji yang berlaku.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 11 Ayat (1) & Pasal 5',
            ],
            [
                'kode_kasus'   => 'UU11-006',
                'kategori'     => 'Administrasi',
                'kasus'        => 'Syarat dan kelengkapan dokumen pengajuan hak pensiun pertama kali bagi pegawai yang purna tugas.',
                'penyelesaian' => "Berdasarkan Pasal 12 UU No. 11 Tahun 1969, pemohon mengajukan surat permintaan pensiun dengan melampirkan:\n1. Salinan sah Surat Keputusan (SK) Pemberhentian Dengan Hormat sebagai Pegawai Negeri.\n2. Daftar Riwayat Pekerjaan yang disahkan oleh pejabat/badan negara berwenang.\n3. Daftar Susunan Keluarga (SKUMPTK/Kartu Keluarga) yang disahkan instansi berwenang memuat data suami/istri dan anak.\n4. Surat Keterangan penyerahan kembali seluruh surat-surat, arsip, dan barang inventaris milik negara kepada instansi asal.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 12',
            ],
            [
                'kode_kasus'   => 'UU11-007',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Hak dan besaran uang pensiun janda atau pensiun duda bagi pegawai/pensiunan yang meninggal dunia biasa.',
                'penyelesaian' => "Berdasarkan Pasal 16 & Pasal 17 Ayat (1) & (2):\n1. Istri/suami sah yang terdaftar berhak menerima pensiun janda/duda sebesar 36% dari dasar pensiun (gaji pokok terakhir almarhum/almarhumah).\n2. Besaran 36% tersebut tidak boleh kurang dari 75% gaji pokok terendah pegawai negeri yang berlaku.\n3. Apabila pegawai pria memiliki lebih dari 1 (satu) istri sah yang terdaftar resmi, maka bagian 36% tersebut dibagi rata kepada seluruh istri terdaftar.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 16 & Pasal 17 Ayat (1) & (2)',
            ],
            [
                'kode_kasus'   => 'UU11-008',
                'kategori'     => 'Klaim',
                'kasus'        => 'Hak pensiun janda/duda istimewa bagi pegawai negeri yang dinyatakan TEWAS dalam menjalankan tugas kewajiban negara.',
                'penyelesaian' => "Berdasarkan Pasal 4 jo. Pasal 17 Ayat (3) & (4):\n1. Pegawai dinyatakan TEWAS bila meninggal dunia dalam dan karena menjalankan tugas, atau akibat langsung dari luka dinas.\n2. Besarnya pensiun janda/duda pegawai tewas diberikan sebesar 72% dari dasar pensiun (2x lipat dari janda biasa).\n3. Nominal pensiun tidak boleh kurang dari gaji pokok terendah.\n4. Apabila memiliki lebih dari satu istri sah terdaftar, maka besaran 72% dibagi rata.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 4 & Pasal 17 Ayat (3)',
            ],
            [
                'kode_kasus'   => 'UU11-009',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Syarat dan batas usia hak pensiun anak yatim/piatu jika penerima pensiun janda/duda meninggal dunia.',
                'penyelesaian' => "Berdasarkan Pasal 18 Ayat (1) & (4) jo. Pasal 19 Ayat (4):\nHak pensiun janda/duda diteruskan kepada anak sah dengan kriteria kumulatif:\n1. Belum mencapai usia 25 (dua puluh lima) tahun.\n2. Belum mempunyai penghasilan sendiri.\n3. Belum pernah menikah/belum kawin.\nPemberian pensiun anak berakhir pada akhir bulan saat kriteria di atas sudah tidak terpenuhi lagi (misal sudah menikah, bekerja mandiri, atau melewati usia 25 tahun).",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 18 Ayat (4) & Pasal 25',
            ],
            [
                'kode_kasus'   => 'UU11-010',
                'kategori'     => 'Administrasi',
                'kasus'        => 'Batas waktu pelaporan / pendaftaran perkawinan atau kelahiran anak baru untuk hak pensiun keluarga.',
                'penyelesaian' => "Berdasarkan Pasal 19 Ayat (6):\nPendaftaran istri, suami, maupun anak sebagai pihak yang berhak menerima pensiun wajib didaftarkan selambat-lambatnya dalam waktu 1 (satu) tahun sesudah tanggal perkawinan atau kelahiran anak. Pendaftaran yang diajukan melampaui batas waktu 1 tahun tidak dapat diterima hak pensiunnya.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 19 Ayat (6)',
            ],
            [
                'kode_kasus'   => 'UU11-011',
                'kategori'     => 'Klaim',
                'kasus'        => 'Hak pensiun bagi orang tua jika pegawai berstatus bujang/lajang TEWAS dalam tugas dinas.',
                'penyelesaian' => "Berdasarkan Pasal 20 Ayat (1) & (2):\nApabila pegawai negeri TEWAS dalam dinas dan tidak meninggalkan istri/suami maupun anak, maka hak pensiun dialihkan kepada orang tua kandungnya sebesar 20% dari hak pensiun janda/duda tewas (20% x 72% dasar pensiun). Jika kedua orang tua telah bercerai, masing-masing diberikan separuh dari jumlah tersebut.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 20',
            ],
            [
                'kode_kasus'   => 'UU11-012',
                'kategori'     => 'Keuangan',
                'kasus'        => 'Permohonan uang muka pensiun sementara jika penetapan SK pensiun definitif belum selesai terbit.',
                'penyelesaian' => "Berdasarkan Pasal 26 UU No. 11 Tahun 1969:\nJika syarat kelengkapan administrasi belum selesai sepenuhnya atau karena kendala teknis penetapan pensiun definitif belum dapat dilaksanakan, pejabat berwenang dapat membayarkan UANG MUKA ATAS PENSIUN sementara kepada penerima pensiun/janda/duda/anak agar kelangsungan nafkah keluarga tetap terjaga.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 26',
            ],
            [
                'kode_kasus'   => 'UU11-013',
                'kategori'     => 'Administrasi',
                'kasus'        => 'Pembatalan pensiun janda/duda jika menikah kembali (kawin lagi) dan hak aktivasi ulang bila bercerai.',
                'penyelesaian' => "Berdasarkan Pasal 28 Ayat (1) & (2):\n1. Pensiun janda/duda yang tidak mempunyai tanggungan anak dibatalkan mulai bulan berikutnya pernikahan baru dilangsungkan.\n2. Jika janda/duda memiliki tanggungan anak yang sah, hak pensiun dialihkan kepada anak-anaknya.\n3. Khusus janda: apabila pernikahan keduanya kemudian terputus (karena cerai atau suami wafat), hak pensiun janda dari almarhum suami pertama dapat diaktifkan kembali mulai bulan berikutnya permohonan diajukan.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 28 Ayat (1) & (2)',
            ],
            [
                'kode_kasus'   => 'UU11-014',
                'kategori'     => 'Kasus Hukum',
                'kasus'        => 'Kondisi yang menyebabkan hapus / gugurnya hak pensiun pegawai atau pensiun janda/duda.',
                'penyelesaian' => "Berdasarkan Pasal 29 Ayat (1) & (2):\nHak pensiun hapus dan SK pensiun dibatalkan/dicabut apabila penerima:\n1. Menjadi anggota militer atau pegawai negeri suatu negara asing tanpa izin sah dari Pemerintah RI.\n2. Dinyatakan bersalah melakukan perbuatan atau terlibat dalam gerakan yang bertentangan dengan Pancasila dan Haluan Negara berdasarkan putusan pengadilan.\n3. Terbukti memalsukan data / keterangan yang diajukan sebagai syarat penetapan pensiun. Kelebihan pensiun yang telah terbayar wajib ditagih kembali ke kas negara.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 29 Ayat (1) & (2)',
            ],
            [
                'kode_kasus'   => 'UU11-015',
                'kategori'     => 'Keuangan',
                'kasus'        => 'Penggunaan SK Pensiun untuk jaminan pinjaman bank dan larangan penggadaian hak pensiun secara ilegal.',
                'penyelesaian' => "Berdasarkan Pasal 30 dan Pasal 31:\n1. SK Pensiun secara sah DAPAT dipergunakan sebagai jaminan pinjaman HANYA pada Bank resmi yang ditunjuk oleh Menteri Keuangan.\n2. DILARANG KERAS memindahtangankan, menggadaikan, atau menyerahkan kuasa penerimaan uang pensiun kepada pihak ketiga/perorangan/rentenir.\n3. Semua surat perjanjian gadai atau penyerahan kuasa hak pensiun yang bertentangan dengan aturan ini dinyatakan BATAL DEMI HUKUM dan tidak memiliki kekuatan hukum.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 30 & Pasal 31',
            ],
            [
                'kode_kasus'   => 'UU11-016',
                'kategori'     => 'Administrasi',
                'kasus'        => 'Penetapan batas usia pensiun jika terdapat perbedaan tanggal lahir pada dokumen atau ijazah di kemudian hari.',
                'penyelesaian' => "Berdasarkan Pasal 10 UU No. 11 Tahun 1969:\nUsia pegawai untuk penetapan hak pensiun ditentukan mutlak berdasarkan tanggal kelahiran yang tercantum pada pengangkatan pertama sebagai pegawai negeri (SK CPNS/PNS pertama). Tanggal kelahiran tersebut TIDAK DAPAT DIUBAH LAGI untuk keperluan perhitungan hak atas pensiun pegawai.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 10',
            ],
            [
                'kode_kasus'   => 'UU11-017',
                'kategori'     => 'Pensiun',
                'kasus'        => 'Status pensiun bagi pegawai penerima pensiun yang diangkat kembali menjadi Pegawai Negeri aktif.',
                'penyelesaian' => "Berdasarkan Pasal 15 Ayat (1) & (2):\n1. Pembayaran uang pensiun dihentikan sementara jika penerima pensiun diangkat kembali menjadi Pegawai Negeri/pejabat negeri yang berhak pensiun.\n2. Setelah diberhentikan kembali dari kedudukan terakhirnya, kepadanya ditetapkan kembali hak pensiun dengan mempertimbangkan gabungan masa kerja dan gaji lama vs baru, dengan memilih formula perhitungan yang paling menguntungkan bagi pensiunan.",
                'aturan'       => 'UU No. 11 Tahun 1969 Pasal 15',
            ],
        ];

        foreach ($cases as $case) {
            ReferensiKasus::updateOrCreate(
                ['kode_kasus' => $case['kode_kasus']],
                [
                    'kategori'     => $case['kategori'],
                    'kasus'        => $case['kasus'],
                    'penyelesaian' => $case['penyelesaian'],
                    'aturan'       => $case['aturan'],
                ]
            );
        }

        $this->command?->info('✅ Berhasil menyuntikkan ' . count($cases) . ' referensi materi UU No. 11 Tahun 1969 ke database.');
    }
}
