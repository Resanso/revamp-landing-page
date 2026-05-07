# Kebutuhan Spesifikasi Admin Panel PRODIGI

## 📌 Tujuan Utama

[cite_start]Mengubah data _landing page_ PRODIGI yang saat ini statis menjadi dinamis dengan kapabilitas CRUD (Create, Read, Update, Delete)[cite: 1, 2]. Sistem akan menggunakan Supabase sebagai _Backend-as-a-Service_ (BaaS) untuk manajemen _database_ dan penyimpanan aset.

## ⚙️ Fitur Autentikasi (Auth)

- [cite_start]**Halaman Login:** Hanya menyediakan _input_ Email dan Password[cite: 106].
- [cite_start]**Batasan Akses:** Tidak ada halaman registrasi (akun dikelola/dibuat langsung dari _database_ Supabase) dan tidak ada fitur/tombol "Lupa Password"[cite: 106].
- [cite_start]**Fitur Logout:** Terdapat di _navbar_ atas bagian kanan berupa _icon_ profil _user_[cite: 107]. [cite_start]Jika diklik, akan muncul _overlay/popup_ yang menampilkan: Nama Lengkap, Email, NIM, dan tombol "Logout"[cite: 107].

## 🗂️ Kebutuhan Manajemen Konten (CMS) per Halaman

### 1. Halaman Utama (Home)

- [cite_start]**Hero Section:** Admin dapat mengganti _background_ foto utama[cite: 3, 4, 14].
- [cite_start]**Our Success Stories:** Membutuhkan _input_ angka/teks dinamis untuk statistik: Departemen, Executive Members, Program, dan Pencapaian (misal: 9, 70, 5+, 100+)[cite: 15, 16, 17, 18, 19, 21].
- [cite_start]**Media Gambar:** Admin dapat mengganti format gambar pada bagian departemen, anggota eksekutif, program, dan pencapaian[cite: 23, 24].

### 2. Halaman Tentang (About)

- [cite_start]**Hero Section:** _Background_ dan foto pada setiap departemen dapat diganti[cite: 31, 32].
- [cite_start]**Leaders Board:** Membutuhkan sistem _Card_ dinamis[cite: 33, 34].
  - [cite_start]_Input_ data: Foto, Kalimat/Quotes dari Leader, Nama, dan Tahun[cite: 38].
  - [cite_start]_Catatan:_ Teks jabatan "LEAD" bersifat statis (tidak berubah)[cite: 37, 38].
- [cite_start]**Foto Slide:** Sistem galeri di mana admin dapat menambah atau menghapus gambar secara leluasa[cite: 40, 45].

### 3. Executive Members & Gallery

- [cite_start]**Executive Members:** Data dikelompokkan berdasarkan "Tahun Periode"[cite: 46, 50].
  - [cite_start]Admin dapat menambah/membuat Tahun Periode baru[cite: 50].
  - [cite_start]Di dalam setiap periode, admin dapat mengisi _Card_ anggota dengan _input_: Foto, Jabatan, Nama, NIM, Jurusan, Angkatan, Link LinkedIn, dan Link Instagram[cite: 50].
- [cite_start]**Executive Gallery:** Juga dikelompokkan berdasarkan Tahun Periode[cite: 53, 54]. [cite_start]Admin dapat menambah dan menghapus kumpulan foto di dalam periode tersebut[cite: 54].

### 4. Hall of Fame

- [cite_start]Data dikelompokkan berdasarkan "Tahun Pencapaian"[cite: 55, 73].
- [cite_start]Admin dapat menambahkan _Card_ pencapaian di dalam tiap tahun dengan _input_: Foto, Headline (Judul Pencapaian), dan Deskripsi[cite: 73].

### 5. Activities

- [cite_start]Admin dapat menambahkan entri aktivitas baru[cite: 74, 90].
- _Input_ data yang dibutuhkan untuk setiap aktivitas:
  1.  [cite_start]Judul [cite: 91]
  2.  [cite_start]Deskripsi [cite: 92]
  3.  [cite_start]Foto [cite: 93]
  4.  [cite_start]Kategori (_Enum_ statis: `EVENT`, `INFORMATION`, `ARTICLE`) [cite: 94]
  5.  [cite_start]Tanggal _Upload_ (Dihasilkan secara otomatis oleh sistem berdasarkan waktu hari tersebut)[cite: 95].

## 🎨 Panduan UI/UX Admin Panel

- [cite_start]**Navigasi (_Sidebar_):** Menu harus mencakup struktur dari web utama: HOME, ABOUT, EXECUTIVE, HALL OF FAME, dan ACTIVITIES[cite: 97, 98, 99, 100, 101].
- [cite_start]**Tata Letak (_Layout_):** Area utama (_Main Content_) menampilkan antarmuka tabel data atau _form_ input sesuai menu navigasi yang dipilih[cite: 102].
- [cite_start]**Desain Konsisten:** Antarmuka harus sederhana, _user-friendly_, saling terhubung, dan memiliki _style/vibes_ yang konsisten dengan _website_ utama PRODIGI[cite: 104].
