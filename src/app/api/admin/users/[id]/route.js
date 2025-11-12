import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request, { params }) {
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
    
    // Jangan hapus admin
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus admin' },
        { status: 403 }
      );
    }
    
    // Hapus user (CASCADE akan menghapus konsultasi dan notifikasi terkait)
    await query('DELETE FROM users WHERE user_id = ?', [userId]);
    
    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

