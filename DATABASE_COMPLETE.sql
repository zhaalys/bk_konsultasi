-- ######################################################################
-- # 0. MEMBUAT DATABASE & MENGGUNAKANNYA
-- ######################################################################

CREATE DATABASE IF NOT EXISTS sistem_bk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sistem_bk;

-- ######################################################################
-- # 1. MEMBUAT TABEL USERS (UNTUK SISWA, DAN NANTI BISA TAMBAH GURU)
-- ######################################################################

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nis_nip VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('siswa', 'guru') NOT NULL DEFAULT 'siswa', -- UPDATE: sekarang support siswa dan guru
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;

-- Update data yang sudah ada (jika ada)
UPDATE users SET role = 'guru' WHERE email LIKE '%@bk.sch.id';

-- ######################################################################
-- # 2. CONTOH DATA SISWA (BISA DIDAFTARKAN OTOMATIS DARI FORM)
-- ######################################################################

-- Contoh insert siswa (gunakan hash password dari aplikasi)
-- Catatan: Password hash di bawah adalah contoh, gunakan aplikasi untuk register
-- dan password akan di-hash otomatis dengan bcrypt

INSERT INTO users (nama_lengkap, email, password_hash, nis_nip, role)
VALUES 
('Budi Santoso', 'budi.santoso@siswa.sch.id', 
 '$2y$10$EwD1hNfX3vF4pQyT3aL8dU6rZ9jBvT7mN1xS9hW2pG6yQ8kJzR7cG', 
 '1011223344', 
 'siswa'),
('Siti Rahmawati', 'siti.rahmawati@siswa.sch.id', 
 '$2y$10$K7gP1rHfL9qE2dJk4vW6sT8mN3yX5aC2bV7lR9fD4tP8wH1zM0eJ2', 
 '1011223345', 
 'siswa');

-- ######################################################################
-- # 3. TABEL KONSULTASI (Booking/Pengajuan Konsultasi)
-- ######################################################################

