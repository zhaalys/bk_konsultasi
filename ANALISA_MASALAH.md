# ANALISA MASALAH: Data Konsultasi Tidak Muncul di Dashboard Bu Heni

## 🔍 DIAGNOSA MASALAH

### ❌ MASALAH 1: Di CODINGAN (jadwal/[id]/page.js)
**Lokasi:** Line 153
```javascript
let guru_id = teacherId; // fallback
```

**Masalah:**
- Jika email guru tidak ditemukan di database, sistem akan pakai `teacherId` (1, 2, 3, dst)
- `teacherId` ini BUKAN `user_id` sebenarnya di database!
- Contoh: Jika `teacherId = 1` (Heni Siswati), tapi `user_id` Bu Heni di database = 5, maka `guru_id` yang disimpan = 1 (SALAH!)

**Dampak:**
- Konsultasi disimpan dengan `guru_id` yang salah
- Dashboard Bu Heni mencari konsultasi dengan `user_id` yang benar, jadi tidak ketemu

### ❌ MASALAH 2: Di MYSQL (Trigger)
**Lokasi:** Trigger `trg_konsultasi_baru`

**Masalah:**
- Trigger mungkin tidak jalan saat insert konsultasi
- Atau trigger jalan tapi `guru_id` di konsultasi sudah salah, jadi notifikasi dibuat untuk `guru_id` yang salah

**Dampak:**
- Notifikasi tidak dibuat untuk Bu Heni
- Atau notifikasi dibuat untuk user yang salah

## ✅ SOLUSI

### Fix 1: Perbaiki Codingan (WAJIB)
- Pastikan `guru_id` yang digunakan adalah `user_id` sebenarnya dari database
- Jangan pakai fallback ke `teacherId`
- Jika email tidak ditemukan, tampilkan error, jangan lanjutkan

### Fix 2: Perbaiki Data di MySQL (UNTUK DATA YANG SUDAH ADA)
- Update `guru_id` di tabel konsultasi ke `user_id` yang benar
- Buat notifikasi manual untuk konsultasi yang belum punya notifikasi

## 🎯 KESIMPULAN

**Masalahnya di KEDUA-DUANYA:**
1. **Codingan** → Menyimpan `guru_id` yang salah (pakai `teacherId` bukan `user_id`)
2. **MySQL** → Data yang sudah salah perlu diperbaiki, trigger perlu dicek

**Prioritas Fix:**
1. ✅ Fix codingan dulu (agar data baru tidak salah lagi)
2. ✅ Fix data lama di MySQL (update `guru_id` yang salah)

