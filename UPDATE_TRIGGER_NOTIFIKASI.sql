-- ######################################################################
-- # UPDATE TRIGGER NOTIFIKASI: Perbagus pesan notifikasi untuk siswa
-- # Jalankan query ini untuk update trigger yang sudah ada
-- ######################################################################

USE sistem_bk;

-- ######################################################################
-- # 1. UPDATE TRIGGER: Konsultasi Diterima (Lebih informatif)
-- ######################################################################

DROP TRIGGER IF EXISTS trg_konsultasi_diterima;

DELIMITER $$

CREATE TRIGGER trg_konsultasi_diterima
AFTER UPDATE ON konsultasi
FOR EACH ROW
BEGIN
    IF NEW.status = 'diterima' AND OLD.status != 'diterima' THEN
        -- Buat notifikasi untuk siswa dengan info lengkap
        INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
        SELECT 
            NEW.siswa_id,
            NEW.konsultasi_id,
            'konsultasi_diterima',
            '✅ Konsultasi Diterima',
            CONCAT(
                'Selamat! Pengajuan konsultasi Anda telah diterima oleh ', u.nama_lengkap, '. ',
                'Topik: ', NEW.judul, '. ',
                'Jadwal: ', DATE_FORMAT(NEW.tanggal, '%d %M %Y'), ' pukul ', TIME_FORMAT(NEW.waktu, '%H:%i'), '. ',
                IF(NEW.catatan_guru IS NOT NULL AND NEW.catatan_guru != '', CONCAT('Catatan guru: ', NEW.catatan_guru), 'Silakan datang tepat waktu sesuai jadwal yang telah ditentukan.')
            )
        FROM users u
        WHERE u.user_id = NEW.guru_id;
    END IF;
END$$

DELIMITER ;

-- ######################################################################
-- # 2. UPDATE TRIGGER: Konsultasi Ditolak (Lebih informatif)
-- ######################################################################

DROP TRIGGER IF EXISTS trg_konsultasi_ditolak;

DELIMITER $$

CREATE TRIGGER trg_konsultasi_ditolak
AFTER UPDATE ON konsultasi
FOR EACH ROW
BEGIN
    IF NEW.status = 'ditolak' AND OLD.status != 'ditolak' THEN
        -- Buat notifikasi untuk siswa dengan info lengkap
        INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
        SELECT 
            NEW.siswa_id,
            NEW.konsultasi_id,
            'konsultasi_ditolak',
            '❌ Konsultasi Ditolak',
            CONCAT(
                'Maaf, pengajuan konsultasi Anda dengan ', u.nama_lengkap, ' telah ditolak. ',
                'Topik: ', NEW.judul, '. ',
                'Jadwal yang diajukan: ', DATE_FORMAT(NEW.tanggal, '%d %M %Y'), ' pukul ', TIME_FORMAT(NEW.waktu, '%H:%i'), '. ',
                'Alasan penolakan: ', IFNULL(NEW.alasan_penolakan, 'Tidak disebutkan'), '. ',
                'Silakan ajukan jadwal konsultasi baru dengan waktu yang berbeda atau hubungi guru BK untuk informasi lebih lanjut.'
            )
        FROM users u
        WHERE u.user_id = NEW.guru_id;
    END IF;
END$$

DELIMITER ;

-- ######################################################################
-- # 3. CEK TRIGGER YANG SUDAH DIUPDATE
-- ######################################################################

SHOW TRIGGERS WHERE `Table` = 'konsultasi';

-- ######################################################################
-- # 4. CATATAN
-- ######################################################################

-- Setelah update trigger, notifikasi baru yang dibuat akan memiliki:
-- 1. Judul dengan emoji (✅ untuk diterima, ❌ untuk ditolak)
-- 2. Pesan yang lebih lengkap dengan:
--    - Nama guru
--    - Topik konsultasi
--    - Jadwal lengkap
--    - Catatan/alasan
--    - Pesan tambahan yang informatif