CREATE TABLE IF NOT EXISTS konsultasi (
    konsultasi_id INT AUTO_INCREMENT PRIMARY KEY,
    siswa_id INT NOT NULL,
    guru_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    status ENUM('pending', 'diterima', 'ditolak', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'pending',
    alasan_penolakan TEXT NULL,
    catatan_guru TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_guru_id (guru_id),
    INDEX idx_siswa_id (siswa_id),
    INDEX idx_status (status),
    INDEX idx_tanggal (tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ######################################################################
-- # 4. TABEL NOTIFIKASI
-- ######################################################################

CREATE TABLE IF NOT EXISTS notifikasi (
    notifikasi_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    konsultasi_id INT NULL,
    tipe ENUM('konsultasi_baru', 'konsultasi_diterima', 'konsultasi_ditolak', 'konsultasi_dibatalkan', 'reminder') NOT NULL,
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (konsultasi_id) REFERENCES konsultasi(konsultasi_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ######################################################################
-- # 5. TRIGGER: Auto create notifikasi saat konsultasi baru
-- ######################################################################

DROP TRIGGER IF EXISTS trg_konsultasi_baru;

DELIMITER $$

CREATE TRIGGER trg_konsultasi_baru
AFTER INSERT ON konsultasi
FOR EACH ROW
BEGIN
    -- Buat notifikasi untuk guru dengan info lengkap
    INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
    SELECT 
        NEW.guru_id,
        NEW.konsultasi_id,
        'konsultasi_baru',
        'Pengajuan Konsultasi Baru',
        CONCAT(
            'Siswa ', u.nama_lengkap, ' (NIS: ', u.nis_nip, ') mengajukan konsultasi. ',
            'Topik: ', NEW.judul, '. ',
            'Tanggal: ', DATE_FORMAT(NEW.tanggal, '%d %M %Y'), ' pukul ', TIME_FORMAT(NEW.waktu, '%H:%i'), '. ',
            IF(NEW.deskripsi IS NOT NULL AND NEW.deskripsi != '', CONCAT('Deskripsi: ', NEW.deskripsi), '')
        )
    FROM users u
    WHERE u.user_id = NEW.siswa_id;
END$$

DELIMITER ;

-- ######################################################################
-- # 6. TRIGGER: Auto create notifikasi saat konsultasi diterima
-- ######################################################################

DROP TRIGGER IF EXISTS trg_konsultasi_diterima;

DELIMITER $$

CREATE TRIGGER trg_konsultasi_diterima
AFTER UPDATE ON konsultasi
FOR EACH ROW
BEGIN
    IF NEW.status = 'diterima' AND OLD.status != 'diterima' THEN
        -- Buat notifikasi untuk siswa
        INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
        VALUES (
            NEW.siswa_id,
            NEW.konsultasi_id,
            'konsultasi_diterima',
            'Konsultasi Diterima',
            CONCAT('Pengajuan konsultasi Anda pada ', DATE_FORMAT(NEW.tanggal, '%d %M %Y'), ' pukul ', TIME_FORMAT(NEW.waktu, '%H:%i'), ' telah diterima oleh guru.')
        );
    END IF;
END$$

DELIMITER ;

-- ######################################################################
-- # 7. TRIGGER: Auto create notifikasi saat konsultasi ditolak
-- ######################################################################

DROP TRIGGER IF EXISTS trg_konsultasi_ditolak;

DELIMITER $$

CREATE TRIGGER trg_konsultasi_ditolak
AFTER UPDATE ON konsultasi
FOR EACH ROW
BEGIN
    IF NEW.status = 'ditolak' AND OLD.status != 'ditolak' THEN
        -- Buat notifikasi untuk siswa
        INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
        VALUES (
            NEW.siswa_id,
            NEW.konsultasi_id,
            'konsultasi_ditolak',
            'Konsultasi Ditolak',
            CONCAT('Pengajuan konsultasi Anda pada ', DATE_FORMAT(NEW.tanggal, '%d %M %Y'), ' pukul ', TIME_FORMAT(NEW.waktu, '%H:%i'), ' telah ditolak. Alasan: ', IFNULL(NEW.alasan_penolakan, 'Tidak disebutkan'))
        );
    END IF;
END$$

DELIMITER ;

-- ######################################################################
-- # 8. VIEW: Daftar Konsultasi untuk Guru
-- ######################################################################

CREATE OR REPLACE VIEW v_konsultasi_guru AS
SELECT 
    k.konsultasi_id,
    k.siswa_id,
    u.nama_lengkap AS nama_siswa,
    u.email AS email_siswa,
    u.nis_nip AS nis_siswa,
    k.judul,
    k.deskripsi,
    k.tanggal,
    k.waktu,
    k.status,
    k.alasan_penolakan,
    k.catatan_guru,
    k.created_at,
    k.updated_at
FROM konsultasi k
INNER JOIN users u ON k.siswa_id = u.user_id
ORDER BY k.created_at DESC;

-- ######################################################################
-- # 9. VIEW: Daftar Konsultasi untuk Siswa
-- ######################################################################

CREATE OR REPLACE VIEW v_konsultasi_siswa AS
SELECT 
    k.konsultasi_id,
    k.guru_id,
    u.nama_lengkap AS nama_guru,
    u.email AS email_guru,
    k.judul,
    k.deskripsi,
    k.tanggal,
    k.waktu,
    k.status,
    k.alasan_penolakan,
    k.catatan_guru,
    k.created_at,
    k.updated_at
FROM konsultasi k
INNER JOIN users u ON k.guru_id = u.user_id
ORDER BY k.created_at DESC;

-- ######################################################################
-- # 10. QUERY CONTOH: Lihat semua konsultasi pending untuk guru
-- ######################################################################

-- SELECT * FROM v_konsultasi_guru 
-- WHERE status = 'pending' 
-- ORDER BY created_at DESC;

-- ######################################################################
-- # 11. QUERY CONTOH: Lihat notifikasi belum dibaca untuk user
-- ######################################################################

-- SELECT * FROM notifikasi 
-- WHERE user_id = :user_id AND is_read = FALSE 
-- ORDER BY created_at DESC;

-- ######################################################################
-- # 12. QUERY CONTOH: Update status konsultasi (Terima/Tolak)
-- ######################################################################

-- -- Terima konsultasi
-- UPDATE konsultasi 
-- SET status = 'diterima', 
--     catatan_guru = :catatan 
-- WHERE konsultasi_id = :konsultasi_id AND guru_id = :guru_id;

-- -- Tolak konsultasi
-- UPDATE konsultasi 
-- SET status = 'ditolak', 
--     alasan_penolakan = :alasan 
-- WHERE konsultasi_id = :konsultasi_id AND guru_id = :guru_id;

-- ######################################################################
-- # 13. QUERY CONTOH: Mark notifikasi sebagai sudah dibaca
-- ######################################################################

-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE notifikasi_id = :notifikasi_id AND user_id = :user_id;

-- -- Atau mark semua sebagai sudah dibaca
-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE user_id = :user_id AND is_read = FALSE;

-- ######################################################################
-- # 14. CATATAN PENTING
-- ######################################################################

-- 1. Untuk registrasi siswa/guru, gunakan aplikasi web (form register)
--    Password akan di-hash otomatis dengan bcrypt
-- 2. Email dengan domain @bk.sch.id akan otomatis terdeteksi sebagai guru
-- 3. Tidak perlu insert data siswa/guru satu-satu di SQL
--    Semua registrasi dilakukan melalui aplikasi web
-- 4. Tabel konsultasi dan notifikasi akan terisi otomatis saat:
--    - Siswa mengajukan konsultasi (via aplikasi)
--    - Guru menerima/menolak konsultasi (via aplikasi)
-- 5. Trigger akan otomatis membuat notifikasi saat ada konsultasi baru
