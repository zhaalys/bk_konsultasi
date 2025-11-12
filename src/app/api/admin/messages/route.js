import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Get sent messages
export async function GET(request) {
  try {
    const messages = await query(`
      SELECT 
        n.notifikasi_id,
        n.user_id,
        n.judul,
        n.pesan,
        n.tipe,
        n.created_at,
        u.nama_lengkap as nama_user,
        u.email as email_user
      FROM notifikasi n
      LEFT JOIN users u ON n.user_id = u.user_id
      WHERE n.tipe IN ('konsultasi_baru', 'konsultasi_diterima', 'konsultasi_ditolak', 'konsultasi_dibatalkan', 'reminder')
      AND n.judul LIKE '%Admin%' OR n.tipe = 'reminder'
      ORDER BY n.created_at DESC
      LIMIT 100
    `);
    
    return NextResponse.json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST - Send message to user
export async function POST(request) {
  try {
    const { user_id, judul, pesan, tipe = 'info' } = await request.json();
    
    if (!user_id || !judul || !pesan) {
      return NextResponse.json(
        { error: 'user_id, judul, dan pesan harus diisi' },
        { status: 400 }
      );
    }
    
    // Cek apakah user ada
    const [user] = await query('SELECT * FROM users WHERE user_id = ? AND is_active = TRUE', [user_id]);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan atau tidak aktif' },
        { status: 404 }
      );
    }
    
    // Insert notifikasi (gunakan 'reminder' untuk pesan admin karena tipe ENUM terbatas)
    // Tambahkan prefix "Admin: " pada judul untuk identifikasi
    const adminJudul = `Admin: ${judul}`;
    await query(
      `INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan, is_read) 
       VALUES (?, NULL, 'reminder', ?, ?, FALSE)`,
      [user_id, adminJudul, pesan]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

