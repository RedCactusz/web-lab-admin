import { supabase } from "@/lib/supabase";

export const studentService = {
  /**
   * Mencari mahasiswa berdasarkan NIM di tabel praktikum tertentu
   */
  searchStudentByNim: async (praktikum: string, nim: string) => {
    const { data, error } = await supabase
      .from(praktikum)
      .select('*')
      .eq('nim', nim)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mengambil statistik sederhana mahasiswa
   */
  getStudentStats: async (praktikum: string) => {
    const { count, error } = await supabase
      .from(praktikum)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }
};
