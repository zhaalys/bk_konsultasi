import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const konsultasiId = parseInt(id);
    
    if (!konsultasiId) {
      return NextResponse.json(
        { error: 'Konsultasi ID tidak valid' },
        { status: 400 }
      );
    }
    
    // Cek apakah konsultasi ada
    const [konsultasi] = await query('SELECT * FROM konsultasi WHERE konsultasi_id = ?', [konsultasiId]);
    
    if (!konsultasi) {
      return NextResponse.json(
        { error: 'Konsultasi tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Hapus konsultasi (CASCADE akan menghapus notifikasi terkait)
    await query('DELETE FROM konsultasi WHERE konsultasi_id = ?', [konsultasiId]);
    
    return NextResponse.json({
      success: true,
      message: 'Konsultasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting konsultasi:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

