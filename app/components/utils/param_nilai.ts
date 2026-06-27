export const DEFAULT_BOBOT_PENILAIAN = {
  kehadiran: 0.10,
  lapangan: 0.50,
  kuis: 0.20,
  laporan: 0.30,
};

export const SKOR_PRESENSI: { [key: string]: number } = {
  "Hadir": 100,
  "Izin": 50,
  "Sakit": 50,
  "Alfa": 0
};

export const hitungRataRataLaporan = (laporan: Record<string, number | null | undefined>) => {
  if (!laporan) return 0;
  const nilai = [laporan.bab1, laporan.bab2, laporan.bab3, laporan.bab4, laporan.bab5];
  const total = nilai.reduce((acc, curr) => acc + (curr || 0), 0);
  return total / 5;
};

export const hitungNilaiPekan = (dataPekan: Record<string, unknown>, parameters?: Array<{ nama: string; tipe: string; bobot: string; max_nilai: number }>) => {
  if (parameters && parameters.length > 0) {
    let total = 0;
    for (const param of parameters) {
      const nilaiParam = dataPekan?.[param.nama];
      if (param.tipe === 'presensi') {
        const skor = SKOR_PRESENSI[nilaiParam] ?? 0;
        total += skor * parseFloat(param.bobot);
      } else {
        const nilaiNumeric = typeof nilaiParam === 'number' ? nilaiParam : (parseFloat(nilaiParam) || 0);
        const normalized = param.max_nilai > 0 ? (nilaiNumeric / param.max_nilai) * 100 : 0;
        total += normalized * parseFloat(param.bobot);
      }
    }
    return parseFloat(total.toFixed(2));
  }

  if (!dataPekan || typeof dataPekan !== 'object') return 0;

  const skorHadir = SKOR_PRESENSI[dataPekan.hadir] || 0;
  const skorLap = dataPekan.lapangan || 0;
  const skorKuis = dataPekan.kuis || 0;
  const rataLaporan = hitungRataRataLaporan(dataPekan.laporan);

  const total =
    (skorHadir * DEFAULT_BOBOT_PENILAIAN.kehadiran) +
    (skorLap * DEFAULT_BOBOT_PENILAIAN.lapangan) +
    (skorKuis * DEFAULT_BOBOT_PENILAIAN.kuis) +
    (rataLaporan * DEFAULT_BOBOT_PENILAIAN.laporan);

  return parseFloat(total.toFixed(2));
};
