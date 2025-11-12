-- ######################################################################
-- # TABEL KONSULTASI & NOTIFIKASI
-- # Jalankan script ini setelah tabel users sudah dibuat
-- ######################################################################

USE sistem_bk;

-- ######################################################################
-- # 1. TABEL KONSULTASI (Booking/Pengajuan Konsultasi)
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
-- # 2. TABEL NOTIFIKASI
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
-- # 3. TRIGGER: Auto create notifikasi saat konsultasi baru
-- ######################################################################

DELIMITER $$

CREATE TRIGGER IF NOT EXISTS trg_konsultasi_baru
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
-- # 4. TRIGGER: Auto create notifikasi saat konsultasi diterima
-- ######################################################################

DELIMITER $$

CREATE TRIGGER IF NOT EXISTS trg_konsultasi_diterima
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
-- # 5. TRIGGER: Auto create notifikasi saat konsultasi ditolak
-- ######################################################################

DELIMITER $$

CREATE TRIGGER IF NOT EXISTS trg_konsultasi_ditolak
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
-- # 6. VIEW: Daftar Konsultasi untuk Guru
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
-- # 7. VIEW: Daftar Konsultasi untuk Siswa
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
-- # 8. QUERY CONTOH: Lihat semua konsultasi pending untuk guru
-- ######################################################################

-- SELECT * FROM v_konsultasi_guru 
-- WHERE status = 'pending' 
-- ORDER BY created_at DESC;

-- ######################################################################
-- # 9. QUERY CONTOH: Lihat notifikasi belum dibaca untuk user
-- ######################################################################

-- SELECT * FROM notifikasi 
-- WHERE user_id = :user_id AND is_read = FALSE 
-- ORDER BY created_at DESC;

-- ######################################################################
-- # 10. QUERY CONTOH: Update status konsultasi (Terima/Tolak)
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
-- # 11. QUERY CONTOH: Mark notifikasi sebagai sudah dibaca
-- ######################################################################

-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE notifikasi_id = :notifikasi_id AND user_id = :user_id;

-- -- Atau mark semua sebagai sudah dibaca
-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE user_id = :user_id AND is_read = FALSE;

