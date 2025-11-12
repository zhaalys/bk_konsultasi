import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    // Test koneksi database
    const result = await query('SELECT 1 as test');
    
    // Cek struktur tabel users
    const tableInfo = await query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    // Cek apakah role ENUM support 'guru'
    const roleColumn = tableInfo.find(col => col.COLUMN_NAME === 'role');
    
    return NextResponse.json({
      success: true,
      message: 'Database terhubung',
      tableExists: tableInfo.length > 0,
      tableStructure: tableInfo,
      roleColumn: roleColumn,
      roleSupportsGuru: roleColumn?.COLUMN_TYPE?.includes('guru') || false,
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      message: 'Tidak dapat terhubung ke database',
    }, { status: 500 });
  }
}

