-- ######################################################################
-- # FIX NOTIFIKASI & KONSULTASI: Perbaiki data yang tidak muncul di dashboard
-- ######################################################################

USE sistem_bk;

-- 1. CEK DATA DULU (Jalankan query ini untuk melihat kondisi data)
-- ================================================================

-- Cek semua guru
SELECT user_id, nama_lengkap, email, role FROM users WHERE email LIKE '%@bk.sch.id' OR role = 'guru';

-- Cek semua konsultasi
SELECT konsultasi_id, siswa_id, guru_id, judul, status, created_at FROM konsultasi ORDER BY created_at DESC;

-- Cek apakah guru_id di konsultasi sesuai dengan user_id guru
SELECT 
    k.konsultasi_id,
    k.guru_id as konsultasi_guru_id,
    u.user_id as guru_user_id,
    u.nama_lengkap as nama_guru,
    u.email as email_guru,
    CASE 
        WHEN k.guru_id = u.user_id THEN 'OK'
        ELSE 'SALAH - PERLU DIPERBAIKI'
    END as status
FROM konsultasi k
LEFT JOIN users u ON k.guru_id = u.user_id
ORDER BY k.created_at DESC;

-- Cek notifikasi
SELECT * FROM notifikasi ORDER BY created_at DESC;

-- 2. PERBAIKI GURU_ID DI KONSULTASI (Jika guru_id tidak sesuai)
-- ================================================================

-- Update guru_id di konsultasi berdasarkan email guru
-- Jika Bu Heni punya email 'heni.siswati@bk.sch.id' dan user_id = X
-- Update semua konsultasi yang guru_id nya salah

-- CARA 1: Update berdasarkan email (REKOMENDASI)
UPDATE konsultasi k
INNER JOIN users u ON u.email = 'heni.siswati@bk.sch.id' AND u.role = 'guru'
SET k.guru_id = u.user_id
WHERE k.guru_id NOT IN (SELECT user_id FROM users WHERE email LIKE '%@bk.sch.id' OR role = 'guru');

-- CARA 2: Update manual jika tahu user_id Bu Heni
-- Ganti X dengan user_id Bu Heni yang benar
-- UPDATE konsultasi SET guru_id = X WHERE guru_id != X AND konsultasi_id IN (SELECT konsultasi_id FROM konsultasi WHERE status = 'pending');

-- 3. BUAT NOTIFIKASI MANUAL (Jika trigger tidak jalan)
-- ================================================================

-- Hapus notifikasi duplikat dulu (jika ada)
DELETE n1 FROM notifikasi n1
INNER JOIN notifikasi n2 
WHERE n1.notifikasi_id > n2.notifikasi_id 
  AND n1.konsultasi_id = n2.konsultasi_id 
  AND n1.tipe = n2.tipe;

-- Buat notifikasi untuk konsultasi yang belum punya notifikasi
INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
SELECT 
    k.guru_id,
    k.konsultasi_id,
    'konsultasi_baru',
    'Pengajuan Konsultasi Baru',
    CONCAT(
        'Siswa ', u.nama_lengkap, ' (NIS: ', u.nis_nip, ') mengajukan konsultasi. ',
        'Topik: ', k.judul, '. ',
        'Tanggal: ', DATE_FORMAT(k.tanggal, '%d %M %Y'), ' pukul ', TIME_FORMAT(k.waktu, '%H:%i'), '. ',
        IF(k.deskripsi IS NOT NULL AND k.deskripsi != '', CONCAT('Deskripsi: ', k.deskripsi), '')
    )
FROM konsultasi k
INNER JOIN users u ON k.siswa_id = u.user_id
WHERE k.status = 'pending'
  AND NOT EXISTS (
      SELECT 1 FROM notifikasi n 
      WHERE n.konsultasi_id = k.konsultasi_id 
      AND n.tipe = 'konsultasi_baru'
  );

-- 4. CEK HASIL SETELAH PERBAIKAN
-- ================================================================

-- Cek konsultasi untuk Bu Heni (ganti user_id dengan user_id Bu Heni)
-- SELECT * FROM konsultasi WHERE guru_id = (SELECT user_id FROM users WHERE email = 'heni.siswati@bk.sch.id') ORDER BY created_at DESC;

-- Cek notifikasi untuk Bu Heni
-- SELECT * FROM notifikasi WHERE user_id = (SELECT user_id FROM users WHERE email = 'heni.siswati@bk.sch.id') ORDER BY created_at DESC;

-- Cek semua data setelah perbaikan
SELECT 
    'Konsultasi' as tabel,
    COUNT(*) as jumlah
FROM konsultasi
UNION ALL
SELECT 
    'Notifikasi' as tabel,
    COUNT(*) as jumlah
FROM notifikasi
UNION ALL
SELECT 
    'Konsultasi Pending' as tabel,
    COUNT(*) as jumlah
FROM konsultasi
WHERE status = 'pending';

