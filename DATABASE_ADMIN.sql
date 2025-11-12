-- ######################################################################
-- # UPDATE DATABASE: TAMBAH ROLE ADMIN
-- # Script ini aman untuk database yang sudah ada
-- ######################################################################

USE sistem_bk;

-- Update tabel users untuk support role admin
-- Script ini aman untuk tabel yang sudah ada
ALTER TABLE users 
MODIFY COLUMN role ENUM('siswa', 'guru', 'admin') NOT NULL DEFAULT 'siswa';

-- ######################################################################
-- # INSERT ADMIN USER
-- ######################################################################

-- Password: FAISHAL1
-- Hash menggunakan bcrypt (dari aplikasi)
-- Untuk testing, kita akan insert dengan hash yang sudah dibuat
-- Catatan: Hash di bawah adalah contoh, aplikasi akan hash otomatis saat login/register

-- Hapus admin lama jika ada (untuk testing)
DELETE FROM users WHERE email = 'admin123@gmail.com';

-- Insert admin baru
-- Password hash untuk "FAISHAL1" menggunakan bcrypt dengan cost 10
-- Hash ini dibuat dengan: bcrypt.hashSync('FAISHAL1', 10)
INSERT INTO users (nama_lengkap, email, password_hash, nis_nip, role, is_active)
VALUES (
    'Admin Sistem BK',
    'admin123@gmail.com',
    '$2b$10$dX6WrUqT2p0hC7aZfqahfOnu9FfIx9VeBa6cyVJitJ3FNrMcEfWrK', -- Hash untuk "FAISHAL1"
    'ADMIN001',
    'admin',
    TRUE
);

-- ######################################################################
-- # VERIFIKASI ADMIN
-- ######################################################################

SELECT 
    user_id,
    nama_lengkap,
    email,
    nis_nip,
    role,
    is_active,
    created_at
FROM users 
WHERE role = 'admin';

-- ######################################################################
-- # CEK SEMUA USERS
-- ######################################################################

SELECT 
    user_id,
    nama_lengkap,
    email,
    nis_nip,
    role,
    is_active,
    created_at
FROM users
ORDER BY role, nama_lengkap;

