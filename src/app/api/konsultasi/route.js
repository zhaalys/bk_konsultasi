import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Ambil daftar konsultasi untuk guru atau siswa
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'user_id dan role harus diisi' },
        { status: 400 }
      );
    }

    let sql = '';
    let params = [];

    if (role === 'guru') {
      // Ambil konsultasi untuk guru
      // Cek dulu apakah user_id ini adalah guru
      const guruCheck = await query(
        'SELECT user_id, email, role FROM users WHERE user_id = ? AND (email LIKE ? OR role = ?)',
        [userId, '%@bk.sch.id', 'guru']
      );
      
      if (guruCheck.length === 0) {
        // Jika user_id tidak ditemukan sebagai guru, coba cari berdasarkan email
        const userInfo = await query('SELECT user_id, email FROM users WHERE user_id = ?', [userId]);
        if (userInfo.length > 0 && userInfo[0].email?.endsWith('@bk.sch.id')) {
          // User adalah guru berdasarkan email, lanjutkan
        } else {
          return NextResponse.json({
            success: true,
            data: [],
            message: 'User bukan guru atau tidak ditemukan'
          });
        }
      }
      
      sql = `
        SELECT 
          k.konsultasi_id,
          k.siswa_id,
          k.guru_id,
          u.nama_lengkap AS nama_siswa,
          u.email AS email_siswa,
          u.nis_nip AS nis_siswa,
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
        INNER JOIN users u ON k.siswa_id = u.user_id
        WHERE k.guru_id = ?
      `;
      params = [userId];

      if (status) {
        sql += ' AND k.status = ?';
        params.push(status);
      }

      sql += ' ORDER BY k.created_at DESC';
    } else {
      // Ambil konsultasi untuk siswa
      sql = `
        SELECT 
          k.konsultasi_id,
          k.guru_id,
          u.nama_lengkap AS nama_guru,
          u.email AS email_guru,
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
        INNER JOIN users u ON k.guru_id = u.user_id
        WHERE k.siswa_id = ?
      `;
      params = [userId];

      if (status) {
        sql += ' AND k.status = ?';
        params.push(status);
      }

      sql += ' ORDER BY k.created_at DESC';
    }

    const results = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: results || [],
    });
  } catch (error) {
    console.error('Get konsultasi error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Terjadi kesalahan pada server',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST: Buat pengajuan konsultasi baru
export async function POST(request) {
  try {
    const { siswa_id, guru_id, judul, deskripsi, tanggal, waktu } = await request.json();

    if (!siswa_id || !guru_id || !judul || !tanggal || !waktu) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Insert konsultasi baru
    const result = await query(
      `INSERT INTO konsultasi (siswa_id, guru_id, judul, deskripsi, tanggal, waktu, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [siswa_id, guru_id, judul, deskripsi, tanggal, waktu]
    );

    return NextResponse.json({
      success: true,
      message: 'Pengajuan konsultasi berhasil dikirim',
      konsultasi_id: result.insertId,
    });
  } catch (error) {
    console.error('Create konsultasi error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

