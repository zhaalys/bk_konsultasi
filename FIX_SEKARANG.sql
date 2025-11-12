-- ######################################################################
-- # FIX CEPAT: Perbaiki data konsultasi dan notifikasi Bu Heni
-- # JALANKAN QUERY INI DI MYSQL SEKARANG!
-- ######################################################################

USE sistem_bk;

-- STEP 1: Cek user_id Bu Heni
SELECT user_id, nama_lengkap, email, role 
FROM users 
WHERE email LIKE '%heni%' OR nama_lengkap LIKE '%Heni%';

-- STEP 2: Cek konsultasi dan guru_id nya
SELECT 
    k.konsultasi_id,
    k.guru_id,
    k.siswa_id,
    k.judul,
    k.status,
    u_guru.user_id as guru_user_id,
    u_guru.nama_lengkap as nama_guru,
    u_guru.email as email_guru
FROM konsultasi k
LEFT JOIN users u_guru ON k.guru_id = u_guru.user_id
ORDER BY k.created_at DESC;

-- STEP 3: Update guru_id di konsultasi ke user_id Bu Heni yang benar
-- GANTI 'heni.siswati@bk.sch.id' dengan email Bu Heni yang sebenarnya di database
UPDATE konsultasi k
INNER JOIN users u ON u.email = 'heni.siswati@bk.sch.id'
SET k.guru_id = u.user_id
WHERE k.guru_id != u.user_id 
  AND k.status = 'pending';

-- Atau jika email berbeda, cari dulu user_id Bu Heni:
-- SELECT user_id FROM users WHERE nama_lengkap LIKE '%Heni%' AND role = 'guru';
-- Lalu update manual:
-- UPDATE konsultasi SET guru_id = [USER_ID_BU_HENI] WHERE status = 'pending';

-- STEP 4: Buat notifikasi untuk konsultasi yang belum punya notifikasi
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

-- STEP 5: Cek hasil
SELECT 
    'Konsultasi untuk Bu Heni' as info,
    COUNT(*) as jumlah
FROM konsultasi k
INNER JOIN users u ON k.guru_id = u.user_id
WHERE u.email LIKE '%heni%' OR u.nama_lengkap LIKE '%Heni%'
UNION ALL
SELECT 
    'Notifikasi untuk Bu Heni' as info,
    COUNT(*) as jumlah
FROM notifikasi n
INNER JOIN users u ON n.user_id = u.user_id
WHERE (u.email LIKE '%heni%' OR u.nama_lengkap LIKE '%Heni%')
  AND n.is_read = FALSE;

-- STEP 6: Lihat detail konsultasi dan notifikasi Bu Heni
SELECT 
    k.konsultasi_id,
    k.judul,
    k.status,
    u_siswa.nama_lengkap as nama_siswa,
    k.tanggal,
    k.waktu
FROM konsultasi k
INNER JOIN users u_guru ON k.guru_id = u_guru.user_id
INNER JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
WHERE (u_guru.email LIKE '%heni%' OR u_guru.nama_lengkap LIKE '%Heni%')
ORDER BY k.created_at DESC;

SELECT 
    n.notifikasi_id,
    n.judul,
    n.pesan,
    n.is_read,
    n.created_at
FROM notifikasi n
INNER JOIN users u ON n.user_id = u.user_id
WHERE (u.email LIKE '%heni%' OR u.nama_lengkap LIKE '%Heni%')
ORDER BY n.created_at DESC;

