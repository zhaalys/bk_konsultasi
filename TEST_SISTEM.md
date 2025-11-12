# TEST SISTEM KONSULTASI & NOTIFIKASI

## ✅ Checklist Sistem

### 1. Database & Trigger
- ✅ Tabel `users` sudah dibuat
- ✅ Tabel `konsultasi` sudah dibuat
- ✅ Tabel `notifikasi` sudah dibuat
- ✅ Trigger `trg_konsultasi_baru` sudah dibuat (auto-notifikasi untuk guru)
- ✅ Trigger `trg_konsultasi_diterima` sudah dibuat (auto-notifikasi untuk siswa)
- ✅ Trigger `trg_konsultasi_ditolak` sudah dibuat (auto-notifikasi untuk siswa)

### 2. API Endpoints
- ✅ `POST /api/konsultasi` - Buat konsultasi baru
- ✅ `GET /api/konsultasi?user_id=X&role=guru` - Ambil konsultasi untuk guru
- ✅ `PUT /api/konsultasi/[id]` - Terima/Tolak konsultasi
- ✅ `GET /api/notifikasi?user_id=X` - Ambil notifikasi
- ✅ `PUT /api/notifikasi` - Mark notifikasi sebagai dibaca

### 3. Frontend Dashboard Guru
- ✅ Notifikasi bell dengan badge unread count
- ✅ Dropdown notifikasi dengan detail konsultasi
- ✅ Tombol Terima/Tolak di notifikasi
- ✅ Tab "Konsultasi Pending" dengan tombol Terima/Tolak
- ✅ Auto-refresh notifikasi setiap 10 detik

## 🧪 Cara Testing

### Test 1: Ajukan Konsultasi Baru
1. Login sebagai siswa (Ahmad Faishal)
2. Buka halaman "Guru BK"
3. Klik "Jadwalkan Konsultasi" pada Bu Heni
4. Isi form:
   - Pilih tanggal
   - Pilih waktu
   - Pilih topik
   - Isi deskripsi (opsional)
5. Klik "Jadwalkan Konsultasi"
6. **Expected Result:**
   - ✅ Konsultasi berhasil dibuat
   - ✅ Notifikasi otomatis muncul di dashboard Bu Heni
   - ✅ Badge merah di notifikasi bell menunjukkan jumlah notifikasi baru

### Test 2: Guru Menerima Konsultasi dari Notifikasi
1. Login sebagai Bu Heni
2. Buka dashboard guru
3. Klik notifikasi bell (ada badge merah)
4. Lihat notifikasi dengan detail konsultasi
5. Klik tombol "Terima" di notifikasi
6. **Expected Result:**
   - ✅ Konsultasi status berubah menjadi "diterima"
   - ✅ Notifikasi baru muncul untuk siswa (konsultasi diterima)
   - ✅ Notifikasi di dashboard guru hilang atau status berubah
   - ✅ Stats di dashboard update (konsultasi pending berkurang)

### Test 3: Guru Menolak Konsultasi dari Notifikasi
1. Login sebagai Bu Heni
2. Buka dashboard guru
3. Klik notifikasi bell
4. Klik tombol "Tolak" di notifikasi
5. Masukkan alasan penolakan
6. **Expected Result:**
   - ✅ Konsultasi status berubah menjadi "ditolak"
   - ✅ Notifikasi baru muncul untuk siswa (konsultasi ditolak dengan alasan)
   - ✅ Notifikasi di dashboard guru hilang atau status berubah
   - ✅ Stats di dashboard update

### Test 4: Guru Terima/Tolak dari Tab "Konsultasi Pending"
1. Login sebagai Bu Heni
2. Buka dashboard guru
3. Klik tab "Konsultasi Pending"
4. Lihat daftar konsultasi pending
5. Klik tombol "Terima" atau "Tolak"
6. **Expected Result:**
   - ✅ Konsultasi status berubah
   - ✅ Notifikasi muncul untuk siswa
   - ✅ Daftar konsultasi pending update

## 🔍 Verifikasi Database

### Cek Konsultasi
```sql
SELECT * FROM konsultasi ORDER BY created_at DESC;
```

### Cek Notifikasi
```sql
SELECT * FROM notifikasi ORDER BY created_at DESC;
```

### Cek Trigger
```sql
SHOW TRIGGERS;
```

### Cek Konsultasi untuk Bu Heni
```sql
SELECT 
    k.konsultasi_id,
    k.judul,
    k.status,
    u.nama_lengkap as nama_siswa,
    k.tanggal,
    k.waktu
FROM konsultasi k
INNER JOIN users u ON k.siswa_id = u.user_id
WHERE k.guru_id = (SELECT user_id FROM users WHERE email = 'heni.siswati@bk.sch.id')
ORDER BY k.created_at DESC;
```

### Cek Notifikasi untuk Bu Heni
```sql
SELECT 
    n.notifikasi_id,
    n.judul,
    n.pesan,
    n.is_read,
    n.created_at
FROM notifikasi n
WHERE n.user_id = (SELECT user_id FROM users WHERE email = 'heni.siswati@bk.sch.id')
ORDER BY n.created_at DESC;
```

## ⚠️ Troubleshooting

### Masalah: Notifikasi tidak muncul
**Solusi:**
1. Cek apakah trigger sudah dibuat: `SHOW TRIGGERS;`
2. Cek apakah `guru_id` di konsultasi sesuai dengan `user_id` Bu Heni
3. Jalankan query perbaikan dari `DATABASE_COMPLETE_FIXED.sql` bagian 11

### Masalah: Tombol Terima/Tolak tidak berfungsi
**Solusi:**
1. Buka Developer Tools (F12) → Console
2. Cek error di console
3. Pastikan `user_id` Bu Heni benar
4. Cek network tab untuk melihat response API

### Masalah: Konsultasi tidak muncul di dashboard
**Solusi:**
1. Cek apakah `guru_id` di konsultasi sesuai dengan `user_id` Bu Heni
2. Jalankan query perbaikan dari `DATABASE_COMPLETE_FIXED.sql` bagian 10
3. Refresh dashboard

## ✅ Status Akhir

Setelah semua test berhasil:
- ✅ Siswa bisa ajukan konsultasi
- ✅ Notifikasi otomatis muncul untuk guru
- ✅ Guru bisa terima/tolak dari notifikasi
- ✅ Guru bisa terima/tolak dari tab konsultasi pending
- ✅ Siswa mendapat notifikasi saat konsultasi diterima/ditolak
- ✅ Stats dashboard update otomatis

