import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const userId = parseInt(id);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID tidak valid' },
        { status: 400 }
      );
    }
    
    // Cek apakah user ada
    const [user] = await query('SELECT * FROM users WHERE user_id = ?', [userId]);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Jangan kick admin
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Tidak dapat menonaktifkan admin' },
        { status: 403 }
      );
    }
    
    // Set is_active = false
    await query('UPDATE users SET is_active = FALSE WHERE user_id = ?', [userId]);
    
    return NextResponse.json({
      success: true,
      message: 'User berhasil dinonaktifkan',
    });
  } catch (error) {
    console.error('Error kicking user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

