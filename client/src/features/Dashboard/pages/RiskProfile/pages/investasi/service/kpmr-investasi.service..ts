// src/services/kpmrInvestasiService.ts
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-url.com/api/v1/kpmr-investasi' : 'http://localhost:5530/api/v1/kpmr-investasi';

export interface KpmrInvestasi {
  id_kpmr_investasi: number;
  year: number;
  quarter: string;
  aspek_no: string;
  aspek_title: string;
  section_title: string;
  tata_kelola_resiko: string;
  evidence: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateKpmrInvestasiDto extends Omit<KpmrInvestasi, 'id_kpmr_investasi'> {}
export interface UpdateKpmrInvestasiDto extends Partial<CreateKpmrInvestasiDto> {}

export const kpmrInvestasiService = {
  async getAll(filters?: { year?: number; quarter?: string; aspek_no?: string; query?: string }) {
    const params = new URLSearchParams();

    if (filters?.year) params.append('year', String(filters.year));
    if (filters?.quarter) params.append('quarter', filters.quarter);
    if (filters?.aspek_no) params.append('aspek_no', filters.aspek_no);
    if (filters?.query) params.append('query', filters.query);

    const res = await axios.get<KpmrInvestasi[]>(`${API_URL}?${params.toString()}`);
    return res.data;
  },

  async getById(id: number) {
    const res = await axios.get<KpmrInvestasi>(`${API_URL}/${id}`);
    return res.data;
  },

  async getByPeriod(year: number, quarter: string) {
    const res = await axios.get<KpmrInvestasi[]>(`${API_URL}/period/${year}/${quarter}`);
    return res.data;
  },

  async create(data: CreateKpmrInvestasiDto) {
    const res = await axios.post<KpmrInvestasi>(API_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateKpmrInvestasiDto) {
    const res = await axios.patch<KpmrInvestasi>(`${API_URL}/${id}`, data);
    return res.data;
  },

  async remove(id: number) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
