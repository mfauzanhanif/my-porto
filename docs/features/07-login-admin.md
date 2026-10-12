# Login Admin

Menjaga halaman pengelolaan agar hanya Anda yang bisa masuk.

## Spesifikasi

### Tujuan
Menjaga agar hanya Anda yang bisa mengakses dan mengelola konten di halaman pengelolaan, dengan cara masuk memakai email dan kata sandi lalu keluar dengan aman.

### Selesai bila
- Halaman login tersedia dan bisa dibuka dari alamat khusus.
- Setelah memasukkan email dan kata sandi yang benar, Anda langsung diarahkan ke halaman pengelolaan.
- Jika email atau kata sandi salah, muncul pesan kesalahan dan Anda tetap di halaman login.
- Ada cara untuk keluar dari sesi pengelolaan kapan saja.
- Halaman pengelolaan tidak bisa dibuka oleh orang yang belum masuk (dialihkan ke halaman login).

## Sub-fitur: Halaman Login

Masuk ke area pengelolaan memakai email dan kata sandi.

### Tujuan
Menyediakan pintu masuk bagi Anda untuk mengakses area pengelolaan dengan email dan kata sandi.

### Selesai bila
- Terdapat halaman dengan kolom isian email dan kata sandi serta tombol masuk.
- Jika email dan kata sandi benar, Anda diarahkan ke halaman pengelolaan.
- Jika salah, muncul pesan kesalahan yang jelas dan Anda tetap di halaman login.

## Sub-fitur: Keluar Akun

Mengakhiri sesi pengelolaan dengan aman.

### Tujuan
Memungkinkan Anda mengakhiri sesi pengelolaan dengan aman sehingga orang lain tidak bisa melanjutkan akses.

### Selesai bila
- Terdapat tombol atau menu untuk keluar dari area pengelolaan.
- Setelah keluar, Anda diarahkan kembali ke halaman login (atau halaman publik).
- Setelah keluar, mencoba membuka halaman pengelolaan akan dialihkan ke halaman login.

## Sub-fitur: Proteksi Halaman Pengelolaan

Halaman pengelolaan hanya bisa dibuka setelah berhasil masuk.

### Tujuan
Memastikan halaman pengelolaan hanya bisa dibuka oleh Anda yang sudah berhasil masuk.

### Selesai bila
- Jika belum masuk, membuka alamat halaman pengelolaan akan dialihkan ke halaman login.
- Setelah berhasil masuk, Anda bisa membuka semua halaman pengelolaan.
- Jika sesi berakhir atau Anda keluar, akses ke halaman pengelolaan kembali ditolak.

## Task

### 1. Buat halaman login dengan form email dan kata sandi

### 2. Buat halaman dashboard pengelolaan dengan tombol keluar

### 3. Terapkan proteksi route pengelolaan berbasis status login tiruan

### 4. Konfigurasi Laravel Fortify untuk autentikasi admin

### 5. Buat seeder akun admin default

### 6. Sediakan route login dan logout dengan penanganan error

### 7. Terapkan middleware auth pada seluruh route pengelolaan
