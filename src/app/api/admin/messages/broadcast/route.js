import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { role, judul, pesan, tipe = 'info' } = await request.json();
    
    if (!judul || !pesan) {
      return NextResponse.json(
        { error: 'Judul dan pesan harus diisi' },
        { status: 400 }
      );
    }
    
    // Get users berdasarkan role
    let users;
    if (role) {
      users = await query(
        'SELECT user_id FROM users WHERE role = ? AND is_active = TRUE',
        [role]
      );
    } else {
      users = await query(
        'SELECT user_id FROM users WHERE is_active = TRUE'
      );
    }
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada user yang ditemukan' },
        { status: 404 }
      );
    }
    
    // Insert notifikasi untuk semua user (gunakan 'reminder' untuk pesan admin)
    // Tambahkan prefix "Admin: " pada judul untuk identifikasi
    const adminJudul = `Admin: ${judul}`;
    const values = users.map(u => [u.user_id, null, 'reminder', adminJudul, pesan, false]);
    const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();
    
    await query(
      `INSERT INTO notifikasi (user_id, konsultasi_id, tipe, judul, pesan, is_read) 
       VALUES ${placeholders}`,
      flatValues
    );
    
    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim',
      count: users.length,
    });
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

