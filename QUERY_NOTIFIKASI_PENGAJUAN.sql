-- ######################################################################
-- # QUERY NOTIFIKASI PENGAJUAN KONSULTASI UNTUK GURU
-- # Copy query ini untuk testing atau kebutuhan lainnya
-- ######################################################################

USE sistem_bk;

-- ######################################################################
-- # 1. QUERY: Lihat semua notifikasi pengajuan konsultasi untuk Bu Heni
-- # (Ganti :guru_id dengan user_id Bu Heni dari tabel users)
-- ######################################################################

-- Langkah 1: Cari user_id Bu Heni terlebih dahulu
SELECT user_id, nama_lengkap, email, role 
FROM users 
WHERE email LIKE '%heni%' 
   OR nama_lengkap LIKE '%heni%' 
   OR nama_lengkap LIKE '%Heni%';

-- Langkah 2: Gunakan user_id dari hasil query di atas (contoh: user_id = 2)
-- Lihat semua notifikasi pengajuan konsultasi untuk Bu Heni
SELECT 
    n.notifikasi_id,
    n.user_id AS guru_id,
    n.konsultasi_id,
    n.tipe,
    n.judul,
    n.pesan,
    n.is_read,
    n.created_at,
    -- Detail Konsultasi
    k.judul AS topik_konsultasi,
    k.deskripsi AS deskripsi_konsultasi,
    k.tanggal,
    k.waktu,
    k.status AS status_konsultasi,
    -- Info Siswa
    u_siswa.user_id AS siswa_id,
    u_siswa.nama_lengkap AS nama_siswa,
    u_siswa.nis_nip AS nis_siswa,
    u_siswa.email AS email_siswa
FROM notifikasi n
LEFT JOIN konsultasi k ON n.konsultasi_id = k.konsultasi_id
LEFT JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
WHERE n.user_id = 2  -- Ganti dengan user_id Bu Heni
  AND n.tipe = 'konsultasi_baru'
ORDER BY n.created_at DESC;

-- ######################################################################
-- # 2. QUERY: Lihat notifikasi belum dibaca untuk Bu Heni
-- ######################################################################

SELECT 
    n.notifikasi_id,
    n.judul,
    n.pesan,
    n.created_at,
    k.konsultasi_id,
    k.judul AS topik,
    k.deskripsi,
    k.tanggal,
    k.waktu,
    k.status,
    u_siswa.nama_lengkap AS nama_siswa,
    u_siswa.nis_nip AS nis_siswa
FROM notifikasi n
LEFT JOIN konsultasi k ON n.konsultasi_id = k.konsultasi_id
LEFT JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
WHERE n.user_id = 2  -- Ganti dengan user_id Bu Heni
  AND n.is_read = FALSE
  AND n.tipe = 'konsultasi_baru'
ORDER BY n.created_at DESC;

-- ######################################################################
-- # 3. QUERY: Lihat detail lengkap konsultasi dari Ahmad Faishal ke Bu Heni
-- ######################################################################

-- Cari user_id Ahmad Faishal (siswa)
SELECT user_id, nama_lengkap, email, nis_nip 
FROM users 
WHERE nama_lengkap LIKE '%Ahmad%' 
   OR nama_lengkap LIKE '%Faishal%'
   OR email LIKE '%ahmad%'
   OR email LIKE '%faishal%';

-- Lihat konsultasi dari siswa tertentu ke Bu Heni
SELECT 
    k.konsultasi_id,
    k.siswa_id,
    u_siswa.nama_lengkap AS nama_siswa,
    u_siswa.nis_nip AS nis_siswa,
    u_siswa.email AS email_siswa,
    k.guru_id,
    u_guru.nama_lengkap AS nama_guru,
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
INNER JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
INNER JOIN users u_guru ON k.guru_id = u_guru.user_id
WHERE k.guru_id = 2  -- Ganti dengan user_id Bu Heni
  AND k.siswa_id = 1  -- Ganti dengan user_id Ahmad Faishal
ORDER BY k.created_at DESC;

-- ######################################################################
-- # 4. QUERY: Terima konsultasi (Contoh untuk konsultasi_id = 1)
-- ######################################################################

-- UPDATE konsultasi 
-- SET status = 'diterima',
--     catatan_guru = 'Konsultasi diterima, silakan datang tepat waktu'
-- WHERE konsultasi_id = 1 
--   AND guru_id = 2;  -- Ganti dengan user_id Bu Heni

-- ######################################################################
-- # 5. QUERY: Tolak konsultasi dengan alasan
-- ######################################################################

-- UPDATE konsultasi 
-- SET status = 'ditolak',
--     alasan_penolakan = 'Jadwal sudah penuh, silakan pilih waktu lain'
-- WHERE konsultasi_id = 1 
--   AND guru_id = 2;  -- Ganti dengan user_id Bu Heni

-- ######################################################################
-- # 6. QUERY: Mark notifikasi sebagai sudah dibaca
-- ######################################################################

-- Mark satu notifikasi
-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE notifikasi_id = 1 
--   AND user_id = 2;  -- Ganti dengan user_id Bu Heni

-- Mark semua notifikasi sebagai sudah dibaca
-- UPDATE notifikasi 
-- SET is_read = TRUE 
-- WHERE user_id = 2  -- Ganti dengan user_id Bu Heni
--   AND is_read = FALSE;

-- ######################################################################
-- # 7. QUERY: Hitung jumlah notifikasi belum dibaca untuk Bu Heni
-- ######################################################################

SELECT COUNT(*) AS jumlah_notifikasi_belum_dibaca
FROM notifikasi
WHERE user_id = 2  -- Ganti dengan user_id Bu Heni
  AND is_read = FALSE;

-- ######################################################################
-- # 8. QUERY: Lihat semua konsultasi pending untuk Bu Heni
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
WHERE k.guru_id = 2  -- Ganti dengan user_id Bu Heni
  AND k.status = 'pending'
ORDER BY k.created_at DESC;

-- ######################################################################
-- # 9. QUERY: Test insert konsultasi (Contoh dari Ahmad Faishal ke Bu Heni)
-- ######################################################################

-- Pastikan user_id sudah benar:
-- SELECT user_id, nama_lengkap, email FROM users WHERE role = 'siswa';  -- Untuk cari user_id Ahmad Faishal
-- SELECT user_id, nama_lengkap, email FROM users WHERE role = 'guru';   -- Untuk cari user_id Bu Heni

-- Insert konsultasi (contoh):
-- INSERT INTO konsultasi (siswa_id, guru_id, judul, deskripsi, tanggal, waktu, status)
-- VALUES (
--     1,  -- user_id Ahmad Faishal (ganti dengan user_id yang benar)
--     2,  -- user_id Bu Heni (ganti dengan user_id yang benar)
--     'Bimbingan Pribadi',
--     'Saya ingin konsultasi mengenai masalah pribadi',
--     '2025-11-15',
--     '10:00:00',
--     'pending'
-- );

-- Setelah insert, notifikasi akan otomatis dibuat oleh trigger

-- ######################################################################
-- # 10. QUERY: Verifikasi notifikasi sudah dibuat setelah insert konsultasi
-- ######################################################################

-- SELECT * FROM notifikasi 
-- WHERE konsultasi_id = :konsultasi_id_baru
-- ORDER BY created_at DESC;

