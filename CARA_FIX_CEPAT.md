# CARA FIX CEPAT - Data Konsultasi Tidak Muncul di Dashboard Bu Heni

## Masalah
Konsultasi sudah masuk ke database, tapi tidak muncul di dashboard Bu Heni karena:
1. `guru_id` di tabel konsultasi tidak sesuai dengan `user_id` Bu Heni
2. Notifikasi belum dibuat

## Solusi CEPAT (Pilih salah satu):

### OPSI 1: Via Browser (PALING MUDAH)
1. Buka browser
2. Akses: `http://localhost:3000/api/fix-konsultasi` (GET untuk cek)
3. Untuk fix, buka Developer Tools (F12) → Console, lalu ketik:
   ```javascript
   fetch('/api/fix-konsultasi', {method: 'POST'}).then(r => r.json()).then(console.log)
   ```
4. Refresh dashboard Bu Heni

### OPSI 2: Via SQL (PASTI BERHASIL)
1. Buka MySQL
2. Copy-paste query dari file `FIX_SEKARANG.sql`
3. Jalankan query STEP 1 dulu untuk cek data
4. Jalankan query STEP 3 untuk update `guru_id`
5. Jalankan query STEP 4 untuk buat notifikasi
6. Refresh dashboard Bu Heni

### OPSI 3: Manual Update (Jika tahu user_id Bu Heni)
Jalankan query ini di MySQL (ganti `X` dengan `user_id` Bu Heni):

```sql
USE sistem_bk;

-- Update guru_id di konsultasi
UPDATE konsultasi 
SET guru_id = X 
WHERE guru_id != X AND status = 'pending';

-- Buat notifikasi
INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan)
SELECT 
    k.guru_id,
    k.konsultasi_id,
    'konsultasi_baru',
    'Pengajuan Konsultasi Baru',
    CONCAT('Siswa ', u.nama_lengkap, ' mengajukan konsultasi: ', k.judul)
FROM konsultasi k
INNER JOIN users u ON k.siswa_id = u.user_id
WHERE k.status = 'pending'
  AND NOT EXISTS (
      SELECT 1 FROM notifikasi n 
      WHERE n.konsultasi_id = k.konsultasi_id 
      AND n.tipe = 'konsultasi_baru'
  );
```

## Cek Hasil
Setelah fix, cek di browser:
- `http://localhost:3000/api/debug?user_id=X` (ganti X dengan user_id Bu Heni)
- Atau refresh dashboard Bu Heni

