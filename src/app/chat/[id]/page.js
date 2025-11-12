'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

// Teacher Avatar Icon Component
function TeacherAvatar({ type = 'default', className = "w-6 h-6 text-blue-600" }) {
  const iconClass = className;
  
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

const teachers = {
  1: { name: 'Bu Siti Nurhaliza, S.Pd', specialization: 'Bimbingan Pribadi & Sosial', avatarType: 'female-teacher' },
  2: { name: 'Pak Ahmad Fauzi, S.Pd, M.Pd', specialization: 'Bimbingan Karir', avatarType: 'male-teacher' },
  3: { name: 'Bu Dewi Sartika, S.Pd', specialization: 'Bimbingan Akademik', avatarType: 'female-professional' },
  4: { name: 'Pak Budi Santoso, S.Pd, M.Psi', specialization: 'Bimbingan Pribadi', avatarType: 'male-professional' },
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const teacherId = parseInt(params.id);
  const teacher = teachers[teacherId];
  
  // Initialize messages with lazy initializer
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    
    const chatKey = `chat_${teacherId}`;
    const savedMessages = localStorage.getItem(chatKey);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Handle parse error
      }
    }
    
    // Initial greeting if teacher exists
    if (teacher) {
      return [
        {
          id: 1,
          sender: 'teacher',
          text: `Halo! Saya ${teacher.name}. Saya siap membantu Anda. Ada yang bisa saya bantu?`,
          timestamp: new Date(),
        },
      ];
    }
    
    return [];
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    // Only initialize once
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Load chat history from localStorage if not already loaded
    const chatKey = `chat_${teacherId}`;
    const savedMessages = localStorage.getItem(chatKey);
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0 && messages.length === 0) {
          // Use setTimeout to avoid synchronous setState in effect
          setTimeout(() => {
            setMessages(parsed);
          }, 0);
        }
      } catch (e) {
        // Handle parse error silently
      }
    } else if (teacher && messages.length === 0) {
      // Initial greeting
      const initialMessage = {
        id: 1,
        sender: 'teacher',
        text: `Halo! Saya ${teacher.name}. Saya siap membantu Anda. Ada yang bisa saya bantu?`,
        timestamp: new Date(),
      };
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setMessages([initialMessage]);
      }, 0);
    }
  }, [teacherId, router, teacher, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Save to localStorage
    const chatKey = `chat_${teacherId}`;
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    
    setInputMessage('');

    // Simulate teacher response
    setTimeout(() => {
      const responses = [
        'Terima kasih sudah menyampaikan masalah Anda. Mari kita diskusikan lebih lanjut.',
        'Saya memahami perasaan Anda. Ini adalah langkah yang baik untuk mencari bantuan.',
        'Berdasarkan yang Anda ceritakan, saya punya beberapa saran yang mungkin bisa membantu.',
        'Bagus sekali! Saya senang Anda mau terbuka. Mari kita cari solusi bersama.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const teacherMessage = {
        id: updatedMessages.length + 1,
        sender: 'teacher',
        text: randomResponse,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, teacherMessage];
      setMessages(finalMessages);
      localStorage.setItem(chatKey, JSON.stringify(finalMessages));
    }, 1500);
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Guru BK tidak ditemukan</h3>
            <p className="text-gray-600 mb-6">Guru yang Anda cari tidak tersedia</p>
            <Link
              href="/guru-bk"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Daftar Guru</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-white border-opacity-30">
                <TeacherAvatar type={teacher.avatarType} className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{teacher.name}</h2>
                <p className="text-sm text-blue-100">{teacher.specialization}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-100">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end space-x-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'teacher' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <TeacherAvatar type={teacher.avatarType} className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                      : 'bg-white text-gray-900 border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={sendMessage} className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Kirim</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

