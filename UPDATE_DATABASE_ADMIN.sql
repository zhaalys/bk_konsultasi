-- ######################################################################
-- # UPDATE DATABASE: TAMBAH ROLE ADMIN DAN INSERT ADMIN USER
-- # Script ini aman untuk database yang sudah ada
-- ######################################################################

USE sistem_bk;

-- ######################################################################
-- # 1. UPDATE TABEL USERS: TAMBAH ROLE ADMIN
-- ######################################################################

-- Cek apakah role 'admin' sudah ada di ENUM
-- Jika belum, update tabel untuk menambahkan role 'admin'
ALTER TABLE users 
MODIFY COLUMN role ENUM('siswa', 'guru', 'admin') NOT NULL DEFAULT 'siswa';

-- ######################################################################
-- # 2. HAPUS ADMIN LAMA JIKA ADA (UNTUK TESTING)
-- ######################################################################

DELETE FROM users WHERE email = 'admin123@gmail.com';

-- ######################################################################
-- # 3. INSERT ADMIN USER BARU
-- ######################################################################

-- Email: admin123@gmail.com
-- Password: FAISHAL1
-- Password hash untuk "FAISHAL1" menggunakan bcrypt dengan cost 10
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
-- # 4. VERIFIKASI ADMIN
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
-- # 5. CEK SEMUA USERS
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

