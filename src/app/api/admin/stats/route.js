import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    // Cek admin (dari query atau header)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    // TODO: Add proper admin authentication check
    // For now, we'll trust the request
    
    // Get stats
    const [totalUsers] = await query('SELECT COUNT(*) as count FROM users');
    const [totalSiswa] = await query("SELECT COUNT(*) as count FROM users WHERE role = 'siswa'");
    const [totalGuru] = await query("SELECT COUNT(*) as count FROM users WHERE role = 'guru'");
    const [totalKonsultasi] = await query('SELECT COUNT(*) as count FROM konsultasi');
    const [konsultasiPending] = await query("SELECT COUNT(*) as count FROM konsultasi WHERE status = 'pending'");
    
    return NextResponse.json({
      totalUsers: totalUsers?.count || 0,
      totalSiswa: totalSiswa?.count || 0,
      totalGuru: totalGuru?.count || 0,
      totalKonsultasi: totalKonsultasi?.count || 0,
      konsultasiPending: konsultasiPending?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

