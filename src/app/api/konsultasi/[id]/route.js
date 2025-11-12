import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT: Update status konsultasi (Terima/Tolak)
export async function PUT(request, { params }) {
  try {
    // Next.js 15+ requires params to be awaited
    const { id } = await params;
    const { action, guru_id, alasan_penolakan, catatan_guru } = await request.json();

    if (!action || !guru_id) {
      return NextResponse.json(
        { error: 'Action dan guru_id harus diisi' },
        { status: 400 }
      );
    }

    if (action !== 'terima' && action !== 'tolak') {
      return NextResponse.json(
        { error: 'Action harus terima atau tolak' },
        { status: 400 }
      );
    }

    // Validasi id dan guru_id
    if (!id || !guru_id) {
      return NextResponse.json(
        { error: 'ID konsultasi dan guru_id harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah konsultasi ada dan milik guru ini
    const konsultasi = await query(
      'SELECT * FROM konsultasi WHERE konsultasi_id = ? AND guru_id = ?',
      [parseInt(id), parseInt(guru_id)]
    );

    if (konsultasi.length === 0) {
      return NextResponse.json(
        { error: 'Konsultasi tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update status
    if (action === 'terima') {
      await query(
        'UPDATE konsultasi SET status = ?, catatan_guru = ? WHERE konsultasi_id = ? AND guru_id = ?',
        ['diterima', catatan_guru || null, parseInt(id), parseInt(guru_id)]
      );
    } else {
      if (!alasan_penolakan || !alasan_penolakan.trim()) {
        return NextResponse.json(
          { error: 'Alasan penolakan harus diisi' },
          { status: 400 }
        );
      }
      await query(
        'UPDATE konsultasi SET status = ?, alasan_penolakan = ? WHERE konsultasi_id = ? AND guru_id = ?',
        ['ditolak', alasan_penolakan.trim(), parseInt(id), parseInt(guru_id)]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Konsultasi berhasil di${action === 'terima' ? 'terima' : 'tolak'}`,
    });
  } catch (error) {
    console.error('Update konsultasi error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

