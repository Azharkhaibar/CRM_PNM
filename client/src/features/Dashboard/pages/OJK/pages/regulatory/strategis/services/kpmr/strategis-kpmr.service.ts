import api_strategis_produk from '../strategis-api.service';

// ========== DTO Interfaces ==========
export interface KpmrSkorDto {
  Q1?: number;
  Q2?: number;
  Q3?: number;
  Q4?: number;
}

export interface KpmrIndicatorDto {
  strong?: string;
  satisfactory?: string;
  fair?: string;
  marginal?: string;
  unsatisfactory?: string;
}

// ========== CREATE DTOs ==========
export interface CreateKpmrStrategisOjkDto {
  year: number;
  quarter: number;
  isActive?: boolean;
  createdBy?: string;
  version?: string;
  notes?: string;
  summary?: any;
  aspekList?: CreateKpmrAspekStrategisDto[];
}

export interface CreateKpmrAspekStrategisDto {
  nomor?: string;
  judul: string;
  bobot: number;
  deskripsi?: string;
  kpmrOjkId?: number;
  orderIndex?: number;
  pertanyaanList?: CreateKpmrPertanyaanStrategisDto[];
}

export interface CreateKpmrPertanyaanStrategisDto {
  nomor?: string;
  pertanyaan: string;
  skor?: KpmrSkorDto;
  indicator?: KpmrIndicatorDto;
  evidence?: string;
  catatan?: string;
  aspekId?: number;
  orderIndex?: number;
}

// ========== UPDATE DTOs ==========
export interface UpdateKpmrAspekStrategisDto {
  nomor?: string;
  judul?: string;
  bobot?: number;
  deskripsi?: string;
  orderIndex?: number;
  updatedBy?: string;
  notes?: string;
}

export interface UpdateKpmrPertanyaanStrategisDto {
  nomor?: string;
  pertanyaan?: string;
  skor?: KpmrSkorDto;
  indicator?: KpmrIndicatorDto;
  evidence?: string;
  catatan?: string;
  orderIndex?: number;
}

// ========== SKOR DTO ==========
export interface UpdateSkorDto {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  skor: number;
  updatedBy?: string;
}

