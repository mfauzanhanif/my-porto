# Kategori & Tag

Menata artikel dan proyek agar mudah dikelompokkan dan ditemukan.

## Spesifikasi

### Tujuan
Memberi admin cara mengelompokkan artikel dan proyek lewat kategori (dan tag khusus artikel) agar pengunjung lebih mudah menemukan konten yang relevan.

### Selesai bila
- Admin punya halaman pengelolaan untuk membuat, mengubah, dan menghapus kategori artikel maupun proyek.
- Admin punya halaman pengelolaan untuk membuat, mengubah, dan menghapus tag yang khusus dipakai artikel.
- Setiap kategori punya penanda jenis — artikel atau proyek — sehingga hanya muncul sebagai pilihan pada konten yang sesuai.
- Saat membuat atau mengubah artikel, admin bisa memasang kategori dan tag; saat membuat atau mengubah proyek, admin bisa memasang kategori saja.
- Kategori dan tag yang sudah dipakai tetap tampil pada tampilan detail artikel/proyek, dan menghapus salah satunya tidak menghilangkan konten terkait.

## Sub-fitur: Kelola Kategori

Membuat dan mengubah kategori untuk artikel maupun proyek.

### Tujuan
Menyediakan satu daftar kategori terpusat untuk artikel dan proyek, dengan penanda jenis agar penataan konten tetap rapi dan tidak tertukar.

### Selesai bila
- Admin melihat seluruh kategori dalam satu halaman pengelolaan, lengkap dengan keterangan jenisnya (artikel atau proyek).
- Admin bisa menambah, mengubah, dan menghapus kategori; nama kategori yang sama tidak boleh dibuat dua kali.
- Saat menyimpan kategori, admin memilih jenisnya, dan pilihan itu menentukan kategori mana yang nanti muncul ketika memasang ke artikel atau proyek.

## Sub-fitur: Kelola Tag

Membuat dan mengubah tag yang khusus dipakai untuk artikel.

### Tujuan
Menyediakan daftar tag khusus artikel agar tulisan mudah dikelompokkan berdasarkan topik tanpa mengganggu data proyek.

### Selesai bila
- Admin melihat seluruh tag artikel dalam satu halaman pengelolaan, termasuk jumlah artikel yang memakai tiap tag.
- Admin bisa menambah, mengubah, dan menghapus tag; nama tag yang sama tidak boleh dibuat dua kali.
- Tag hanya muncul sebagai pilihan pada artikel, tidak pernah muncul pada proyek.

## Sub-fitur: Penautan ke Konten

Menghubungkan kategori dan tag ke artikel atau proyek yang sesuai.

### Tujuan
Memungkinkan admin memasang kategori (dan tag untuk artikel) langsung saat menulis konten, agar pengelompokan terjadi tanpa langkah terpisah.

### Selesai bila
- Pada form artikel, admin bisa memilih beberapa kategori dan beberapa tag sekaligus.
- Pada form proyek, admin bisa memilih beberapa kategori, tanpa ada pilihan tag.
- Pilihan kategori/tag tersimpan menyatu dengan kontennya dan langsung terlihat pada tampilan artikel atau proyek setelah disimpan.

## Task

### 1. Bangun halaman kelola kategori dengan mock

### 2. Buat form modal tambah ubah kategori

### 3. Bangun halaman kelola tag artikel mock

### 4. Buat form modal tambah ubah tag

### 5. Buat pemilih multi kategori dan tag artikel

### 6. Buat pemilih multi kategori form proyek

### 7. Tampilkan badge kategori dan tag detail konten

### 8. Buat migrasi tabel categories dan tags

### 9. Buat migrasi pivot artikel proyek kategori tag

### 10. Definisikan model Category Tag dan relasinya

### 11. Buat CRUD kategori dengan validasi jenis

### 12. Buat CRUD tag dengan hitung jumlah artikel

### 13. Sediakan endpoint sync kategori tag konten

### 14. Muat relasi kategori tag pada detail publik
