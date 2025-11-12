import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    // Get all konsultasi with user info
    const konsultasi = await query(`
      SELECT 
        k.konsultasi_id,
        k.siswa_id,
        k.guru_id,
        k.judul,
        k.deskripsi,
        k.tanggal,
        k.waktu,
        k.status,
        k.alasan_penolakan,
        k.catatan_guru,
        k.created_at,
        k.updated_at,
        u1.nama_lengkap as nama_siswa,
        u2.nama_lengkap as nama_guru
      FROM konsultasi k
      LEFT JOIN users u1 ON k.siswa_id = u1.user_id
      LEFT JOIN users u2 ON k.guru_id = u2.user_id
      ORDER BY k.created_at DESC
    `);
    
    return NextResponse.json({
      success: true,
      konsultasi: konsultasi || [],
    });
  } catch (error) {
    console.error('Error fetching konsultasi:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

