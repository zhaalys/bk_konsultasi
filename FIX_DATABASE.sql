-- Script untuk memperbaiki tabel users agar support role 'guru'
-- Jalankan script ini di MySQL

USE sistem_bk;

-- Update ENUM role untuk support 'guru'
ALTER TABLE users MODIFY role ENUM('siswa', 'guru') NOT NULL DEFAULT 'siswa';

-- Verifikasi struktur tabel
DESCRIBE users;

