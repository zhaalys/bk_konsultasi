import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Ambil daftar users berdasarkan role atau email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const email = searchParams.get('email');

    let sql = 'SELECT user_id, nama_lengkap, email, nis_nip, role, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (email) {
      sql += ' AND email = ?';
      params.push(email);
    }

    sql += ' ORDER BY created_at DESC';

    const results = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

