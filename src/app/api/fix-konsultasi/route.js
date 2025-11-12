import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST: Fix konsultasi yang guru_id nya salah
export async function POST(request) {
  try {
    // 1. Cek semua konsultasi dan guru_id nya
    const allKonsultasi = await query('SELECT * FROM konsultasi ORDER BY created_at DESC');
    
    // 2. Cek semua guru
    const allGuru = await query("SELECT user_id, nama_lengkap, email FROM users WHERE email LIKE '%@bk.sch.id' OR role = 'guru'");
    
    // 3. Mapping email ke user_id
    const emailToUserId = {};
    allGuru.forEach(guru => {
      emailToUserId[guru.email.toLowerCase()] = guru.user_id;
    });
    
    // 4. Fix konsultasi yang guru_id nya salah
    const fixes = [];
    for (const konsultasi of allKonsultasi) {
      // Cek apakah guru_id valid
      const guruExists = allGuru.find(g => g.user_id === konsultasi.guru_id);
      
      if (!guruExists) {
        // Coba cari berdasarkan siswa_id (ambil guru pertama yang ada)
        if (allGuru.length > 0) {
          const firstGuru = allGuru[0];
          await query(
            'UPDATE konsultasi SET guru_id = ? WHERE konsultasi_id = ?',
            [firstGuru.user_id, konsultasi.konsultasi_id]
          );
          fixes.push({
            konsultasi_id: konsultasi.konsultasi_id,
            old_guru_id: konsultasi.guru_id,
            new_guru_id: firstGuru.user_id,
            action: 'Updated guru_id'
          });
        }
      }
    }
    
    // 5. Buat notifikasi untuk konsultasi yang belum punya notifikasi
    const konsultasiPending = await query(
      "SELECT k.*, u.nama_lengkap, u.nis_nip FROM konsultasi k INNER JOIN users u ON k.siswa_id = u.user_id WHERE k.status = 'pending'"
    );
    
    const notifikasiCreated = [];
    for (const konsultasi of konsultasiPending) {
      // Cek apakah sudah ada notifikasi
      const existingNotif = await query(
        'SELECT * FROM notifikasi WHERE konsultasi_id = ? AND tipe = ?',
        [konsultasi.konsultasi_id, 'konsultasi_baru']
      );
      
      if (existingNotif.length === 0) {
        // Buat notifikasi
        const pesan = `Siswa ${konsultasi.nama_lengkap} (NIS: ${konsultasi.nis_nip}) mengajukan konsultasi. Topik: ${konsultasi.judul}. Tanggal: ${new Date(konsultasi.tanggal).toLocaleDateString('id-ID')} pukul ${konsultasi.waktu}. ${konsultasi.deskripsi ? 'Deskripsi: ' + konsultasi.deskripsi : ''}`;
        
        await query(
          'INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan) VALUES (?, ?, ?, ?, ?)',
          [konsultasi.guru_id, konsultasi.konsultasi_id, 'konsultasi_baru', 'Pengajuan Konsultasi Baru', pesan]
        );
        
        notifikasiCreated.push({
          konsultasi_id: konsultasi.konsultasi_id,
          guru_id: konsultasi.guru_id,
          action: 'Created notification'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Data berhasil diperbaiki',
      fixes: fixes,
      notifikasi_created: notifikasiCreated,
      summary: {
        total_konsultasi: allKonsultasi.length,
        total_guru: allGuru.length,
        konsultasi_fixed: fixes.length,
        notifikasi_created: notifikasiCreated.length
      }
    });
  } catch (error) {
    console.error('Fix konsultasi error:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan pada server',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET: Cek status data
export async function GET(request) {
  try {
    // Cek semua konsultasi
    const allKonsultasi = await query('SELECT * FROM konsultasi ORDER BY created_at DESC');
    
    // Cek semua guru
    const allGuru = await query("SELECT user_id, nama_lengkap, email FROM users WHERE email LIKE '%@bk.sch.id' OR role = 'guru'");
    
    // Cek konsultasi per guru
    const konsultasiPerGuru = {};
    for (const guru of allGuru) {
      const konsultasi = await query(
        'SELECT COUNT(*) as count FROM konsultasi WHERE guru_id = ?',
        [guru.user_id]
      );
      konsultasiPerGuru[guru.email] = {
        user_id: guru.user_id,
        nama: guru.nama_lengkap,
        konsultasi_count: konsultasi[0].count
      };
    }
    
    // Cek notifikasi per guru
    const notifikasiPerGuru = {};
    for (const guru of allGuru) {
      const notif = await query(
        'SELECT COUNT(*) as count FROM notifikasi WHERE user_id = ?',
        [guru.user_id]
      );
      const unread = await query(
        'SELECT COUNT(*) as count FROM notifikasi WHERE user_id = ? AND is_read = FALSE',
        [guru.user_id]
      );
      notifikasiPerGuru[guru.email] = {
        user_id: guru.user_id,
        total: notif[0].count,
        unread: unread[0].count
      };
    }
    
    return NextResponse.json({
      success: true,
      data: {
        total_konsultasi: allKonsultasi.length,
        total_guru: allGuru.length,
        konsultasi_per_guru: konsultasiPerGuru,
        notifikasi_per_guru: notifikasiPerGuru,
        all_konsultasi: allKonsultasi,
        all_guru: allGuru
      }
    });
  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan pada server',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

