-- Script untuk UPDATE database agar support role 'guru'
-- Jalankan script ini di MySQL

USE sistem_bk;

-- 1. Update ENUM role untuk support 'guru'
ALTER TABLE users MODIFY role ENUM('siswa', 'guru') NOT NULL DEFAULT 'siswa';

-- 2. Update data yang sudah ada: jika email menggunakan @bk.sch.id, ubah role menjadi 'guru'
UPDATE users 
SET role = 'guru' 
WHERE email LIKE '%@bk.sch.id';

-- 3. Verifikasi hasil
SELECT user_id, nama_lengkap, email, role, is_active 
FROM users 
ORDER BY created_at DESC;

-- 4. Verifikasi struktur tabel
DESCRIBE users;

