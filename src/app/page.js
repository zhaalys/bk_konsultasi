'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RotatingText from '@/components/RotatingText';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(2); // Default expanded adalah FAQ ke-3 (index 2)
  const [nodes, setNodes] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const faqRef = useRef(null);
  const featuresRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    setIsVisible(true);
    
    // Generate random nodes only on client side to avoid hydration mismatch
    const generatedNodes = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 8 + Math.random() * 12,
      height: 8 + Math.random() * 12,
      animationDelay: Math.random() * 3,
      animationDuration: 3 + Math.random() * 2,
      backgroundColor: `rgba(37, 99, 235, ${0.15 + Math.random() * 0.15})`,
    }));
    setNodes(generatedNodes);
    
    // Animate stats on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('.stat-card');
      statCards.forEach((card) => observer.observe(card));
    }

    // Animate features section on scroll
    const featuresObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card');
            const title = entry.target.querySelector('.section-title');
            if (title) title.classList.add('animate-slideUp');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-scaleIn');
                // Icon tetap terlihat dengan opacity 1
                const icon = card.querySelector('.feature-icon');
                if (icon) {
                  icon.style.opacity = '1';
                }
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      featuresObserver.observe(featuresRef.current);
    }

    // Animate services section on scroll
    const servicesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card');
            const title = entry.target.querySelector('.section-title');
            if (title) title.classList.add('animate-slideUp');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-slideInScale');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (servicesRef.current) {
      servicesObserver.observe(servicesRef.current);
    }

    // Animate contact section on scroll
    const contactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.contact-item');
            const title = entry.target.querySelector('.section-title');
            if (title) title.classList.add('animate-slideUp');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate-fadeInUp');
                const icon = item.querySelector('.contact-icon');
                if (icon) {
                  setTimeout(() => {
                    icon.classList.add('animate-iconPulse');
                  }, 200);
                }
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      contactObserver.observe(contactRef.current);
    }

    // Handle ESC key to close modal
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && selectedFeature) {
        setSelectedFeature(null);
      }
    };

    window.addEventListener('keydown', handleEscKey);

    // Make FAQ items visible - they should always be visible
    // Animation is just for enhancement
    const makeFaqVisible = () => {
      if (faqRef.current) {
        const faqItems = faqRef.current.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 50);
        });
      }
    };

    // Make FAQ visible after mount
    const timeoutId = setTimeout(() => {
      makeFaqVisible();
    }, 200);

    // Also observe for scroll-based animation enhancement
    const faqObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            makeFaqVisible();
          }
        });
      },
      { threshold: 0.01 }
    );

    if (faqRef.current) {
      faqObserver.observe(faqRef.current);
    }

    return () => {
      observer.disconnect();
      faqObserver.disconnect();
      featuresObserver.disconnect();
      servicesObserver.disconnect();
      contactObserver.disconnect();
      window.removeEventListener('keydown', handleEscKey);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedFeature]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section with Grid Background and Network Graphics */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(37, 99, 235, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(37, 99, 235, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        {/* Animated Network Nodes - Client-side only to avoid hydration error */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {nodes.map((node, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  left: `${node.left}%`,
                  top: `${node.top}%`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                  animationDelay: `${node.animationDelay}s`,
                  animationDuration: `${node.animationDuration}s`,
                  backgroundColor: node.backgroundColor,
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Headline with Multi-color Text */}
          <h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="block text-gray-900 mb-2">Konseling Anda,</span>
            <span className="block" style={{ color: '#2563eb' }}>
              <RotatingText
                texts={['Keselamatan Anda,', 'Masa Depan Anda']}
                mainClassName="overflow-hidden inline-flex justify-center items-center"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden inline-block"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={5000}
              />
            </span>
          </h1>

          {/* Description Paragraph */}
          <p 
            className={`text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Platform bimbingan konseling berbasis komunitas yang mengubah komunikasi 
            keselamatan dan pengembangan siswa melalui konseling kolaboratif real-time. 
            Ketika dukungan dibutuhkan, guru BK merespons terlebih dahulu.
          </p>

          {/* CTA Button */}
          <div 
            className={`flex justify-center items-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <Link
              href="/login"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-2"
              style={{ 
                background: 'linear-gradient(to right, #2563eb, #1e40af)',
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Konsultasi Sekarang</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Cards Section */}
      <section 
        ref={statsRef}
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Active Alerts Card */}
            <div 
              className="stat-card bg-white rounded-2xl p-8 shadow-xl border-l-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl opacity-0"
              style={{ 
                animationDelay: '0ms',
                borderLeftColor: '#2563eb',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <svg className="w-8 h-8" style={{ color: '#2563eb' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-5xl font-black text-gray-900 mb-2">852</h3>
              <p className="text-gray-600 text-lg font-medium">Konsultasi Aktif</p>
            </div>

            {/* Community Members Card */}
            <div 
              className="stat-card bg-white rounded-2xl p-8 shadow-xl border-l-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl opacity-0"
              style={{ 
                animationDelay: '200ms',
                borderLeftColor: '#1e40af',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <svg className="w-8 h-8" style={{ color: '#1e40af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-5xl font-black text-gray-900 mb-2">1.203</h3>
              <p className="text-gray-600 text-lg font-medium">Siswa Terdaftar</p>
            </div>

            {/* Verified Reports Card */}
            <div 
              className="stat-card bg-white rounded-2xl p-8 shadow-xl border-l-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl opacity-0"
              style={{ 
                animationDelay: '400ms',
                borderLeftColor: '#3b82f6',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <svg className="w-8 h-8" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-5xl font-black text-gray-900 mb-2">6.119</h3>
              <p className="text-gray-600 text-lg font-medium">Sesi Terverifikasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Layanan Bimbingan Konseling */}
      <section ref={featuresRef} className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="section-title text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 opacity-0">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Layanan Bimbingan Konseling
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Bimbingan Pribadi',
                description: 'Bantuan untuk mengembangkan potensi diri, mengatasi masalah pribadi, dan meningkatkan kemampuan adaptasi.',
                color: '#2563eb',
                fullDescription: 'Bimbingan Pribadi adalah layanan konseling yang fokus pada pengembangan potensi diri siswa secara holistik. Layanan ini membantu siswa memahami diri sendiri, mengidentifikasi kekuatan dan kelemahan, serta mengembangkan keterampilan untuk mengatasi berbagai tantangan pribadi.',
                benefits: [
                  'Pengembangan potensi diri dan bakat',
                  'Mengatasi masalah pribadi dan emosional',
                  'Meningkatkan rasa percaya diri',
                  'Mengembangkan kemampuan adaptasi',
                  'Mengelola stress dan tekanan',
                  'Membangun karakter yang positif'
                ],
                methods: [
                  'Konseling individual',
                  'Diskusi kelompok',
                  'Workshop pengembangan diri',
                  'Aktivitas refleksi',
                  'Latihan mindfulness'
                ],
                duration: '30-60 menit per sesi',
              },
              {
                icon: (
                  <svg className="w-8 h-8" style={{ color: '#1e40af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Bimbingan Karir',
                description: 'Panduan dalam memilih karir, merencanakan masa depan, dan mengembangkan keterampilan yang dibutuhkan.',
                color: '#1e40af',
                fullDescription: 'Bimbingan Karir membantu siswa dalam merencanakan masa depan profesional mereka. Layanan ini memberikan panduan untuk memilih jurusan, karir, dan mengembangkan keterampilan yang diperlukan untuk sukses di dunia kerja.',
                benefits: [
                  'Eksplorasi minat dan bakat',
                  'Pemilihan jurusan yang tepat',
                  'Perencanaan karir jangka panjang',
                  'Pengembangan keterampilan profesional',
                  'Persiapan memasuki dunia kerja',
                  'Pemahaman tentang peluang karir'
                ],
                methods: [
                  'Tes minat dan bakat',
                  'Konseling karir',
                  'Kunjungan industri',
                  'Workshop pengembangan karir',
                  'Simulasi wawancara kerja'
                ],
                duration: '45-90 menit per sesi',
              },
              {
                icon: (
                  <svg className="w-8 h-8" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: 'Bimbingan Sosial',
                description: 'Bantuan dalam berinteraksi dengan lingkungan sosial, membangun hubungan yang baik, dan mengatasi konflik.',
                color: '#3b82f6',
                fullDescription: 'Bimbingan Sosial membantu siswa mengembangkan keterampilan sosial yang efektif, membangun hubungan yang positif dengan teman sebaya, keluarga, dan masyarakat. Layanan ini juga membantu siswa dalam mengatasi konflik dan masalah interpersonal.',
                benefits: [
                  'Pengembangan keterampilan komunikasi',
                  'Membangun hubungan yang sehat',
                  'Mengatasi konflik interpersonal',
                  'Meningkatkan empati dan toleransi',
                  'Mengembangkan kerja tim',
                  'Mengatasi bullying dan peer pressure'
                ],
                methods: [
                  'Konseling kelompok',
                  'Role playing',
                  'Aktivitas team building',
                  'Diskusi kasus',
                  'Mediasi konflik'
                ],
                duration: '45-60 menit per sesi',
              },
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedFeature(feature);
                  setIsDetailOpen(true);
                }}
                className="feature-card bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 opacity-0 hover-lift group relative overflow-hidden cursor-pointer transition-all duration-300"
              >
                {/* Animated background gradient on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color} 0%, transparent 100%)`,
                  }}
                ></div>
                
                {/* Icon container - Always visible dengan animasi yang lebih halus */}
                <div 
                  className="feature-icon relative w-16 h-16 rounded-xl flex items-center justify-center mb-6 z-10 transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: '#dbeafe',
                  }}
                >
                  {/* Icon selalu terlihat dengan opacity 1 */}
                  <div 
                    className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
                    style={{ opacity: 1 }}
                  >
                    {feature.icon}
                  </div>
                  {/* Subtle glow effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ 
                      backgroundColor: feature.color,
                      filter: 'blur(10px)',
                    }}
                  ></div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors duration-300 z-10 relative">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed z-10 relative mb-4">{feature.description}</p>
                
                {/* Click indicator */}
                <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 relative">
                  <span>Klik untuk detail</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* Decorative corner element */}
                <div 
                  className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top right, ${feature.color} 0%, transparent 70%)`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {isDetailOpen && selectedFeature && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setIsDetailOpen(false);
            setSelectedFeature(null);
          }}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              animation: 'scaleIn 0.4s ease-out',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsDetailOpen(false);
                setSelectedFeature(null);
              }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 group"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Icon and Title */}
            <div 
              className="relative p-8 pb-6 rounded-t-3xl"
              style={{
                background: `linear-gradient(135deg, ${selectedFeature.color}15 0%, ${selectedFeature.color}05 100%)`,
              }}
            >
              <div className="flex items-start gap-6">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounceIn"
                  style={{ 
                    backgroundColor: selectedFeature.color + '20',
                    animation: 'bounceIn 0.6s ease-out',
                  }}
                >
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-2xl animate-pulse"
                      style={{ 
                        backgroundColor: selectedFeature.color,
                        opacity: 0.2,
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    ></div>
                    <div className="relative z-10" style={{ color: selectedFeature.color }}>
                      {selectedFeature.icon}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 
                    className="text-3xl md:text-4xl font-black text-gray-900 mb-2 animate-slideUp"
                    style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}
                  >
                    {selectedFeature.title}
                  </h2>
                  <div className="h-1 w-20 rounded-full mb-4 animate-slideUp" style={{ backgroundColor: selectedFeature.color, animation: 'slideUp 0.5s ease-out 0.2s both' }}></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-6 space-y-8">
              {/* Full Description */}
              <div className="animate-fadeInUp" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedFeature.color }}></div>
                  Deskripsi
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedFeature.fullDescription}
                </p>
              </div>

              {/* Benefits */}
              <div className="animate-fadeInUp" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedFeature.color }}></div>
                  Manfaat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedFeature.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300 group"
                      style={{ animation: `fadeInUp 0.5s ease-out ${0.5 + index * 0.1}s both` }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: selectedFeature.color + '20' }}
                      >
                        <svg className="w-4 h-4" style={{ color: selectedFeature.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 flex-1">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods */}
              <div className="animate-fadeInUp" style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedFeature.color }}></div>
                  Metode Pelaksanaan
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedFeature.methods.map((method, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 rounded-full bg-white border-2 transition-all duration-300 hover:scale-105 group"
                      style={{ 
                        borderColor: selectedFeature.color + '40',
                        animation: `scaleIn 0.4s ease-out ${0.7 + index * 0.1}s both`,
                      }}
                    >
                      <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="animate-fadeInUp" style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border-2" style={{ borderColor: selectedFeature.color + '30' }}>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: selectedFeature.color + '20' }}
                    >
                      <svg className="w-6 h-6" style={{ color: selectedFeature.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Durasi Sesi</p>
                      <p className="text-lg font-bold text-gray-900">{selectedFeature.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="animate-fadeInUp" style={{ animation: 'fadeInUp 0.6s ease-out 0.9s both' }}>
                <Link
                  href="/login"
                  onClick={() => {
                    setIsDetailOpen(false);
                    setSelectedFeature(null);
                  }}
                  className="block w-full px-6 py-4 text-center rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedFeature.color} 0%, ${selectedFeature.color}dd 100%)`,
                  }}
                >
                  Konsultasi Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section - Modern Design with Animations */}
      <section 
        ref={faqRef}
        id="faq-section"
        className="py-32 relative overflow-hidden"
        style={{ backgroundColor: '#e0f2fe', minHeight: '800px' }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Title Section - Top Right */}
          <div className="flex justify-end mb-20">
            <div className="text-right">
              <h2 className="text-7xl md:text-8xl font-black text-blue-900 mb-4 tracking-tight">
                PERTANYAAN?
              </h2>
              <p className="text-2xl md:text-3xl text-blue-700 font-medium">
                Kami siap membantu Anda.
              </p>
            </div>
          </div>

          {/* FAQ Grid */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {[
              {
                number: '1st',
                question: 'Apa itu Bimbingan Konseling dan bagaimana cara kerjanya?',
                answer: 'Bimbingan Konseling (BK) adalah layanan bantuan profesional untuk membantu siswa mengembangkan potensi diri, mengatasi masalah pribadi, sosial, belajar, dan karir. Di platform ini, Anda dapat berkonsultasi langsung dengan guru BK melalui chat online yang aman dan nyaman.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                number: '2nd',
                question: 'Bagaimana cara melakukan konsultasi dengan guru BK?',
                answer: 'Anda dapat melakukan konsultasi dengan mudah melalui platform online ini. Pertama, daftar atau login ke akun Anda. Kemudian, pilih guru BK yang sesuai dengan kebutuhan Anda dari halaman "Guru BK", lalu mulai konsultasi melalui fitur chat yang tersedia. Prosesnya sederhana dan dapat dilakukan kapan saja.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
              {
                number: '3rd',
                question: 'Apakah konsultasi dengan guru BK bersifat rahasia?',
                answer: 'Ya, semua konsultasi dengan guru BK bersifat rahasia dan hanya diketahui oleh Anda dan guru BK yang terkait. Kami menjaga privasi dan kerahasiaan setiap konsultasi dengan standar keamanan tinggi. Informasi pribadi Anda tidak akan dibagikan kepada pihak ketiga tanpa izin Anda, kecuali dalam situasi yang memerlukan tindakan darurat sesuai dengan protokol keamanan.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
              {
                number: '4th',
                question: 'Berapa lama waktu respon dari guru BK?',
                answer: 'Guru BK akan merespon konsultasi Anda dalam waktu yang cepat, biasanya dalam 1-2 jam pada hari kerja (Senin-Jumat, 08:00-16:00 WIB). Untuk konsultasi mendesak atau darurat, Anda dapat menghubungi langsung melalui kontak yang tersedia atau menghubungi nomor darurat sekolah.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                number: '5th',
                question: 'Apakah konsultasi online gratis?',
                answer: 'Ya, konsultasi online melalui platform ini gratis untuk semua siswa SMK Taruna Bhakti Depok. Ini adalah layanan yang disediakan oleh sekolah untuk membantu perkembangan dan kesejahteraan siswa. Tidak ada biaya tersembunyi atau biaya tambahan untuk menggunakan layanan ini.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                number: '6th',
                question: 'Bagaimana cara melihat riwayat konsultasi?',
                answer: 'Setelah login, Anda dapat mengakses halaman "Riwayat" dari menu navigasi untuk melihat semua riwayat konsultasi Anda dengan guru BK. Riwayat akan tersimpan secara otomatis dan dapat diakses kapan saja. Di halaman riwayat, Anda dapat melihat detail konsultasi, catatan penting, dan perkembangan yang telah dicapai.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
            ].map((faq, index) => {
              const isExpanded = expandedFaq === index;
              
              return (
                <div
                  key={index}
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className={`faq-item relative cursor-pointer transition-all duration-700 ease-out ${
                    isExpanded 
                      ? 'md:col-span-2 lg:col-span-3 order-first z-50 opacity-100' 
                      : 'hover:scale-105 z-10'
                  }`}
                  style={{
                    opacity: 1, // Always visible
                    transform: 'translateY(0)', // No initial transform
                    gridRow: isExpanded ? 'span 2' : 'span 1',
                  }}
                >
                  {isExpanded ? (
                    // Expanded FAQ - Oval Container
                    <div 
                      className="relative bg-white rounded-[60px] p-12 shadow-2xl transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2"
                      style={{
                        boxShadow: '0 20px 60px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(37, 99, 235, 0.05)',
                      }}
                    >
                      {/* Decorative circles */}
                      <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
                      
                      <div className="relative z-10">
                        {/* Number and Icon */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-blue-600">{faq.number} Question</span>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              {faq.icon}
                            </div>
                          </div>
                        </div>
                        
                        {/* Question */}
                        <h3 className="text-3xl md:text-4xl font-black text-blue-900 mb-6 leading-tight uppercase tracking-tight">
                          {faq.question}
                        </h3>
                        
                        {/* Answer */}
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                        
                        {/* Close indicator */}
                        <div className="mt-8 flex items-center text-blue-600 font-semibold">
                          <span>Klik untuk menutup</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Collapsed FAQ - Simple Question (Always Visible)
                    <div 
                      className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-xl border border-blue-100 hover:border-blue-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Number and Icon */}
                        <div className="flex items-center gap-3 flex-shrink-0 mt-1">
                          <span className="text-base font-bold text-blue-600">{faq.number}</span>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-md group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                            {faq.icon}
                          </div>
                        </div>
                        
                        {/* Question - Always Visible and Readable */}
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-bold text-blue-900 group-hover:text-blue-700 transition-colors leading-relaxed mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-xs md:text-sm text-blue-600 font-medium opacity-80">
                            Klik untuk melihat jawaban
                          </p>
                        </div>
                        
                        {/* Expand indicator - Always Visible */}
                        <div className="flex-shrink-0 text-blue-600 mt-1 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section ref={contactRef} className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="section-title text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 opacity-0">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Hubungi Kami
            </span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      title: 'Alamat',
                      content: 'Jl. Raya Depok No. 123\nDepok, Jawa Barat 16415',
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      title: 'Telepon',
                      content: '+62 0812 3680 5390',
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      title: 'Email',
                      content: 'info@starbhak.sch.id',
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: 'Jam Operasional',
                      content: 'Senin - Jumat: 08:00 - 16:00 WIB\nSabtu: 08:00 - 12:00 WIB',
                    },
                  ].map((contact, index) => (
                    <div 
                      key={index} 
                      className="contact-item flex items-start space-x-4 opacity-0 group hover-lift p-4 rounded-xl transition-all duration-300 hover:bg-blue-50"
                    >
                      <div 
                        className="contact-icon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 icon-hover-effect relative"
                        style={{ backgroundColor: '#dbeafe' }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative z-10">{contact.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{contact.title}</h4>
                        <p className="text-gray-600 whitespace-pre-line">{contact.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Data */}
              <div className="contact-item opacity-0 bg-blue-50 rounded-xl p-8 shadow-lg hover-lift">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Data Sekolah
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="transform transition-transform hover:scale-110">
                    <p className="text-sm text-gray-600">NPSN</p>
                    <p className="text-xl font-bold text-gray-900">20234567</p>
                  </div>
                  <div className="transform transition-transform hover:scale-110">
                    <p className="text-sm text-gray-600">Akreditasi</p>
                    <p className="text-xl font-bold text-gray-900">A</p>
                  </div>
                  <div className="transform transition-transform hover:scale-110">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-xl font-bold text-gray-900">Swasta</p>
                  </div>
                  <div className="transform transition-transform hover:scale-110">
                    <p className="text-sm text-gray-600">Tahun Berdiri</p>
                    <p className="text-xl font-bold text-gray-900">1990</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-item opacity-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Lokasi Sekolah</h3>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden hover-lift transform transition-all duration-300 hover:shadow-2xl">
                <div className="h-96 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.317982539016!2d106.80658331534305!3d-6.397413795417311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eb8b4b8b4b8b%3A0x8b4b8b4b8b4b8b4b!2sSMK%20Taruna%20Bhakti!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SMK Taruna Bhakti Depok Location"
                  ></iframe>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <a
                    href="https://maps.app.goo.gl/gzhMawu9dVAL3qM88"
            target="_blank"
            rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center justify-center group"
          >
                    Buka di Google Maps
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
          </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
