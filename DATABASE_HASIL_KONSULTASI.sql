-- ######################################################################
-- # TABEL HASIL KONSULTASI
-- # Untuk menyimpan hasil/formulir konsultasi setelah konsultasi diterima
-- ######################################################################

USE sistem_bk;

-- ######################################################################
-- # 1. TABEL HASIL KONSULTASI
-- ######################################################################

CREATE TABLE IF NOT EXISTS hasil_konsultasi (
    hasil_id INT AUTO_INCREMENT PRIMARY KEY,
    konsultasi_id INT NOT NULL UNIQUE,
    nama_siswa VARCHAR(255) NOT NULL,
    nis_siswa VARCHAR(50) NOT NULL,
    kelas VARCHAR(50),
    tanggal_lahir DATE,
    alamat VARCHAR(255),
    alamat_lengkap TEXT,
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    no_telp VARCHAR(20),
    tanggal_konsultasi DATE NOT NULL,
    waktu_konsultasi TIME NOT NULL,
    topik_konsultasi VARCHAR(255),
    jenis_masalah VARCHAR(50),
    masalah TEXT NOT NULL,
    latar_belakang TEXT,
    gejala TEXT,
    solusi TEXT NOT NULL,
    langkah_solusi TEXT,
    rekomendasi TEXT,
    tindak_lanjut TEXT,
    jadwal_tindak_lanjut DATETIME,
    catatan_tambahan TEXT,
    nama_guru VARCHAR(255) NOT NULL,
    nip_guru VARCHAR(50),
    email_guru VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (konsultasi_id) REFERENCES konsultasi(konsultasi_id) ON DELETE CASCADE,
    INDEX idx_konsultasi_id (konsultasi_id),
    INDEX idx_tanggal_konsultasi (tanggal_konsultasi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ######################################################################
-- # 2. QUERY CONTOH: Insert hasil konsultasi
-- ######################################################################

-- INSERT INTO hasil_konsultasi (
--     konsultasi_id,
--     nama_siswa,
--     nis_siswa,
--     kelas,
--     tanggal_konsultasi,
--     waktu_konsultasi,
--     masalah,
--     solusi,
--     tindak_lanjut,
--     catatan_tambahan,
--     nama_guru,
--     nip_guru
-- ) VALUES (
--     :konsultasi_id,
--     :nama_siswa,
--     :nis_siswa,
--     :kelas,
--     :tanggal_konsultasi,
--     :waktu_konsultasi,
--     :masalah,
--     :solusi,
--     :tindak_lanjut,
--     :catatan_tambahan,
--     :nama_guru,
--     :nip_guru
-- );

-- ######################################################################
-- # 3. QUERY CONTOH: Lihat hasil konsultasi dengan detail konsultasi
-- ######################################################################

-- SELECT 
--     h.*,
--     k.judul,
--     k.deskripsi,
--     k.status,
--     u_guru.nama_lengkap AS nama_guru_full,
--     u_siswa.nama_lengkap AS nama_siswa_full
-- FROM hasil_konsultasi h
-- INNER JOIN konsultasi k ON h.konsultasi_id = k.konsultasi_id
-- INNER JOIN users u_guru ON k.guru_id = u_guru.user_id
-- INNER JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
-- WHERE h.konsultasi_id = :konsultasi_id;

