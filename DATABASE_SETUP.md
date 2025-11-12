# Setup Database

## 1. Buat Database

Jalankan SQL berikut di MySQL untuk membuat database dan tabel:

```sql
CREATE DATABASE IF NOT EXISTS sistem_bk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistem_bk;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nis_nip VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('siswa', 'guru') NOT NULL DEFAULT 'siswa', -- PENTING: Harus include 'guru'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jika tabel sudah ada dengan ENUM('siswa') saja, jalankan ini untuk update:
-- ALTER TABLE users MODIFY role ENUM('siswa', 'guru') NOT NULL DEFAULT 'siswa';
-- UPDATE users SET role = 'guru' WHERE email LIKE '%@bk.sch.id';
```

## 2. Konfigurasi Environment

Buat file `.env.local` di root project dengan konfigurasi berikut:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sistem_bk
```

## 3. Cara Login

### Login sebagai Siswa
- Email: bebas (tidak menggunakan @bk.sch.id)
- Password: sesuai yang didaftarkan

### Login sebagai Guru
- Email: harus menggunakan domain @bk.sch.id (contoh: guru@bk.sch.id)
- Password: sesuai yang didaftarkan

## 4. Contoh Data

### Insert Siswa
```sql
INSERT INTO users (nama_lengkap, email, password_hash, nis_nip, role)
VALUES 
('Budi Santoso', 'budi.santoso@siswa.sch.id', 
 '$2y$10$EwD1hNfX3vF4pQyT3aL8dU6rZ9jBvT7mN1xS9hW2pG6yQ8kJzR7cG', 
 '1011223344', 
 'siswa');
```

### Insert Guru
```sql
INSERT INTO users (nama_lengkap, email, password_hash, nis_nip, role)
VALUES 
('Bu Siti Nurhaliza, S.Pd', 'siti.nurhaliza@bk.sch.id', 
 '$2y$10$EwD1hNfX3vF4pQyT3aL8dU6rZ9jBvT7mN1xS9hW2pG6yQ8kJzR7cG', 
 '198001012001011001', 
 'guru');
```

**Catatan:** Password hash di atas adalah contoh. Gunakan aplikasi untuk register dan password akan di-hash otomatis dengan bcrypt.

## 5. Testing

1. Jalankan aplikasi: `npm run dev`
2. Buka browser ke `http://localhost:3000`
3. Klik "Daftar" untuk membuat akun baru
4. Setelah registrasi, akan otomatis redirect ke:
   - Dashboard Guru (jika email @bk.sch.id)
   - Profil Murid (jika email bukan @bk.sch.id)