// ========== RESPONSE INTERFACES ==========
export interface BackendKpmrResponse {
  id: number;
  year: number;
  quarter: number;
  isActive?: boolean;
  isLocked?: boolean;
  version?: string;
  notes?: string;
  summary?: any;
  aspekList?: BackendAspekResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BackendAspekResponse {
  id: number;
  nomor?: string;
  judul: string;
  bobot: number;
  deskripsi?: string;
  orderIndex?: number;
  averageScore?: number;
  rating?: string;
  kpmrStrategisId: number;
  pertanyaanList?: BackendPertanyaanResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BackendPertanyaanResponse {
  id: number;
  nomor?: string;
  pertanyaan: string;
  skor?: {
    Q1?: number;
    Q2?: number;
    Q3?: number;
    Q4?: number;
  };
  indicator?: {
    strong?: string;
    satisfactory?: string;
    fair?: string;
    marginal?: string;
    unsatisfactory?: string;
  };
  evidence?: string;
  catatan?: string;
  aspekId: number;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FrontendKpmrResponse {
  id: string;
  year: number;
  quarter: number;
  isActive?: boolean;
  isLocked?: boolean;
  version?: string;
  notes?: string;
  summary?: any;
  aspekList?: FrontendAspekResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FrontendAspekResponse {
  id: string;
  nomor?: string;
  judul: string;
  bobot: string;
  deskripsi?: string;
  orderIndex?: number;
  averageScore?: number;
  rating?: string;
  pertanyaanList?: FrontendPertanyaanResponse[];
}

export interface FrontendPertanyaanResponse {
  id: string;
  nomor?: string;
  pertanyaan: string;
  skor?: {
    Q1?: number;
    Q2?: number;
    Q3?: number;
    Q4?: number;
  };
  indicator?: {
    strong: string;
    satisfactory: string;
    fair: string;
    marginal: string;
    unsatisfactory: string;
  };
  evidence?: string;
  catatan?: string;
  orderIndex?: number;
}

// ========== SERVICE CLASS ==========
class KpmrStrategisApiService {
  private readonly BASE_PATH = '/kpmr-strategis';
  private readonly VALID_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
  private readonly MIN_YEAR = 2000;
  private readonly MAX_YEAR = 2100;
  private readonly MIN_BOBOT = 0;
  private readonly MAX_BOBOT = 100;
  private readonly MIN_SKOR = 1;
  private readonly MAX_SKOR = 5;

  // ========== UTILITY METHODS ==========

  cleanId(id: string | number): number {
    if (typeof id === 'number') return id;
    const clean = id.replace(/^(temp-|fallback-|new-)/, '');
    const parsed = parseInt(clean, 10);
    if (isNaN(parsed) || parsed <= 0) {
      throw new Error(`Format ID tidak valid: ${id}`);
    }
    return parsed;
  }

  private normalizeNumber(value: any): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  private validateYear(year: any): number {
    const yearNum = this.normalizeNumber(year);
    if (yearNum === undefined || yearNum < this.MIN_YEAR || yearNum > this.MAX_YEAR) {
      throw new Error(`Tahun harus antara ${this.MIN_YEAR} dan ${this.MAX_YEAR}`);
    }
    return yearNum;
  }

  private validateQuarter(quarter: any): number {
    const quarterNum = this.normalizeNumber(quarter);
    if (quarterNum === undefined || quarterNum < 1 || quarterNum > 4) {
      throw new Error('Quarter harus antara 1 dan 4');
    }
    return quarterNum;
  }

  private formatQuarter(quarter: string | number): string {
    if (typeof quarter === 'string') {
      const upper = quarter.toUpperCase();
      if (this.VALID_QUARTERS.includes(upper as any)) return upper;
      const num = parseInt(quarter);
      if (!isNaN(num) && num >= 1 && num <= 4) return `Q${num}`;
    }
    if (typeof quarter === 'number' && quarter >= 1 && quarter <= 4) return `Q${quarter}`;
    return this.getCurrentQuarter();
  }

  private validateSkor(skor: any): number {
    const skorNum = this.normalizeNumber(skor);
    if (skorNum === undefined || skorNum < this.MIN_SKOR || skorNum > this.MAX_SKOR) {
      throw new Error(`Skor harus antara ${this.MIN_SKOR} dan ${this.MAX_SKOR}`);
    }
    return skorNum;
  }

  private validateBobot(bobot: any): number {
    const bobotNum = this.normalizeNumber(bobot);
    if (bobotNum === undefined || bobotNum < this.MIN_BOBOT || bobotNum > this.MAX_BOBOT) {
      throw new Error(`Bobot harus antara ${this.MIN_BOBOT} dan ${this.MAX_BOBOT}`);
    }
    return bobotNum;
  }

  private handleApiError(error: any, defaultMessage: string): never {
    console.error(`❌ [KPMR Strategis Service] Error:`, error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Tidak dapat terhubung ke server.');
    }
    if (error.response) {
      const message = error.response.data?.message || defaultMessage;
      if (error.response.status === 404) throw new Error(message || 'Data tidak ditemukan.');
      if (error.response.status === 400) throw new Error(`Data tidak valid: ${message}`);
      throw new Error(message);
    }
    throw new Error(defaultMessage);
  }

  // ========== FORMAT CONVERSION ==========

  /**
   * Konversi dari backend response ke frontend format
   */
  private convertBackendToFrontend(kpmr: BackendKpmrResponse): FrontendKpmrResponse {
    return {
      id: kpmr.id?.toString() || crypto.randomUUID(),
      year: kpmr.year,
      quarter: kpmr.quarter,
      isActive: kpmr.isActive,
      isLocked: kpmr.isLocked,
      version: kpmr.version,
      notes: kpmr.notes,
      summary: kpmr.summary,
      createdAt: kpmr.createdAt,
      updatedAt: kpmr.updatedAt,
      aspekList: (kpmr.aspekList || []).map((aspek) => ({
        id: aspek.id?.toString() || crypto.randomUUID(),
        nomor: aspek.nomor || '',
        judul: aspek.judul || '',
        bobot: aspek.bobot?.toString() || '0',
        deskripsi: aspek.deskripsi || '',
        orderIndex: aspek.orderIndex || 0,
        averageScore: aspek.averageScore,
        rating: aspek.rating,
        pertanyaanList: (aspek.pertanyaanList || []).map((pertanyaan) => ({
          id: pertanyaan.id?.toString() || crypto.randomUUID(),
          nomor: pertanyaan.nomor || '',
          pertanyaan: pertanyaan.pertanyaan || '',
          skor: {
            Q1: pertanyaan.skor?.Q1 ?? undefined,
            Q2: pertanyaan.skor?.Q2 ?? undefined,
            Q3: pertanyaan.skor?.Q3 ?? undefined,
            Q4: pertanyaan.skor?.Q4 ?? undefined,
          },
          indicator: {
            strong: pertanyaan.indicator?.strong || '',
            satisfactory: pertanyaan.indicator?.satisfactory || '',
            fair: pertanyaan.indicator?.fair || '',
            marginal: pertanyaan.indicator?.marginal || '',
            unsatisfactory: pertanyaan.indicator?.unsatisfactory || '',
          },
          evidence: pertanyaan.evidence || '',
          catatan: pertanyaan.catatan || '',
          orderIndex: pertanyaan.orderIndex || 0,
        })),
      })),
    };
  }

  convertToFrontendFormat(kpmr: FrontendKpmrResponse): FrontendAspekResponse[] {
    if (!kpmr || !kpmr.aspekList || !Array.isArray(kpmr.aspekList)) return [];
    return kpmr.aspekList.map((aspek) => ({
      id: aspek.id?.toString() || crypto.randomUUID(),
      nomor: aspek.nomor || '',
      judul: aspek.judul || '',
      bobot: aspek.bobot?.toString() || '0',
      deskripsi: aspek.deskripsi || '',
      orderIndex: aspek.orderIndex || 0,
      averageScore: aspek.averageScore,
      rating: aspek.rating,
      pertanyaanList: (aspek.pertanyaanList || []).map((pertanyaan) => ({
        id: pertanyaan.id?.toString() || crypto.randomUUID(),
        nomor: pertanyaan.nomor || '',
        pertanyaan: pertanyaan.pertanyaan || '',
        skor: {
          Q1: pertanyaan.skor?.Q1 ?? undefined,
          Q2: pertanyaan.skor?.Q2 ?? undefined,
          Q3: pertanyaan.skor?.Q3 ?? undefined,
          Q4: pertanyaan.skor?.Q4 ?? undefined,
        },
        indicator: {
          strong: pertanyaan.indicator?.strong || '',
          satisfactory: pertanyaan.indicator?.satisfactory || '',
          fair: pertanyaan.indicator?.fair || '',
          marginal: pertanyaan.indicator?.marginal || '',
          unsatisfactory: pertanyaan.indicator?.unsatisfactory || '',
        },
        evidence: pertanyaan.evidence || '',
        catatan: pertanyaan.catatan || '',
        orderIndex: pertanyaan.orderIndex || 0,
      })),
    }));
  }

  // ========== QUARTER UTILITY ==========

  getCurrentQuarter(): string {
    const date = new Date();
    const month = date.getMonth() + 1;
    if (month >= 1 && month <= 3) return 'Q1';
    if (month >= 4 && month <= 6) return 'Q2';
    if (month >= 7 && month <= 9) return 'Q3';
    return 'Q4';
  }

  // ========== KPMR OPERATIONS ==========

  /**
   * ✅ PERBAIKAN: Get KPMR by year and quarter menggunakan query params
   */
  async getKpmrByYearQuarter(year: number, quarter: number, withRelations: boolean = true): Promise<FrontendKpmrResponse> {
    try {
      // ✅ BENAR: Gunakan query params, bukan path params
      const url = `${this.BASE_PATH}?year=${year}&quarter=${quarter}&withRelations=${withRelations}`;

      console.log(`📡 [Service] GET ${url}`);

      const response = await api_strategis_produk.get<any>(url);

      // Handle response yang mungkin berbeda
      let data = response.data;

      // Jika response.data adalah array, ambil yang pertama
      if (Array.isArray(data)) {
        data = data.length > 0 ? data[0] : null;
      }

      if (!data) {
        throw new Error(`KPMR untuk tahun ${year} quarter ${quarter} tidak ditemukan`);
      }

      // Convert ke frontend format
      return this.convertBackendToFrontend(data);
    } catch (error: any) {
      console.error('❌ [Service] Error getting KPMR by year/quarter:', {
        year,
        quarter,
        status: error.response?.status,
        message: error.message,
      });

      // Handle 404 dengan pesan yang lebih jelas
      if (error.response?.status === 404) {
        throw new Error(`KPMR untuk tahun ${year} quarter ${quarter} tidak ditemukan`);
      }

      throw error;
    }
  }

  /**
   * ✅ PERBAIKAN: Get KPMR with relations menggunakan ID
   */
  async getKpmrWithRelations(id: number): Promise<FrontendKpmrResponse> {
    try {
      // ✅ BENAR: ID di path params
      const url = `${this.BASE_PATH}/${id}?withRelations=true`;

      console.log(`📡 [Service] GET ${url}`);

      const response = await api_strategis_produk.get<any>(url);

      if (!response.data) {
        throw new Error(`KPMR dengan ID ${id} tidak ditemukan`);
      }

      return this.convertBackendToFrontend(response.data);
    } catch (error: any) {
      console.error('❌ [Service] Error getting KPMR with relations:', error);
      throw error;
    }
  }

  /**
   * ✅ PERBAIKAN: Get all KPMR (opsional filter by year/quarter)
   */
  async getAllKpmr(year?: number, quarter?: number): Promise<FrontendKpmrResponse[]> {
    try {
      let url = this.BASE_PATH;
      const params = new URLSearchParams();

      if (year) params.append('year', year.toString());
      if (quarter) params.append('quarter', quarter.toString());

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log(`📡 [Service] GET ${url}`);

      const response = await api_strategis_produk.get<any>(url);

      const data = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);

      return data.map((item) => this.convertBackendToFrontend(item));
    } catch (error: any) {
      console.error('❌ [Service] Error getting all KPMR:', error);
      throw error;
    }
  }

  // ========== CREATE KPMR ==========

  async createKpmr(data: CreateKpmrStrategisOjkDto): Promise<FrontendKpmrResponse> {
    try {
      console.log(`🆕 [KPMR Strategis Service] Creating KPMR:`, data);

      // ✅ Validasi
      if (!data.year || data.year < this.MIN_YEAR || data.year > this.MAX_YEAR) {
        throw new Error(`Tahun tidak valid: ${data.year}`);
      }

      if (!data.quarter || data.quarter < 1 || data.quarter > 4) {
        throw new Error(`Quarter tidak valid: ${data.quarter}`);
      }

      // ✅ KIRIM SEBAGAI NUMBER (1,2,3,4)
      const payload = {
        ...data,
        quarter: Number(data.quarter), // Pastikan number
      };

      console.log('📦 [KPMR Strategis Service] Sending payload:', payload);

      const response = await api_strategis_produk.post(this.BASE_PATH, payload);

      if (!response || !response.data) {
        throw new Error('Response dari server tidak valid');
      }

      console.log('✅ [KPMR Strategis Service] Response:', response.data);
      return this.convertBackendToFrontend(response.data);
    } catch (error: any) {
      console.error('❌ [KPMR Strategis Service] Create error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // ========== ASPEK OPERATIONS ==========

  async createAspek(kpmrId: number | string, data: CreateKpmrAspekStrategisDto): Promise<FrontendAspekResponse> {
    try {
      const cleanKpmrId = this.cleanId(kpmrId);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/${cleanKpmrId}/aspek`;

      const payload = {
        nomor: data.nomor || '-',
        judul: data.judul.trim(),
        bobot: this.validateBobot(data.bobot),
        deskripsi: data.deskripsi || '',
        orderIndex: data.orderIndex || 0,
        pertanyaanList: data.pertanyaanList || [],
      };

      console.log(`📡 [Service] POST ${url}`, payload);

      const response = await api_strategis_produk.post(url, payload);

      // Konversi response ke frontend format
      return {
        id: response.data.id?.toString() || crypto.randomUUID(),
        nomor: response.data.nomor || '',
        judul: response.data.judul || '',
        bobot: response.data.bobot?.toString() || '0',
        deskripsi: response.data.deskripsi || '',
        orderIndex: response.data.orderIndex || 0,
        averageScore: response.data.averageScore,
        rating: response.data.rating,
        pertanyaanList: [],
      };
    } catch (error: any) {
      return this.handleApiError(error, `Gagal membuat aspek`);
    }
  }

  async updateAspek(id: number | string, data: UpdateKpmrAspekStrategisDto): Promise<FrontendAspekResponse> {
    try {
      const cleanId = this.cleanId(id);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/aspek/${cleanId}`;

      console.log(`📡 [Service] PATCH ${url}`, data);

      const response = await api_strategis_produk.patch(url, data);

      return {
        id: response.data.id?.toString() || crypto.randomUUID(),
        nomor: response.data.nomor || '',
        judul: response.data.judul || '',
        bobot: response.data.bobot?.toString() || '0',
        deskripsi: response.data.deskripsi || '',
        orderIndex: response.data.orderIndex || 0,
        averageScore: response.data.averageScore,
        rating: response.data.rating,
        pertanyaanList: [],
      };
    } catch (error: any) {
      return this.handleApiError(error, `Gagal mengupdate aspek`);
    }
  }

  async deleteAspek(id: number | string): Promise<void> {
    try {
      const cleanId = this.cleanId(id);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/aspek/${cleanId}`;

      console.log(`📡 [Service] DELETE ${url}`);

      await api_strategis_produk.delete(url);
    } catch (error: any) {
      return this.handleApiError(error, `Gagal menghapus aspek`);
    }
  }

  // ========== PERTANYAAN OPERATIONS ==========

  async createPertanyaan(aspekId: number | string, data: CreateKpmrPertanyaanStrategisDto): Promise<FrontendPertanyaanResponse> {
    try {
      const cleanAspekId = this.cleanId(aspekId);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/aspek/${cleanAspekId}/pertanyaan`;

      const payload: CreateKpmrPertanyaanStrategisDto = {
        nomor: data.nomor || '',
        pertanyaan: data.pertanyaan.trim(),
        skor: data.skor || {},
        indicator: {
          strong: data.indicator?.strong || '',
          satisfactory: data.indicator?.satisfactory || '',
          fair: data.indicator?.fair || '',
          marginal: data.indicator?.marginal || '',
          unsatisfactory: data.indicator?.unsatisfactory || '',
        },
        evidence: data.evidence || '',
        catatan: data.catatan || '',
        orderIndex: data.orderIndex || 0,
      };

      // Konversi skor ke number
      if (payload.skor) {
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter) => {
          const skor = payload.skor?.[quarter as keyof typeof payload.skor];
          if (skor !== undefined && skor !== null && skor !== '') {
            const numSkor = Number(skor);
            if (!isNaN(numSkor)) {
              payload.skor[quarter as keyof typeof payload.skor] = numSkor;
            }
          }
        });
      }

      console.log(`📡 [Service] POST ${url}`, payload);

      const response = await api_strategis_produk.post(url, payload);

      return {
        id: response.data.id?.toString() || crypto.randomUUID(),
        nomor: response.data.nomor || '',
        pertanyaan: response.data.pertanyaan || '',
        skor: response.data.skor || {},
        indicator: {
          strong: response.data.indicator?.strong || '',
          satisfactory: response.data.indicator?.satisfactory || '',
          fair: response.data.indicator?.fair || '',
          marginal: response.data.indicator?.marginal || '',
          unsatisfactory: response.data.indicator?.unsatisfactory || '',
        },
        evidence: response.data.evidence || '',
        catatan: response.data.catatan || '',
        orderIndex: response.data.orderIndex || 0,
      };
    } catch (error: any) {
      return this.handleApiError(error, `Gagal membuat pertanyaan`);
    }
  }

  async updatePertanyaan(id: number | string, data: UpdateKpmrPertanyaanStrategisDto): Promise<FrontendPertanyaanResponse> {
    try {
      const cleanId = this.cleanId(id);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/pertanyaan/${cleanId}`;

      // Buat payload dengan struktur yang benar
      const payload: any = {};

      if (data.nomor !== undefined) payload.nomor = data.nomor;
      if (data.pertanyaan !== undefined) payload.pertanyaan = data.pertanyaan;
      if (data.evidence !== undefined) payload.evidence = data.evidence;
      if (data.catatan !== undefined) payload.catatan = data.catatan;
      if (data.orderIndex !== undefined) payload.orderIndex = data.orderIndex;

      if (data.skor) {
        payload.skor = {};
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter) => {
          const skorValue = data.skor?.[quarter as keyof typeof data.skor];
          if (skorValue !== undefined && skorValue !== null && skorValue !== '') {
            const numSkor = Number(skorValue);
            if (!isNaN(numSkor)) {
              payload.skor[quarter] = numSkor;
            }
          } else {
            payload.skor[quarter] = null;
          }
        });
      }

      if (data.indicator) {
        payload.indicator = {
          strong: data.indicator.strong || '',
          satisfactory: data.indicator.satisfactory || '',
          fair: data.indicator.fair || '',
          marginal: data.indicator.marginal || '',
          unsatisfactory: data.indicator.unsatisfactory || '',
        };
      }

      console.log(`📡 [Service] PATCH ${url}`, payload);

      const response = await api_strategis_produk.patch(url, payload);

      return {
        id: response.data.id?.toString() || crypto.randomUUID(),
        nomor: response.data.nomor || '',
        pertanyaan: response.data.pertanyaan || '',
        skor: response.data.skor || {},
        indicator: {
          strong: response.data.indicator?.strong || '',
          satisfactory: response.data.indicator?.satisfactory || '',
          fair: response.data.indicator?.fair || '',
          marginal: response.data.indicator?.marginal || '',
          unsatisfactory: response.data.indicator?.unsatisfactory || '',
        },
        evidence: response.data.evidence || '',
        catatan: response.data.catatan || '',
        orderIndex: response.data.orderIndex || 0,
      };
    } catch (error: any) {
      return this.handleApiError(error, `Gagal mengupdate pertanyaan`);
    }
  }

  async deletePertanyaan(id: number | string): Promise<void> {
    try {
      const cleanId = this.cleanId(id);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/pertanyaan/${cleanId}`;

      console.log(`📡 [Service] DELETE ${url}`);

      await api_strategis_produk.delete(url);
    } catch (error: any) {
      return this.handleApiError(error, `Gagal menghapus pertanyaan`);
    }
  }

  async updateSkor(id: number | string, data: UpdateSkorDto): Promise<FrontendPertanyaanResponse> {
    try {
      const cleanId = this.cleanId(id);

      // ✅ PERBAIKAN: Gunakan endpoint yang benar
      const url = `${this.BASE_PATH}/pertanyaan/${cleanId}/skor`;

      if (!data.quarter || !this.VALID_QUARTERS.includes(data.quarter)) {
        throw new Error('Quarter tidak valid. Harus Q1, Q2, Q3, atau Q4');
      }
      if (data.skor < this.MIN_SKOR || data.skor > this.MAX_SKOR) {
        throw new Error(`Skor harus antara ${this.MIN_SKOR} dan ${this.MAX_SKOR}`);
      }

      console.log(`📡 [Service] PATCH ${url}`, data);

      const response = await api_strategis_produk.patch(url, data);

      return {
        id: response.data.id?.toString() || crypto.randomUUID(),
        nomor: response.data.nomor || '',
        pertanyaan: response.data.pertanyaan || '',
        skor: response.data.skor || {},
        indicator: {
          strong: response.data.indicator?.strong || '',
          satisfactory: response.data.indicator?.satisfactory || '',
          fair: response.data.indicator?.fair || '',
          marginal: response.data.indicator?.marginal || '',
          unsatisfactory: response.data.indicator?.unsatisfactory || '',
        },
        evidence: response.data.evidence || '',
        catatan: response.data.catatan || '',
        orderIndex: response.data.orderIndex || 0,
      };
    } catch (error: any) {
      return this.handleApiError(error, `Gagal mengupdate skor`);
    }
  }
}

export const kpmrStrategisApiService = new KpmrStrategisApiService();
export default kpmrStrategisApiService;


