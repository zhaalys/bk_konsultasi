import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const users = await query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Tentukan role berdasarkan database atau email domain
    let role = user.role;
    // Jika role di database adalah admin, gunakan admin
    if (user.role === 'admin') {
      role = 'admin';
    } else if (email.endsWith('@bk.sch.id')) {
      role = 'guru';
    } else {
      role = 'siswa';
    }

    // Return user data (tanpa password)
    const userData = {
      user_id: user.user_id,
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      nis_nip: user.nis_nip,
      role: role,
    };

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Login berhasil',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

