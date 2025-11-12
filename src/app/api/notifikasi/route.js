import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Ambil notifikasi untuk user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const unreadOnly = searchParams.get('unread_only') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id harus diisi' },
        { status: 400 }
      );
    }

    let sql = `
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
        k.siswa_id,
        k.guru_id,
        u_siswa.nama_lengkap AS nama_siswa,
        u_siswa.nis_nip AS nis_siswa,
        u_guru.nama_lengkap AS nama_guru
      FROM notifikasi n
      LEFT JOIN konsultasi k ON n.konsultasi_id = k.konsultasi_id
      LEFT JOIN users u_siswa ON k.siswa_id = u_siswa.user_id
      LEFT JOIN users u_guru ON k.guru_id = u_guru.user_id
      WHERE n.user_id = ?
    `;

    const params = [userId];

    if (unreadOnly) {
      sql += ' AND n.is_read = FALSE';
    }

    sql += ' ORDER BY n.created_at DESC LIMIT 50';

    const results = await query(sql, params);

    // Hitung jumlah notifikasi belum dibaca
    const unreadCount = await query(
      'SELECT COUNT(*) as count FROM notifikasi WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: results || [],
      unread_count: unreadCount[0]?.count || 0,
    });
  } catch (error) {
    console.error('Get notifikasi error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      userId: userId
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

// PUT: Mark notifikasi sebagai sudah dibaca
export async function PUT(request) {
  try {
    const { notifikasi_id, user_id, mark_all } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id harus diisi' },
        { status: 400 }
      );
    }

    if (mark_all) {
      // Mark semua notifikasi sebagai sudah dibaca
      await query(
        'UPDATE notifikasi SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
        [user_id]
      );
    } else {
      if (!notifikasi_id) {
        return NextResponse.json(
          { error: 'notifikasi_id harus diisi' },
          { status: 400 }
        );
      }
      // Mark satu notifikasi sebagai sudah dibaca
      await query(
        'UPDATE notifikasi SET is_read = TRUE WHERE notifikasi_id = ? AND user_id = ?',
        [notifikasi_id, user_id]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notifikasi berhasil ditandai sebagai sudah dibaca',
    });
  } catch (error) {
    console.error('Update notifikasi error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

