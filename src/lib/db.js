import mysql from 'mysql2/promise';

// Konfigurasi database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistem_bk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Membuat connection pool
const pool = mysql.createPool(dbConfig);

// Fungsi untuk mendapatkan koneksi
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Fungsi untuk query database
export async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Fungsi untuk menutup pool (untuk cleanup)
export async function closePool() {
  await pool.end();
}

export default pool;

