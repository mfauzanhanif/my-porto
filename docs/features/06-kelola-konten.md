# Kelola Konten

Halaman pengelolaan agar Anda bisa menambah dan memperbarui semua isi web kapan saja.

## Spesifikasi

### Tujuan
Menyediakan satu area pengelolaan agar Anda bisa menambah, mengubah, dan menghapus seluruh isi web sendiri tanpa menyentuh kode, sehingga portofolio selalu bisa diperbarui kapan saja.

### Selesai bila
- Ada satu halaman pengelolaan yang hanya bisa dibuka setelah masuk sebagai admin, dengan menu menuju tiap jenis konten.
- Setiap jenis konten (proyek, artikel, skill, pendidikan, pengalaman, sertifikat, profil, kategori, tag) bisa ditambah, diubah, dan dihapus dari halaman pengelolaan.
- Setiap kali data disimpan, muncul pesan berhasil/gagal yang jelas dan perubahan langsung terlihat di halaman publik.
- Setiap form menolak data yang tidak lengkap atau tidak sesuai dan menampilkan pesan kesalahan pada kolom yang bermasalah.
- Setiap daftar konten menampilkan isinya dengan rapi dan bisa digulir/dipagi bila jumlahnya banyak, serta tetap nyaman dipakai di ponsel maupun desktop.

## Sub-fitur: Dashboard Ringkasan

Gambaran sekilas jumlah artikel, proyek, dan konten lain yang sudah tayang.

### Tujuan
Memberi Anda gambaran sekilas berapa banyak konten yang sudah tayang di web, sebagai titik awal pengelolaan.

### Selesai bila
- Halaman ini menampilkan jumlah artikel, proyek, skill, pendidikan, pengalaman, dan sertifikat yang tersimpan (mis. "12 Artikel").
- Untuk artikel dan proyek, ditampilkan pemisahan antara yang sudah tayang dan yang masih draf/menunggu.
- Dari angka ringkasan, tersedia jalan pintas menuju daftar konten terkait.

### Tujuan
Memungkinkan Anda mengelola daftar proyek beserta gambar sampulnya dari satu tempat.

### Selesai bila
- Ada daftar semua proyek dengan judul, gambar sampul, dan penanda apakah proyek tampil di beranda.
- Anda bisa menambah proyek baru, mengubah proyek yang ada, dan menghapus proyek, termasuk mengunggah atau mengganti gambar sampulnya.
- Saat menambah atau mengubah proyek, Anda bisa memilih kategori yang sesuai dan menandai proyek sebagai unggulan.

### Tujuan
Memungkinkan Anda menulis dan menyunting artikel dengan format seperti di aplikasi pengolah teks, lalu menyimpannya sebagai konten yang siap tayang.

### Selesai bila
- Tersedia editor teks yang bisa membuat teks tebal, judul/bagian, daftar, tautan, dan menyisipkan gambar di dalam isi artikel.
- Artikel bisa disimpan sebagai draf atau diterbitkan, diberi penanda unggulan, serta dilengkapi judul, ringkasan, gambar sampul, kategori, dan tag.
- Artikel yang sudah tersimpan bisa dibuka kembali dan disunting tanpa kehilangan formatnya.

### Tujuan
Memusatkan pembaruan data keahlian, pendidikan, pengalaman kerja, dan sertifikat dalam satu area agar rekam jejak Anda selalu mutakhir.

### Selesai bila
- Tiap jenis data (skill, pendidikan, pengalaman, sertifikat) punya daftar sendiri dengan tombol untuk menambah, mengubah, dan menghapus.
- Untuk skill, Anda bisa mengisi tingkat kemahiran, kelompok bidang, dan menandainya sebagai unggulan.
- Untuk pendidikan dan pengalaman, Anda bisa mengisi institusi/perusahaan, peran atau jenjang, serta periode waktunya.
- Untuk sertifikat, Anda bisa mengunggah gambar sertifikat dan menambahkan tautan verifikasi.

### Tujuan
Memungkinkan Anda memperbarui identitas dan cara pengunjung menghubungi Anda tanpa menyentuh kode.

### Selesai bila
- Anda bisa mengubah foto profil, nama, tagline, dan cerita singkat tentang diri, serta melihat pratinjau foto yang diunggah.
- Anda bisa mengubah email kontak dan menambah, mengubah, atau menghapus tautan media sosial (mis. LinkedIn, GitHub, Instagram).
- Perubahan yang disimpan langsung tampil di bagian perkenalan dan kontak pada halaman publik.

## Sub-fitur: Kelola Proyek

Menambah, mengubah, dan menghapus proyek beserta gambarnya.

## Sub-fitur: Tulis Artikel dengan Editor

Menulis artikel dengan format tebal, judul, dan gambar seperti di aplikasi pengolah teks.

## Sub-fitur: Kelola Skill, Riwayat & Sertifikat

Memperbarui data keahlian, pendidikan, pengalaman, dan sertifikat.

## Sub-fitur: Kelola Profil & Kontak

Memperbarui foto, perkenalan, dan informasi kontak Anda.

## Task

### 1. Bangun layout halaman pengelolaan dengan sidebar navigasi

### 2. Buat halaman dashboard ringkasan dengan data tiruan

### 3. Buat halaman daftar proyek dengan data tiruan

### 4. Buat form tambah ubah proyek dengan unggah sampul

### 5. Buat halaman daftar artikel dengan data tiruan

### 6. Buat editor artikel WYSIWYG berbasis TipTap

### 7. Buat halaman kelola skill dengan daftar dan form

### 8. Buat halaman kelola pendidikan pengalaman dan sertifikat

### 9. Buat halaman kelola kategori dan tag

### 10. Buat halaman kelola profil dan tautan kontak

### 11. Tambahkan notifikasi toast dan state kesalahan form

### 12. Rapikan tampilan responsif daftar dan form pengelolaan

### 13. Buat migrasi tabel kategori tag dan pivotnya

### 14. Buat migrasi tabel proyek dan artikel

### 15. Buat migrasi tabel skill pendidikan pengalaman sertifikat

### 16. Buat migrasi tabel profil dan sosial media

### 17. Buat model Eloquent beserta relasi antar tabel

### 18. Pasang spatie medialibrary dan konfigurasi koleksi gambar

### 19. Siapkan rute admin dengan middleware autentikasi

### 20. Buat controller dashboard dengan agregat jumlah konten

### 21. Buat controller CRUD proyek dengan unggah sampul

### 22. Buat controller CRUD artikel dengan kategori dan tag

### 23. Buat controller CRUD skill pendidikan pengalaman sertifikat

### 24. Buat controller CRUD kategori dan tag

### 25. Buat controller CRUD profil dan sosial media

### 26. Buat form request validasi seluruh resource konten
