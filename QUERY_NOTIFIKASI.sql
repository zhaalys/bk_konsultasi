-- ######################################################################
-- # QUERY NOTIFIKASI UNTUK GURU - PENGAJUAN KONSULTASI
-- # Copy query ini untuk testing atau kebutuhan lainnya
-- ######################################################################

USE sistem_bk;

-- ######################################################################
-- # 1. QUERY: Lihat semua notifikasi untuk guru (termasuk detail konsultasi)
-- ######################################################################

SELECT 
    n.notifikasi_id,
    n.user_id,
    n.konsultasi_id,
    n.tipe,
    n.judul,
    n.pesan,
    n.is_read,
    n.created_at,
    k.judul AS konsultasi_judul,
    k.deskripsi AS konsultasi_deskripsi,
    k.tanggal AS konsultasi_tanggal,
    k.waktu AS konsultasi_waktu,
    k.status AS konsultasi_status,
    u_siswa.nama_lengkap AS nama_siswa,
    u_siswa.nis_nip AS nis_siswa,
    u_siswa.email AS email_siswa
FROM notifikasi n
LEFT JOIN konsultasi k ON n.konsultasi_id = k.konsultasi_id
LEFT JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
WHERE n.user_id = :guru_id  -- Ganti dengan user_id guru (contoh: user_id Bu Heni)
  AND n.tipe = 'konsultasi_baru'
ORDER BY n.created_at DESC;

-- ######################################################################
-- # 2. QUERY: Lihat notifikasi belum dibaca untuk guru
-- ######################################################################

SELECT 
    n.notifikasi_id,
    n.judul,
    n.pesan,
    n.created_at,
    k.konsultasi_id,
    k.judul AS topik_konsultasi,
    k.tanggal,
    k.waktu,
    u_siswa.nama_lengkap AS nama_siswa,
    u_siswa.nis_nip AS nis_siswa
FROM notifikasi n
LEFT JOIN konsultasi k ON n.konsultasi_id = k.konsultasi_id
LEFT JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
WHERE n.user_id = :guru_id
  AND n.is_read = FALSE
  AND n.tipe = 'konsultasi_baru'
ORDER BY n.created_at DESC;

-- ######################################################################
-- # 3. QUERY: Lihat detail konsultasi dari notifikasi
-- ######################################################################

SELECT 
    k.konsultasi_id,
    k.siswa_id,
    u_siswa.nama_lengkap AS nama_siswa,
    u_siswa.nis_nip AS nis_siswa,
    u_siswa.email AS email_siswa,
    k.judul,
    k.deskripsi,
    k.tanggal,
    k.waktu,
    k.status,
    k.created_at
FROM konsultasi k
INNER JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
WHERE k.konsultasi_id = :konsultasi_id
  AND k.guru_id = :guru_id;

-- ######################################################################
-- # 4. QUERY: Terima konsultasi (Update status)
-- ######################################################################

-- UPDATE konsultasi 
-- SET status = 'diterima',
--     catatan_guru = :catatan  -- Opsional
-- WHERE konsultasi_id = :konsultasi_id 
--   AND guru_id = :guru_id;

-- ######################################################################
-- # 5. QUERY: Tolak konsultasi (Update status dengan alasan)
-- ######################################################################

-- UPDATE konsultasi 
-- SET status = 'ditolak',
--     alasan_penolakan = :alasan  -- Wajib diisi
-- WHERE konsultasi_id = :konsultasi_id 
--   AND guru_id = :guru_id;

-- ######################################################################
-- # 6. QUERY: Mark notifikasi sebagai sudah dibaca
-- ######################################################################

-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE notifikasi_id = :notifikasi_id 
--   AND user_id = :guru_id;

-- ######################################################################
-- # 7. QUERY: Hitung jumlah notifikasi belum dibaca untuk guru
-- ######################################################################

SELECT COUNT(*) AS jumlah_notifikasi_belum_dibaca
FROM notifikasi
WHERE user_id = :guru_id
  AND is_read = FALSE;

-- ######################################################################
-- # 8. QUERY: Lihat semua konsultasi pending untuk guru tertentu
-- ######################################################################

SELECT 
    k.konsultasi_id,
    k.siswa_id,
    u.nama_lengkap AS nama_siswa,
    u.nis_nip AS nis_siswa,
    u.email AS email_siswa,
    k.judul,
    k.deskripsi,
    k.tanggal,
    k.waktu,
    k.status,
    k.created_at
FROM konsultasi k
INNER JOIN users u ON k.siswa_id = u.user_id
WHERE k.guru_id = :guru_id
  AND k.status = 'pending'
ORDER BY k.created_at DESC;

-- ######################################################################
-- # 9. QUERY: Contoh untuk Bu Heni (ganti :guru_id dengan user_id Bu Heni)
-- ######################################################################

-- Cari user_id Bu Heni terlebih dahulu:
-- SELECT user_id, nama_lengkap, email FROM users WHERE email LIKE '%heni%' OR nama_lengkap LIKE '%heni%';

-- Kemudian gunakan user_id tersebut untuk query notifikasi:
-- SELECT * FROM notifikasi WHERE user_id = :user_id_bu_heni AND is_read = FALSE;

