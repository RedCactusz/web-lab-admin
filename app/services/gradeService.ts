import { supabase } from "@/lib/supabase";

export const gradeService = {
  /**
   * Mengambil daftar mahasiswa berdasarkan praktikum dan daftar plug
   * @param praktikum Nama tabel praktikum (misal: 'sutris1' atau 'hidro')
   * @param plugs Array nomor plug
   */
  getStudentsByPlugs: async (praktikum: string, plugs: number[]) => {
    const { data, error } = await supabase
      .from(praktikum)
      .select('*')
      .in('plug', plugs)
      .order('nim', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Mengambil daftar mahasiswa berdasarkan praktikum dan plug
   * @param praktikum Nama tabel praktikum (misal: 'sutris1' atau 'hidro')
   * @param plug Nomor plug
   */
  getStudentsByPlug: async (praktikum: string, plug: number) => {
    const { data, error } = await supabase
      .from(praktikum)
      .select('*')
      .eq('plug', plug)
      .order('kelompok', { ascending: true })
      .order('nim', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Mengupdate nilai mahasiswa menggunakan RPC (Remote Procedure Call)
   * @param payload Objek berisi detail nilai
   */
  updateStudentGrade: async (payload: {
    p_nim: string;
    p_pekan: number;
    p_hadir_status: string;
    p_lapangan: number;
    p_kuis: number;
    p_bab1: number;
    p_bab2: number;
    p_bab3: number;
    p_bab4: number;
    p_bab5: number;
  }) => {
    const { error } = await supabase.rpc('update_nilai_mahasiswa', payload);
    if (error) throw error;
    return true;
  },

  /**
   * Mengambil seluruh data praktikan untuk satu praktikum (untuk Rekap)
   */
  getAllStudents: async (praktikum: string) => {
    const { data, error } = await supabase
      .from(praktikum)
      .select('*')
      .order('nim', { ascending: true });

    if (error) throw error;
    return data;
  }
};
