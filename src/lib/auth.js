// Helper function untuk menentukan role berdasarkan email
export function getUserRole(user) {
  if (!user) return null;
  
  // Pastikan email @bk.sch.id selalu dianggap sebagai guru
  if (user.email?.endsWith('@bk.sch.id')) {
    return 'guru';
  }
  
  return user.role || 'siswa';
}

// Helper function untuk check apakah user adalah guru
export function isGuru(user) {
  return getUserRole(user) === 'guru';
}

// Helper function untuk check apakah user adalah siswa
export function isSiswa(user) {
  return getUserRole(user) === 'siswa';
}

