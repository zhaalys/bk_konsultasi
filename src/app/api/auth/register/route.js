import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { nama_lengkap, email, password, nis_nip } = await request.json();

    // Validasi input
    if (!nama_lengkap || !email || !password || !nis_nip) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validasi email domain untuk menentukan role
    let role = 'siswa';
    if (email.endsWith('@bk.sch.id')) {
      role = 'guru';
    }

    // Cek apakah email sudah terdaftar
    const existingEmail = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Cek apakah NIS/NIP sudah terdaftar
    const existingNis = await query(
      'SELECT * FROM users WHERE nis_nip = ?',
      [nis_nip]
    );

    if (existingNis.length > 0) {
      return NextResponse.json(
        { error: 'NIS/NIP sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user baru
    // Jika role adalah 'guru' tapi database belum support, simpan sebagai 'siswa'
    // Sistem akan tetap mendeteksi sebagai guru berdasarkan email domain
    let dbRole = role;
    if (role === 'guru') {
      try {
        // Coba insert dengan role 'guru'
        const result = await query(
          'INSERT INTO users (nama_lengkap, email, password_hash, nis_nip, role) VALUES (?, ?, ?, ?, ?)',
          [nama_lengkap, email, password_hash, nis_nip, role]
        );
        
        // Return user data (tanpa password)
        const userData = {
          user_id: result.insertId,
          nama_lengkap,
          email,
          nis_nip,
          role: 'guru', // Tetap return 'guru' meskipun di DB mungkin 'siswa'
        };

        return NextResponse.json({
          success: true,
          user: userData,
          message: 'Registrasi berhasil',
        });
      } catch (insertError) {
        // Jika error karena role tidak support, coba dengan 'siswa'
        if (insertError.message?.includes('Data truncated for column \'role\'')) {
          console.warn('Database belum support role "guru", menyimpan sebagai "siswa" tapi akan dideteksi sebagai guru berdasarkan email');
          dbRole = 'siswa';
        } else {
          throw insertError; // Re-throw error lainnya
        }
      }
    }
    
    // Insert dengan role yang sudah disesuaikan
    const result = await query(
      'INSERT INTO users (nama_lengkap, email, password_hash, nis_nip, role) VALUES (?, ?, ?, ?, ?)',
      [nama_lengkap, email, password_hash, nis_nip, dbRole]
    );

    // Return user data (tanpa password)
    // Pastikan role yang dikembalikan sesuai dengan email domain, bukan dari database
    const finalRole = email.endsWith('@bk.sch.id') ? 'guru' : 'siswa';
    const userData = {
      user_id: result.insertId,
      nama_lengkap,
      email,
      nis_nip,
      role: finalRole, // Gunakan role berdasarkan email, bukan dari DB
    };

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Registrasi berhasil',
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Return error message yang lebih detail untuk debugging
    let errorMessage = 'Terjadi kesalahan pada server';
    
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('email')) {
        errorMessage = 'Email sudah terdaftar';
      } else if (error.message.includes('nis_nip')) {
        errorMessage = 'NIS/NIP sudah terdaftar';
      }
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database tidak ditemukan. Pastikan database sudah dibuat.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Tidak dapat terhubung ke database. Pastikan MySQL sudah berjalan.';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Akses database ditolak. Periksa username dan password.';
    } else if (error.code === 'ER_DATA_TOO_LONG' || error.message?.includes('Data truncated for column \'role\'')) {
      errorMessage = 'Kolom role di database tidak support "guru". Perbarui tabel dengan: ALTER TABLE users MODIFY role ENUM(\'siswa\', \'guru\') NOT NULL DEFAULT \'siswa\';';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

