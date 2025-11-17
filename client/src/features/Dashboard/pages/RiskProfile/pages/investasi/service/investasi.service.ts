import axios from 'axios';

const API_URL_INVESTASI = 'http://localhost:5530/api/v1/investasi';

export interface Investasi {
  id_investasi: number;
  no: number;
  parameter: string;
  bobot: number;
  no_indikator: string;
  indikator: string;
  bobot_indikator: number;
  sumber_resiko: string;
  dampak: string;
  low: string;
  low_to_moderate: string;
  moderate: string;
  moderate_to_high: string;
  high: string;
  hasil: number | null;
  peringkat: number | null;
  weighted: number | null;
  keterangan: string | null;
  total_pembilang: number | null;
  total_penyebut: number | null;
  nama_pembilang: string | null;
  nama_penyebut: string | null;
  pereview_hasil: number | null;
}

export interface CreateInvestasiDto extends Omit<Investasi, 'id_investasi'> {}

export interface UpdateInvestasiDto extends Partial<CreateInvestasiDto> {}

// ====================================
//  SERVICE
// ====================================
export const InvestasiService = {
  async getAllInvestasi(filter?: { year?: number; quarter?: string; query?: string; parameter_no?: number }) {
    try {
      const params = new URLSearchParams();

      if (filter?.year) params.append('year', String(filter.year));
      if (filter?.quarter) params.append('quarter', String(filter.quarter));
      if (filter?.query) params.append('query', filter.query);
      if (filter?.parameter_no) params.append('parameter_no', String(filter.parameter_no));

      const url = `${API_URL_INVESTASI}?${params.toString()}`;
      console.log('Fetch URL:', url);

      const res = await axios.get<Investasi[]>(url);
      return res.data;
    } catch (error) {
      console.error('Error fetching investasi:', error);
      throw error;
    }
  },

  async getById(id: number) {
    try {
      const res = await axios.get<Investasi>(`${API_URL_INVESTASI}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching investasi by id:', error);
      throw error;
    }
  },

  async getInvestasiByPeriod(quarter: number, year: number) {
    try {
      const res = await axios.get<Investasi[]>(`${API_URL_INVESTASI}/periode/${year}/${quarter}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching investasi by period:', error);
      throw error;
    }
  },

  async createInvestasi(data: CreateInvestasiDto) {
  try {
    console.log('Creating investasi with data:', JSON.stringify(data, null, 2));

    const res = await axios.post<Investasi>(API_URL_INVESTASI, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Create response success:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Error creating investasi:', error);

    if (error.response) {
      console.error('=== SERVER ERROR DETAILS ===');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', error.response.data);
      
      if (error.response.data && typeof error.response.data === 'object') {
        console.error('Error object structure:', {
          keys: Object.keys(error.response.data),
          hasMessage: !!error.response.data.message,
          messageType: typeof error.response.data.message,
          isMessageArray: Array.isArray(error.response.data.message)
        });
        
        if (Array.isArray(error.response.data.message)) {
          console.error('Validation errors detail:');
          error.response.data.message.forEach((errObj: any, index: number) => {
            console.error(`Error ${index + 1}:`, {
              property: errObj.property,
              value: errObj.value,
              constraints: errObj.constraints
            });
          });
        }
      }
      console.error('=== END SERVER ERROR DETAILS ===');
    }

    throw error;
  }
},

  async updateInvestasi(id: number, data: UpdateInvestasiDto) {
    try {
      console.log('Updating investasi:', id, data);
      const res = await axios.patch<Investasi>(`${API_URL_INVESTASI}/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error updating investasi:', error);
      throw error;
    }
  },

  async removeInvestasi(id: number) {
    try {
      const res = await axios.delete(`${API_URL_INVESTASI}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting investasi:', error);
      throw error;
    }
  },
};
