import jsPDF from 'jspdf';

export const exportHasilKonsultasiPDF = async (hasilKonsultasi) => {
  try {
    if (!hasilKonsultasi) {
      console.error('Data hasil konsultasi tidak ditemukan');
      alert('Data hasil konsultasi tidak ditemukan');
      return;
    }

    console.log('Memulai export PDF dengan data:', hasilKonsultasi);

    // Format tanggal
    const formatTanggal = (dateString) => {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    };

    const formatTanggalSingkat = (dateString) => {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID');
      } catch (e) {
        return dateString;
      }
    };

    // Buat PDF baru
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Fungsi untuk check dan add new page
    const checkNewPage = (requiredSpace) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Fungsi untuk add text dengan wrapping
    const addWrappedText = (text, x, maxWidth, fontSize = 10, isBold = false) => {
      if (!text) return yPos;
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        if (index > 0) {
          checkNewPage(6);
        }
        pdf.text(line, x, yPos);
        yPos += 6;
      });
      return yPos;
    };

    // Header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175); // Blue color
    const title = 'LAPORAN HASIL KONSULTASI';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, yPos);
    yPos += 8;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139); // Gray color
    const subtitle = 'Sistem Bimbingan dan Konseling';
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, yPos);
    yPos += 10;

    // Line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // I. INFORMASI SISWA
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('I. INFORMASI SISWA', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const infoSiswa = [
      ['Nama Siswa', hasilKonsultasi.nama_siswa || '-'],
      ['NIS', hasilKonsultasi.nis_siswa || '-'],
      hasilKonsultasi.kelas ? ['Kelas', hasilKonsultasi.kelas] : null,
      hasilKonsultasi.tanggal_lahir ? ['Tanggal Lahir', formatTanggalSingkat(hasilKonsultasi.tanggal_lahir)] : null,
      hasilKonsultasi.alamat ? ['Alamat', hasilKonsultasi.alamat] : null,
      hasilKonsultasi.alamat_lengkap ? ['Alamat Lengkap', hasilKonsultasi.alamat_lengkap] : null,
      (hasilKonsultasi.kota || hasilKonsultasi.provinsi) ? ['Kota/Provinsi', `${[hasilKonsultasi.kota, hasilKonsultasi.provinsi].filter(Boolean).join(', ')}${hasilKonsultasi.kode_pos ? ' ' + hasilKonsultasi.kode_pos : ''}`] : null,
      hasilKonsultasi.no_telp ? ['No. Telepon', hasilKonsultasi.no_telp] : null,
    ].filter(Boolean);

    infoSiswa.forEach(([label, value]) => {
      checkNewPage(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${label}:`, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      const valueLines = pdf.splitTextToSize(value, pageWidth - margin * 2 - 50);
      pdf.text(valueLines, margin + 50, yPos);
      yPos += valueLines.length * 6;
    });

    yPos += 5;

    // II. INFORMASI KONSULTASI
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('II. INFORMASI KONSULTASI', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    const infoKonsultasi = [
      (hasilKonsultasi.topik_konsultasi || hasilKonsultasi.judul) ? ['Topik', hasilKonsultasi.topik_konsultasi || hasilKonsultasi.judul] : null,
      hasilKonsultasi.jenis_masalah ? ['Jenis Masalah', hasilKonsultasi.jenis_masalah] : null,
      ['Tanggal Konsultasi', formatTanggal(hasilKonsultasi.tanggal_konsultasi)],
      ['Waktu Konsultasi', `${hasilKonsultasi.waktu_konsultasi || '-'} WIB`],
    ].filter(Boolean);

    infoKonsultasi.forEach(([label, value]) => {
      checkNewPage(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${label}:`, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      const valueLines = pdf.splitTextToSize(value, pageWidth - margin * 2 - 50);
      pdf.text(valueLines, margin + 50, yPos);
      yPos += valueLines.length * 6;
    });

    yPos += 5;

    // III. MASALAH YANG DIHADAPI
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('III. MASALAH YANG DIHADAPI', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    yPos = addWrappedText(hasilKonsultasi.masalah || '-', margin, pageWidth - margin * 2, 10, false);
    yPos += 5;

    if (hasilKonsultasi.latar_belakang) {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Latar Belakang Masalah:', margin, yPos);
      yPos += 6;
      pdf.setFont('helvetica', 'normal');
      yPos = addWrappedText(hasilKonsultasi.latar_belakang, margin, pageWidth - margin * 2, 10, false);
      yPos += 5;
    }

    if (hasilKonsultasi.gejala) {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Gejala yang Terlihat:', margin, yPos);
      yPos += 6;
      pdf.setFont('helvetica', 'normal');
      yPos = addWrappedText(hasilKonsultasi.gejala, margin, pageWidth - margin * 2, 10, false);
      yPos += 5;
    }

    // IV. SOLUSI YANG DIBERIKAN
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('IV. SOLUSI YANG DIBERIKAN', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    yPos = addWrappedText(hasilKonsultasi.solusi || '-', margin, pageWidth - margin * 2, 10, false);
    yPos += 5;

    if (hasilKonsultasi.langkah_solusi) {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Langkah-langkah Solusi:', margin, yPos);
      yPos += 6;
      pdf.setFont('helvetica', 'normal');
      yPos = addWrappedText(hasilKonsultasi.langkah_solusi, margin, pageWidth - margin * 2, 10, false);
      yPos += 5;
    }

    if (hasilKonsultasi.rekomendasi) {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rekomendasi:', margin, yPos);
      yPos += 6;
      pdf.setFont('helvetica', 'normal');
      yPos = addWrappedText(hasilKonsultasi.rekomendasi, margin, pageWidth - margin * 2, 10, false);
      yPos += 5;
    }

    // V. TINDAK LANJUT
    if (hasilKonsultasi.tindak_lanjut) {
      checkNewPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('V. TINDAK LANJUT', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      yPos = addWrappedText(hasilKonsultasi.tindak_lanjut, margin, pageWidth - margin * 2, 10, false);
      yPos += 5;

      if (hasilKonsultasi.jadwal_tindak_lanjut) {
        checkNewPage(15);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Jadwal Tindak Lanjut:', margin, yPos);
        yPos += 6;
        pdf.setFont('helvetica', 'normal');
        yPos = addWrappedText(formatTanggal(hasilKonsultasi.jadwal_tindak_lanjut), margin, pageWidth - margin * 2, 10, false);
        yPos += 5;
      }
    }

    // VI. CATATAN TAMBAHAN
    if (hasilKonsultasi.catatan_tambahan) {
      checkNewPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('VI. CATATAN TAMBAHAN', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      yPos = addWrappedText(hasilKonsultasi.catatan_tambahan, margin, pageWidth - margin * 2, 10, false);
      yPos += 5;
    }

    // Footer - Tanda Tangan
    checkNewPage(50);
    yPos = pageHeight - 60;

    // Left side - Info Guru
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Guru BK:', margin, yPos);
    yPos += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text(hasilKonsultasi.nama_guru || '-', margin, yPos);
    yPos += 6;
    if (hasilKonsultasi.nip_guru) {
      pdf.text(`NIP: ${hasilKonsultasi.nip_guru}`, margin, yPos);
      yPos += 6;
    }
    if (hasilKonsultasi.email_guru) {
      pdf.text(`Email: ${hasilKonsultasi.email_guru}`, margin, yPos);
      yPos += 6;
    }
    yPos += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, yPos);

    // Right side - Tanda Tangan
    pdf.setTextColor(0, 0, 0);
    const signatureX = pageWidth - margin - 80;
    yPos = pageHeight - 60;
    pdf.setDrawColor(0, 0, 0);
    pdf.line(signatureX, yPos + 30, signatureX + 60, yPos + 30);
    yPos += 35;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(hasilKonsultasi.nama_guru || 'Guru BK', signatureX + 30, yPos, { align: 'center' });
    yPos += 6;
    if (hasilKonsultasi.nip_guru) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`NIP. ${hasilKonsultasi.nip_guru}`, signatureX + 30, yPos, { align: 'center' });
    }

    // Simpan PDF
    const fileName = `Laporan_Hasil_Konsultasi_${(hasilKonsultasi.nama_siswa || 'Konsultasi').replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    console.log('Menyimpan PDF dengan nama:', fileName);
    pdf.save(fileName);
    console.log('PDF berhasil disimpan!');

  } catch (error) {
    console.error('Error saat export PDF:', error);
    alert(`Gagal mengunduh PDF: ${error.message}`);
    throw error;
  }
};
