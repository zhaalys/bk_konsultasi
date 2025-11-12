'use client';

import Link from 'next/link';
import Image from 'next/image';
import TextPressure from './TextPressure';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 mt-auto relative overflow-hidden">
      <div className="w-full px-6 sm:px-8 lg:px-16 xl:px-20 2xl:px-24 py-20 md:py-24">
        {/* Top Section with Links and Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 lg:gap-24 mb-20">
          {/* Explore Section */}
          <div>
            <p className="text-sm md:text-base text-gray-500 uppercase tracking-wider mb-8 md:mb-10 font-normal">
              Explore
            </p>
            <ul className="space-y-5 md:space-y-6">
              <li>
                <Link 
                  href="/" 
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>HOME</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </Link>
              </li>
              <li>
                <Link 
                  href="/profil-sekolah" 
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>ABOUT</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </Link>
              </li>
              <li>
                <Link 
                  href="/guru-bk" 
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>GURU BK</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </Link>
              </li>
              <li>
                <Link 
                  href="/peta" 
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>CONTACT</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <p className="text-sm md:text-base text-gray-500 uppercase tracking-wider mb-8 md:mb-10 font-normal">
              Connect
            </p>
            <ul className="space-y-5 md:space-y-6">
              <li>
                <a 
                  href="https://www.instagram.com/starbhak.official/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>INSTAGRAM</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/c/SMKTarunaBhaktiDepok" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>YOUTUBE</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/smktarunabhaktidepok" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>FACEBOOK</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tiktok.com/@starbhak.official" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors text-base md:text-lg lg:text-xl uppercase"
                >
                  <span>TIKTOK</span>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="ml-4 h-0.5 bg-gray-300 flex-1"></div>
                </a>
              </li>
            </ul>
          </div>

          {/* Company Info Section */}
          <div className="md:text-right">
            {/* Logo and Slogan */}
            <div className="flex md:flex-row md:justify-end items-start space-x-4 md:space-x-5 mb-8 md:mb-10">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src="/starbhak_logoo.png"
                  alt="SMK Taruna Bhakti Logo"
                  width={32}
                  height={32}
                  className="rounded md:w-10 md:h-10"
                />
              </div>
              <p className="text-blue-900 font-bold text-base md:text-lg lg:text-xl leading-tight uppercase">
                BIMBINGAN KONSELING, PENDIDIKAN TERBAIK.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              <p className="text-blue-400 text-base md:text-lg lg:text-xl font-normal">+62 0812 3680 5390</p>
              <p className="text-blue-400 text-base md:text-lg lg:text-xl font-normal">
                Jl. Raya Depok No. 123, Depok, Jawa Barat 16415
              </p>
            </div>

            {/* Copyright */}
            <p className="text-gray-900 text-base md:text-lg lg:text-xl font-normal">
              Copyright © <span className="font-bold text-blue-900">STARBHAK</span> {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Large STARBHAK Text with TextPressure Animation */}
        <div className="relative z-0 -mb-8 -mt-4" style={{ position: 'relative', height: '500px', minHeight: '450px' }}>
          <TextPressure
            text="STARBHAK"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={false}
            textColor="gradient-blue"
            strokeColor="#ff0000"
            minFontSize={220}
          />
        </div>
      </div>
    </footer>
  );
}
