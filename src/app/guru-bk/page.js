import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Teacher Avatar Icon Component
function TeacherAvatar({ type = 'default' }) {
  const iconClass = "w-10 h-10 text-blue-600";
  
  if (type === 'female-teacher') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  } else if (type === 'male-teacher') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  } else if (type === 'female-professional') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  } else {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
}

const teachers = [
  {
    id: 1,
    name: 'Heni Siswati, S.Psi',
    title: 'KOORDINATOR BK',
    specialization: 'Bimbingan Pribadi & Sosial',
    experience: '10 tahun',
    email: 'heni.siswati@smktarunabhakti.sch.id',
    description: 'Ahli dalam membantu siswa mengatasi masalah pribadi dan membangun hubungan sosial yang sehat.',
    image: '/guru_bk/HeniSiswati,S.Psi.jpg',
  },
  {
    id: 2,
    name: 'Kasandra Fitriani. N, S.Pd',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Karir',
    experience: '8 tahun',
    email: 'kasandra.fitriani@smktarunabhakti.sch.id',
    description: 'Spesialis bimbingan karir dan perencanaan masa depan siswa.',
    image: '/guru_bk/KasandraFitriani.N,S.Pd.png',
  },
  {
    id: 3,
    name: 'Nadya Afriliani Ariesta, S.Pd',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Akademik',
    experience: '7 tahun',
    email: 'nadya.afriliani@smktarunabhakti.sch.id',
    description: 'Membantu siswa meningkatkan prestasi akademik dan mengatasi kesulitan belajar.',
    image: '/guru_bk/NadyaAfrilianiAriesta,S.Pd.png',
  },
  {
    id: 4,
    name: 'Ika Rafika, S.Pd',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Pribadi',
    experience: '6 tahun',
    email: 'ika.rafika@smktarunabhakti.sch.id',
    description: 'Konselor berpengalaman dalam membantu siswa mengembangkan potensi diri.',
    image: '/guru_bk/IkaRafika,S.Pd.png',
  },
  {
    id: 5,
    name: 'Ricky M Sudra',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Karir & Akademik',
    experience: '9 tahun',
    email: 'ricky.sudra@smktarunabhakti.sch.id',
    description: 'Konselor berpengalaman dalam bimbingan karir dan akademik untuk membantu siswa meraih masa depan yang cerah.',
    image: '/guru_bk/Ricky_M_Sudra.png',
  },
];

export default function GuruBKPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Guru Bimbingan Konseling
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tim guru BK profesional yang siap membantu Anda dalam berbagai aspek bimbingan dan konseling melalui konsultasi tatap muka.
            </p>
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:scale-105 flex flex-col h-full"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="relative mb-4 flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                      {teacher.image ? (
                        <Image
                          src={teacher.image}
                          alt={teacher.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <TeacherAvatar type={teacher.avatarType || 'female-teacher'} />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 flex-shrink-0">
                    {teacher.name}
                  </h3>
                  {teacher.title && (
                    <p className="text-blue-600 font-semibold text-sm mb-3 flex-shrink-0">
                      {teacher.title}
                    </p>
                  )}
                  <p className="text-gray-700 font-medium text-sm mb-2 flex-shrink-0">
                    {teacher.specialization}
                  </p>
                  <p className="text-gray-500 text-xs mb-3 flex-shrink-0">
                    Pengalaman: {teacher.experience}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {teacher.description}
                  </p>
                  <div className="w-full mt-auto flex-shrink-0">
                    <Link
                      href={`/jadwal/${teacher.id}`}
                      className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      Jadwalkan Konsultasi
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tentang Layanan BK
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Konsultasi Tatap Muka</h3>
                <p className="text-gray-600 text-sm">
                  Jadwalkan konsultasi langsung dengan guru BK secara offline untuk komunikasi yang lebih personal dan efektif.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Privasi Terjaga</h3>
                <p className="text-gray-600 text-sm">
                  Semua konsultasi dijaga kerahasiaannya dan hanya diketahui oleh Anda dan guru BK yang bersangkutan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fleksibel</h3>
                <p className="text-gray-600 text-sm">
                  Pilih waktu yang sesuai dengan jadwal Anda. Lihat jadwal yang tersedia dan buat janji konsultasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

