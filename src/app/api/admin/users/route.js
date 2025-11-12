import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    // Get all users
    const users = await query(`
      SELECT 
        user_id,
        nama_lengkap,
        email,
        nis_nip,
        role,
        is_active,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json({
      success: true,
      users: users || [],
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

