import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Debug endpoint untuk cek data konsultasi dan notifikasi
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id harus diisi' },
        { status: 400 }
      );
    }

    // Cek user info
    const userInfo = await query(
      'SELECT user_id, nama_lengkap, email, role FROM users WHERE user_id = ?',
      [userId]
    );

    // Cek konsultasi untuk guru ini
    const konsultasi = await query(
      'SELECT * FROM konsultasi WHERE guru_id = ?',
      [userId]
    );

    // Cek notifikasi untuk user ini
    const notifikasi = await query(
      'SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Cek semua konsultasi
    const allKonsultasi = await query('SELECT * FROM konsultasi');

    // Cek semua notifikasi
    const allNotifikasi = await query('SELECT * FROM notifikasi ORDER BY created_at DESC');

    return NextResponse.json({
      success: true,
      user_info: userInfo[0] || null,
      konsultasi_for_guru: konsultasi,
      notifikasi_for_user: notifikasi,
      all_konsultasi: allKonsultasi,
      all_notifikasi: allNotifikasi,
      debug: {
        user_id: userId,
        konsultasi_count: konsultasi.length,
        notifikasi_count: notifikasi.length,
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan pada server',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

