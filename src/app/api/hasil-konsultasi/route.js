import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Fungsi untuk memastikan tabel hasil_konsultasi ada
async function ensureTableExists() {
  try {
    // Cek apakah tabel sudah ada
    const checkTable = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'hasil_konsultasi'
    `);
    
    if (checkTable[0]?.count === 0) {
      // Tabel belum ada, buat tabel
      console.log('Creating hasil_konsultasi table...');
      await query(`
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Table hasil_konsultasi created successfully!');
    }
  } catch (error) {
    console.error('Error ensuring table exists:', error);
    // Jika foreign key constraint error, coba buat tanpa foreign key dulu
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_CANNOT_ADD_FOREIGN') {
      try {
        await query(`
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
            INDEX idx_konsultasi_id (konsultasi_id),
            INDEX idx_tanggal_konsultasi (tanggal_konsultasi)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Table hasil_konsultasi created without foreign key!');
      } catch (e) {
        console.error('Error creating table without foreign key:', e);
        throw e;
      }
    } else {
      throw error;
    }
  }
}

// GET: Ambil hasil konsultasi berdasarkan konsultasi_id atau user_id
export async function GET(request) {
  try {
    // Pastikan tabel ada
    await ensureTableExists();
    const { searchParams } = new URL(request.url);
    const konsultasiId = searchParams.get('konsultasi_id');
    const userId = searchParams.get('user_id');
    const role = searchParams.get('role');

    if (konsultasiId) {
      // Ambil hasil konsultasi berdasarkan konsultasi_id
      // Validasi: hanya siswa pemilik konsultasi atau guru yang menangani yang bisa melihat
      
      // Jika user_id dan role diberikan, validasi akses
      if (userId && role) {
        // Cek apakah user memiliki akses ke konsultasi ini
        const accessCheck = await query(
          `SELECT k.konsultasi_id, k.siswa_id, k.guru_id 
           FROM konsultasi k 
           WHERE k.konsultasi_id = ? 
           AND (k.siswa_id = ? OR k.guru_id = ?)`,
          [parseInt(konsultasiId), parseInt(userId), parseInt(userId)]
        );
        
        if (accessCheck.length === 0) {
          // User tidak memiliki akses ke konsultasi ini
          return NextResponse.json(
            { 
              success: false,
              error: 'Anda tidak memiliki akses untuk melihat hasil konsultasi ini' 
            },
            { status: 403 }
          );
        }
      }
      
      const sql = `
        SELECT 
          h.*,
          k.judul,
          k.deskripsi,
          k.status,
          k.siswa_id,
          k.guru_id,
          u_guru.nama_lengkap AS nama_guru_full,
          u_guru.email AS email_guru,
          u_siswa.nama_lengkap AS nama_siswa_full,
          u_siswa.email AS email_siswa
        FROM hasil_konsultasi h
        INNER JOIN konsultasi k ON h.konsultasi_id = k.konsultasi_id
        INNER JOIN users u_guru ON k.guru_id = u_guru.user_id
        INNER JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
        WHERE h.konsultasi_id = ?
      `;
      
      const results = await query(sql, [parseInt(konsultasiId)]);
      
      return NextResponse.json({
        success: true,
        data: results.length > 0 ? results[0] : null,
      });
    } else if (userId && role) {
      // Ambil semua hasil konsultasi untuk user (guru atau siswa)
      let sql = '';
      let params = [];

      if (role === 'guru') {
        sql = `
          SELECT 
            h.*,
            k.judul,
            k.deskripsi,
            k.status,
            u_siswa.nama_lengkap AS nama_siswa_full,
            u_siswa.email AS email_siswa
          FROM hasil_konsultasi h
          INNER JOIN konsultasi k ON h.konsultasi_id = k.konsultasi_id
          INNER JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
          WHERE k.guru_id = ?
          ORDER BY h.created_at DESC
        `;
        params = [parseInt(userId)];
      } else {
        sql = `
          SELECT 
            h.*,
            k.judul,
            k.deskripsi,
            k.status,
            u_guru.nama_lengkap AS nama_guru_full,
            u_guru.email AS email_guru
          FROM hasil_konsultasi h
          INNER JOIN konsultasi k ON h.konsultasi_id = k.konsultasi_id
          INNER JOIN users u_guru ON k.guru_id = u_guru.user_id
          WHERE k.siswa_id = ?
          ORDER BY h.created_at DESC
        `;
        params = [parseInt(userId)];
      }

      const results = await query(sql, params);
      
      return NextResponse.json({
        success: true,
        data: results,
      });
    } else {
      return NextResponse.json(
        { error: 'konsultasi_id atau user_id dan role harus diisi' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Get hasil konsultasi error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST: Simpan hasil konsultasi
export async function POST(request) {
  try {
    // Pastikan tabel ada sebelum melakukan operasi
    await ensureTableExists();
    
    const {
      konsultasi_id,
      nama_siswa,
      nis_siswa,
      kelas,
      tanggal_lahir,
      alamat,
      alamat_lengkap,
      kota,
      provinsi,
      kode_pos,
      no_telp,
      tanggal_konsultasi,
      waktu_konsultasi,
      topik_konsultasi,
      jenis_masalah,
      masalah,
      latar_belakang,
      gejala,
      solusi,
      langkah_solusi,
      rekomendasi,
      tindak_lanjut,
      jadwal_tindak_lanjut,
      catatan_tambahan,
      nama_guru,
      nip_guru,
      email_guru,
    } = await request.json();

    // Validasi required fields
    const missingFields = [];
    if (!konsultasi_id) missingFields.push('konsultasi_id');
    if (!nama_siswa) missingFields.push('nama_siswa');
    if (!nis_siswa) missingFields.push('nis_siswa');
    if (!tanggal_konsultasi) missingFields.push('tanggal_konsultasi');
    if (!waktu_konsultasi) missingFields.push('waktu_konsultasi');
    if (!masalah) missingFields.push('masalah');
    if (!solusi) missingFields.push('solusi');
    if (!nama_guru) missingFields.push('nama_guru');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false,
          error: `Field wajib harus diisi: ${missingFields.join(', ')}`,
          missing_fields: missingFields
        },
        { status: 400 }
      );
    }

    console.log('Received data:', {
      konsultasi_id,
      nama_siswa,
      nis_siswa,
      tanggal_konsultasi,
      waktu_konsultasi,
      masalah: masalah?.substring(0, 50) + '...',
      solusi: solusi?.substring(0, 50) + '...',
      nama_guru
    });

    // Cek apakah konsultasi sudah ada hasilnya
    const existing = await query(
      'SELECT hasil_id FROM hasil_konsultasi WHERE konsultasi_id = ?',
      [parseInt(konsultasi_id)]
    );
    
    console.log('Existing hasil konsultasi:', existing.length > 0 ? 'Found' : 'Not found');

    if (existing.length > 0) {
      // Update existing
      const sql = `
        UPDATE hasil_konsultasi SET
          nama_siswa = ?,
          nis_siswa = ?,
          kelas = ?,
          tanggal_lahir = ?,
          alamat = ?,
          alamat_lengkap = ?,
          kota = ?,
          provinsi = ?,
          kode_pos = ?,
          no_telp = ?,
          tanggal_konsultasi = ?,
          waktu_konsultasi = ?,
          topik_konsultasi = ?,
          jenis_masalah = ?,
          masalah = ?,
          latar_belakang = ?,
          gejala = ?,
          solusi = ?,
          langkah_solusi = ?,
          rekomendasi = ?,
          tindak_lanjut = ?,
          jadwal_tindak_lanjut = ?,
          catatan_tambahan = ?,
          nama_guru = ?,
          nip_guru = ?,
          email_guru = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE konsultasi_id = ?
      `;
      
      await query(sql, [
        nama_siswa,
        nis_siswa,
        kelas || null,
        tanggal_lahir || null,
        alamat || null,
        alamat_lengkap || null,
        kota || null,
        provinsi || null,
        kode_pos || null,
        no_telp || null,
        tanggal_konsultasi,
        waktu_konsultasi,
        topik_konsultasi || null,
        jenis_masalah || null,
        masalah,
        latar_belakang || null,
        gejala || null,
        solusi,
        langkah_solusi || null,
        rekomendasi || null,
        tindak_lanjut || null,
        jadwal_tindak_lanjut || null,
        catatan_tambahan || null,
        nama_guru,
        nip_guru || null,
        email_guru || null,
        parseInt(konsultasi_id),
      ]);

      // Update status konsultasi menjadi 'selesai'
      await query(
        'UPDATE konsultasi SET status = ? WHERE konsultasi_id = ?',
        ['selesai', parseInt(konsultasi_id)]
      );

      return NextResponse.json({
        success: true,
        message: 'Hasil konsultasi berhasil diupdate',
        hasil_id: existing[0].hasil_id,
      });
    } else {
      // Insert new
      const sql = `
        INSERT INTO hasil_konsultasi (
          konsultasi_id,
          nama_siswa,
          nis_siswa,
          kelas,
          tanggal_lahir,
          alamat,
          alamat_lengkap,
          kota,
          provinsi,
          kode_pos,
          no_telp,
          tanggal_konsultasi,
          waktu_konsultasi,
          topik_konsultasi,
          jenis_masalah,
          masalah,
          latar_belakang,
          gejala,
          solusi,
          langkah_solusi,
          rekomendasi,
          tindak_lanjut,
          jadwal_tindak_lanjut,
          catatan_tambahan,
          nama_guru,
          nip_guru,
          email_guru
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        parseInt(konsultasi_id),
        nama_siswa,
        nis_siswa,
        kelas || null,
        tanggal_lahir || null,
        alamat || null,
        alamat_lengkap || null,
        kota || null,
        provinsi || null,
        kode_pos || null,
        no_telp || null,
        tanggal_konsultasi,
        waktu_konsultasi,
        topik_konsultasi || null,
        jenis_masalah || null,
        masalah,
        latar_belakang || null,
        gejala || null,
        solusi,
        langkah_solusi || null,
        rekomendasi || null,
        tindak_lanjut || null,
        jadwal_tindak_lanjut || null,
        catatan_tambahan || null,
        nama_guru,
        nip_guru || null,
        email_guru || null,
      ];
      
      console.log('Inserting with params count:', params.length);
      console.log('SQL placeholders count:', (sql.match(/\?/g) || []).length);
      
      const result = await query(sql, params);
      console.log('Insert result:', result);

      // Update status konsultasi menjadi 'selesai'
      await query(
        'UPDATE konsultasi SET status = ? WHERE konsultasi_id = ?',
        ['selesai', parseInt(konsultasi_id)]
      );

      return NextResponse.json({
        success: true,
        message: 'Hasil konsultasi berhasil disimpan',
      });
    }
  } catch (error) {
    console.error('Save hasil konsultasi error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Terjadi kesalahan pada server',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        sqlError: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined
      },
      { status: 500 }
    );
  }
}

