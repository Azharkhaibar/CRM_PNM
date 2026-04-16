// services/hukum.service.ts
import api_hukum from '../hukum-api.service';

// =============================================
// TYPES BERDASARKAN BACKEND ENTITY
// =============================================

export interface HukumEntity {
  id: number;
  year: number;
  quarter: number;
  isActive: boolean;
  parameters?: ParameterEntity[];
  summary?: {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
  };
  isLocked?: boolean;
  lockedAt?: Date | null;
  lockedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  version?: string;
  notes?: string;
}

export interface ParameterEntity {
  id: number;
  nomor?: string;
  judul: string;
  bobot: number;
  kategori?: {
    model?: string;
    prinsip?: string;
    jenis?: string;
    underlying?: string[];
  };
  nilaiList?: NilaiEntity[];
  orderIndex: number;
  hukumId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NilaiEntity {
  id: number;
  nomor?: string;
  judul: {
    type?: string;
    text?: string;
    value?: string | number | null;
    pembilang?: string;
    valuePembilang?: string | number | null;
    penyebut?: string;
    valuePenyebut?: string | number | null;
    formula?: string;
    percent?: boolean;
  };
  bobot: number;
  portofolio?: string;
  keterangan?: string;
  riskindikator?: {
    low?: string;
    lowToModerate?: string;
    moderate?: string;
    moderateToHigh?: string;
    high?: string;
  };
  parameterId: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================
// DTOs UNTUK CREATE/UPDATE (SESUAI BACKEND)
// =============================================

export interface CreateHukumDto {
  year: number;
  quarter: number;
  isActive?: boolean;
  createdBy?: string;
  version?: string;
}

export interface UpdateHukumDto {
  year?: number;
  quarter?: number;
  isActive?: boolean;
  summary?: {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
  };
  isLocked?: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  notes?: string;
  updatedBy?: string;
}

export interface CreateParameterDto {
  nomor?: string;
  judul: string;
  bobot: number;
  kategori?: {
    model?: string;
    prinsip?: string;
    jenis?: string;
    underlying?: string[];
  };
  orderIndex?: number;
}

export interface UpdateParameterDto {
  nomor?: string;
  judul?: string;
  bobot?: number;
  kategori?: {
    model?: string;
    prinsip?: string;
    jenis?: string;
    underlying?: string[];
  };
  orderIndex?: number;
}

export interface CreateNilaiDto {
  nomor?: string;
  judul: {
    type?: string;
    text?: string;
    value?: string | number | null;
    pembilang?: string;
    valuePembilang?: string | number | null;
    penyebut?: string;
    valuePenyebut?: string | number | null;
    formula?: string;
    percent?: boolean;
  };
  bobot: number;
  portofolio?: string;
  keterangan?: string;
  riskindikator?: {
    low?: string;
    lowToModerate?: string;
    moderate?: string;
    moderateToHigh?: string;
    high?: string;
  };
  orderIndex?: number;
}

export interface UpdateNilaiDto {
  nomor?: string;
  judul?: {
    type?: string;
    text?: string;
    value?: string | number | null;
    pembilang?: string;
    valuePembilang?: string | number | null;
    penyebut?: string;
    valuePenyebut?: string | number | null;
    formula?: string;
    percent?: boolean;
  };
  bobot?: number;
  portofolio?: string;
  keterangan?: string;
  riskindikator?: {
    low?: string;
    lowToModerate?: string;
    moderate?: string;
    moderateToHigh?: string;
    high?: string;
  };
  orderIndex?: number;
}

// =============================================
// REFERENCE TYPES
// =============================================

export interface ReferenceItem {
  id: number;
  type: string;
  key: string;
  label: string;
  color?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================
// MAIN SERVICE CLASS
// =============================================

export class HukumService {
  // PERBAIKAN: Sesuaikan dengan endpoint backend (lihat controller menggunakan '/kpmr-hukum')
  private baseUrl = '/kpmr-hukum';

  // =============================================
  // FIND OR CREATE - PERBAIKAN DENGAN LOGGING DETAIL
  // =============================================

  async findOrCreate(
    year: number,
    quarter: number,
  ): Promise<{
    success: boolean;
    data: HukumEntity | null;
    isNew: boolean;
    message: string;
  }> {
    console.log(`[Service] findOrCreate: ${year}-Q${quarter}`);

    try {
      // 1. Cari data yang sudah ada
      console.log(`[Service] Mencari data untuk ${year}-Q${quarter}...`);
      const existingData = await this.findByYearQuarter(year, quarter);

      if (existingData) {
        console.log(`[Service] Data ditemukan, ID: ${existingData.id}`);
        return {
          success: true,
          data: existingData,
          isNew: false,
          message: 'Data ditemukan',
        };
      }

      // 2. Jika tidak ada, buat data baru
      console.log(`[Service] Data tidak ditemukan, membuat baru untuk ${year}-Q${quarter}`);

      const createDto: CreateHukumDto = {
        year,
        quarter,
        isActive: true,
        createdBy: 'system',
        version: '1.0.0',
      };

      const newData = await this.create(createDto);

      console.log(`[Service] Data baru berhasil dibuat, ID: ${newData.id}`);

      return {
        success: true,
        data: newData,
        isNew: true,
        message: 'Data berhasil dibuat',
      };
    } catch (error: any) {
      console.error('[Service] Error dalam findOrCreate:', error);

      // Log detail error untuk debugging
      if (error.response) {
        console.error('[Service] Response error:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
        });
      }

      return {
        success: false,
        data: null,
        isNew: false,
        message: error.response?.data?.message || error.message || 'Gagal memuat atau membuat data',
      };
    }
  }

  /**
   * Method untuk memastikan data tersedia sebelum operasi
   */
  async ensureDataExists(year: number, quarter: number): Promise<HukumEntity> {
    console.log(`[Service] ensureDataExists: ${year}-Q${quarter}`);

    const result = await this.findOrCreate(year, quarter);

    if (!result.success || !result.data) {
      throw new Error(`Gagal memastikan data tersedia: ${result.message}`);
    }

    // Pastikan parameters array
    if (!Array.isArray(result.data.parameters)) {
      result.data.parameters = [];
    }

    return result.data;
  }

  /**
   * Method untuk load data dengan auto-create jika tidak ada
   */
  async loadOrCreateData(year: number, quarter: number): Promise<HukumEntity> {
    console.log(`[Service] loadOrCreateData: ${year}-Q${quarter}`);
    return this.ensureDataExists(year, quarter);
  }

  /**
   * Helper untuk format data ke frontend
   */
  private formatToFrontend(entity: HukumEntity | null): any[] {
    console.log('[Service] formatToFrontend - Input entity:', {
      entity: entity ? `ID: ${entity.id}` : null,
      hasParameters: !!entity?.parameters,
      parametersType: Array.isArray(entity?.parameters) ? 'array' : typeof entity?.parameters,
    });

    if (!entity) {
      console.log('[Service] formatToFrontend: Entity is null, returning empty array');
      return [];
    }

    // PERBAIKAN: Pastikan parameters selalu array
    const parameters = Array.isArray(entity.parameters) ? entity.parameters : [];

    console.log(`[Service] formatToFrontend: Processing ${parameters.length} parameters`);

    const result = parameters.map((param, index) => {
      // PERBAIKAN: Pastikan nilaiList selalu array
      const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

      const formattedParam = {
        id: param.id?.toString() || `temp-${Date.now()}-${index}`,
        nomor: param.nomor || '',
        judul: param.judul || '',
        bobot: param.bobot || 0,
        kategori: param.kategori || {
          model: '',
          prinsip: '',
          jenis: '',
          underlying: [],
        },
        orderIndex: param.orderIndex || index,
        // PERBAIKAN: Format nilaiList dengan safety checks
        nilaiList: nilaiList.map((nilai, idx) => ({
          id: nilai.id?.toString() || `temp-nilai-${Date.now()}-${idx}`,
          nomor: nilai.nomor || '',
          judul: nilai.judul || {
            type: 'Tanpa Faktor',
            text: '',
            value: null,
            pembilang: '',
            valuePembilang: null,
            penyebut: '',
            valuePenyebut: null,
            formula: '',
            percent: false,
          },
          bobot: nilai.bobot || 0,
          portofolio: nilai.portofolio || '',
          keterangan: nilai.keterangan || '',
          riskindikator: nilai.riskindikator || {
            low: '',
            lowToModerate: '',
            moderate: '',
            moderateToHigh: '',
            high: '',
          },
          orderIndex: nilai.orderIndex || idx,
        })),
        // Metadata dari inherent
        metadata: {
          hukumId: entity.id,
          year: entity.year,
          quarter: entity.quarter,
          isActive: entity.isActive,
          isLocked: entity.isLocked || false,
          summary: entity.summary,
        },
      };

      return formattedParam;
    });

    console.log('[Service] formatToFrontend: Final result length:', result.length);
    return result;
  }

  /**
   * Helper untuk log error
   */
  private handleError(error: any, operation: string, url?: string): never {
    const errorDetails = {
      operation,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: url || error.config?.url,
      method: error.config?.method,
    };

    console.error(`[HukumService] Error in ${operation}:`, errorDetails);

    // Throw error yang lebih informatif
    let errorMessage = `Gagal melakukan operasi ${operation}`;

    if (error.response?.status === 404) {
      errorMessage = `Endpoint tidak ditemukan: ${url}. Periksa apakah backend sudah benar.`;
    } else if (error.response?.status === 500) {
      errorMessage = `Server error: ${error.response?.data?.message || 'Internal server error'}`;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }

  /**
   * Helper untuk debug API calls
   */
  private logApiCall(method: string, url: string, params?: any, data?: any) {
    console.log(`[Service] API ${method.toUpperCase()}:`, {
      url,
      params,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // =============================================
  // CRUD UTAMA
  // =============================================

  async findActive(): Promise<HukumEntity | null> {
    const url = `${this.baseUrl}/active`;
    this.logApiCall('GET', url);

    try {
      const response = await api_hukum.get<HukumEntity>(url);

      console.log('[Service] findActive - Response:', {
        status: response.status,
        hasData: !!response.data,
        parameters: Array.isArray(response.data?.parameters) ? response.data.parameters.length : 'not array',
      });

      if (!response.data) {
        console.log('[Service] findActive: No data returned');
        return null;
      }

      // PERBAIKAN: Pastikan parameters selalu array
      if (!Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      console.log('[Service] findActive - Error:', {
        status: error.response?.status,
        message: error.message,
        url,
      });

      if (error.response?.status === 404) {
        console.log('[Service] findActive: 404 - No active data found');
        return null;
      }

      this.handleError(error, 'findActive', url);
    }
  }

  async findByYearQuarter(year: number, quarter: number): Promise<HukumEntity | null> {
    // PERBAIKAN: Sesuaikan dengan endpoint backend (lihat controller)
    // Controller menggunakan @Get(':year/:quarter') jadi endpointnya /kpmr-hukum/:year/:quarter
    const url = `${this.baseUrl}/${year}/${quarter}`;

    this.logApiCall('GET', url);

    try {
      const response = await api_hukum.get<any>(url);

      console.log('[Service] findByYearQuarter - Response:', {
        status: response.status,
        dataType: typeof response.data,
        fullUrl: url,
      });

      if (!response.data) {
        console.log('[Service] findByYearQuarter: No data returned');
        return null;
      }

      let data = response.data;

      // Pastikan parameters adalah array
      if (!Array.isArray(data.parameters)) {
        console.log('[Service] findByYearQuarter: Parameters not array, converting to empty array');
        data.parameters = [];
      }

      console.log('[Service] findByYearQuarter: Returning data with', data.parameters.length, 'parameters');
      return data;
    } catch (error: any) {
      console.log('[Service] findByYearQuarter - Error:', {
        status: error.response?.status,
        message: error.message,
        url,
      });

      if (error.response?.status === 404) {
        console.log('[Service] findByYearQuarter: 404 - Data not found');
        return null;
      }

      this.handleError(error, 'findByYearQuarter', url);
    }
  }

  async getAll(): Promise<HukumEntity[]> {
    const url = this.baseUrl;
    this.logApiCall('GET', url);

    try {
      const response = await api_hukum.get<any>(url);

      console.log('[Service] getAll - Response type:', Array.isArray(response.data) ? 'array' : typeof response.data);

      let data = response.data;

      // PERBAIKAN: Pastikan selalu return array
      if (!Array.isArray(data)) {
        console.log('[Service] getAll: Converting non-array response to array');
        data = data ? [data] : [];
      }

      // PERBAIKAN: Pastikan setiap item memiliki parameters array
      const result = data.map((item: any, index: number) => ({
        ...item,
        parameters: Array.isArray(item.parameters) ? item.parameters : [],
      }));

      console.log('[Service] getAll: Returning', result.length, 'items');
      return result;
    } catch (error: any) {
      this.handleError(error, 'getAll', url);
    }
  }

  async getById(id: number): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('GET', url);

    try {
      const response = await api_hukum.get<HukumEntity>(url);

      // PERBAIKAN: Pastikan parameters selalu array
      if (response.data && !Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      this.handleError(error, 'getById', url);
    }
  }

  async create(createDto: CreateHukumDto): Promise<HukumEntity> {
    const url = this.baseUrl;
    this.logApiCall('POST', url, undefined, createDto);

    try {
      const response = await api_hukum.post<HukumEntity>(url, createDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'create', url);
    }
  }

  async update(id: number, updateDto: UpdateHukumDto): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('PUT', url, undefined, updateDto);

    try {
      const response = await api_hukum.put<HukumEntity>(url, updateDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'update', url);
    }
  }

  async updateActiveStatus(id: number, isActive: boolean): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${id}/status`;
    this.logApiCall('PUT', url, undefined, { isActive });

    try {
      const response = await api_hukum.put<HukumEntity>(url, { isActive });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateActiveStatus', url);
    }
  }

  async updateSummary(id: number, summary: UpdateHukumDto['summary']): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${id}/summary`;
    this.logApiCall('PUT', url, undefined, { summary });

    try {
      const response = await api_hukum.put<HukumEntity>(url, { summary });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateSummary', url);
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_hukum.delete<{ message: string; id: number }>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'remove', url);
    }
  }

  // =============================================
  // OPERASI PARAMETER
  // =============================================

  async addParameter(hukumId: number, dto: CreateParameterDto): Promise<HukumEntity> {
    // PERBAIKAN: Sesuaikan dengan endpoint backend
    // Controller menggunakan @Post(':kpmrId/aspek') untuk KPMR, tapi untuk inherent mungkin berbeda
    const url = `${this.baseUrl}/${hukumId}/parameters`;

    console.log('[Service] addParameter:', {
      url,
      hukumId,
      dto,
    });

    try {
      // Pastikan judul adalah string
      const payload: CreateParameterDto = {
        ...dto,
        judul: typeof dto.judul === 'string' ? dto.judul.trim() : String(dto.judul || '').trim(),
        bobot: Number(dto.bobot) || 0,
      };

      this.logApiCall('POST', url, undefined, payload);

      const response = await api_hukum.post<HukumEntity>(url, payload);

      // PERBAIKAN: Pastikan response memiliki parameters array
      if (response.data && !Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      console.log('[Service] addParameter - Success:', {
        newParameterId: response.data.id,
      });

      return response.data;
    } catch (error: any) {
      console.error('[Service] Error in addParameter:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url,
      });

      this.handleError(error, 'addParameter', url);
    }
  }

  async updateParameter(hukumId: number, parameterId: number, dto: UpdateParameterDto): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}`;

    try {
      // Format payload
      const payload: UpdateParameterDto = { ...dto };

      if (dto.judul !== undefined) {
        payload.judul = typeof dto.judul === 'string' ? dto.judul.trim() : String(dto.judul || '').trim();
      }

      if (dto.bobot !== undefined) {
        payload.bobot = Number(dto.bobot);
      }

      this.logApiCall('PUT', url, undefined, payload);

      const response = await api_hukum.put<HukumEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateParameter', url);
    }
  }

  async copyParameter(hukumId: number, parameterId: number): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}/copy`;
    this.logApiCall('POST', url);

    try {
      const response = await api_hukum.post<HukumEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'copyParameter', url);
    }
  }

  async removeParameter(hukumId: number, parameterId: number): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_hukum.delete<HukumEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'removeParameter', url);
    }
  }

  async reorderParameters(hukumId: number, parameterIds: number[]): Promise<{ message: string }> {
    const url = `${this.baseUrl}/${hukumId}/parameters/reorder`;

    try {
      const response = await api_hukum.put<{ message: string }>(url, { parameterIds });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'reorderParameters', url);
    }
  }

  // =============================================
  // OPERASI NILAI
  // =============================================

  async addNilai(hukumId: number, parameterId: number, dto: CreateNilaiDto): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}/nilai`;

    try {
      // Pastikan judul.text adalah string
      const payload: CreateNilaiDto = {
        ...dto,
        judul: {
          ...dto.judul,
          text: typeof dto.judul.text === 'string' ? dto.judul.text.trim() : String(dto.judul.text || '').trim(),
        },
        bobot: Number(dto.bobot) || 0,
      };

      this.logApiCall('POST', url, undefined, payload);

      const response = await api_hukum.post<HukumEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'addNilai', url);
    }
  }

  async updateNilai(hukumId: number, parameterId: number, nilaiId: number, dto: UpdateNilaiDto): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}/nilai/${nilaiId}`;

    try {
      // Format payload
      const payload: UpdateNilaiDto = { ...dto };

      if (dto.judul?.text !== undefined) {
        payload.judul = {
          ...dto.judul,
          text: typeof dto.judul.text === 'string' ? dto.judul.text.trim() : String(dto.judul.text || '').trim(),
        };
      }

      if (dto.bobot !== undefined) {
        payload.bobot = Number(dto.bobot);
      }

      this.logApiCall('PUT', url, undefined, payload);

      const response = await api_hukum.put<HukumEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateNilai', url);
    }
  }

  async copyNilai(hukumId: number, parameterId: number, nilaiId: number): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}/nilai/${nilaiId}/copy`;
    this.logApiCall('POST', url);

    try {
      const response = await api_hukum.post<HukumEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'copyNilai', url);
    }
  }

  async removeNilai(hukumId: number, parameterId: number, nilaiId: number): Promise<HukumEntity> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}/nilai/${nilaiId}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_hukum.delete<HukumEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'removeNilai', url);
    }
  }

  async reorderNilai(hukumId: number, parameterId: number, nilaiIds: number[]): Promise<{ message: string }> {
    const url = `${this.baseUrl}/${hukumId}/parameters/${parameterId}/nilai/reorder`;

    try {
      const response = await api_hukum.put<{ message: string }>(url, { nilaiIds });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'reorderNilai', url);
    }
  }

  // =============================================
  // IMPORT/EXPORT OPERATIONS
  // =============================================

  async exportToExcel(hukumId: number): Promise<any> {
    const url = `${this.baseUrl}/${hukumId}/export`;
    this.logApiCall('GET', url);

    try {
      const response = await api_hukum.get<any>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'exportToExcel', url);
    }
  }

  async importFromExcel(importData: any): Promise<HukumEntity> {
    const url = `${this.baseUrl}/import`;
    this.logApiCall('POST', url, undefined, importData);

    try {
      const response = await api_hukum.post<HukumEntity>(url, importData);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'importFromExcel', url);
    }
  }

  // =============================================
  // REFERENCE DATA
  // =============================================

  async getReferences(type?: string): Promise<ReferenceItem[]> {
    const url = `${this.baseUrl}/references`;
    const params = type ? { type } : undefined;

    this.logApiCall('GET', url, params);

    try {
      const response = await api_hukum.get<ReferenceItem[]>(url, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'getReferences', url);
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async checkExists(year: number, quarter: number): Promise<{ exists: boolean; data: HukumEntity | null }> {
    try {
      console.log(`[Service] checkExists for ${year}-Q${quarter}`);
      const data = await this.findByYearQuarter(year, quarter);
      return {
        exists: !!data,
        data,
      };
    } catch (error: any) {
      console.log('[Service] checkExists error:', error.message);
      return {
        exists: false,
        data: null,
      };
    }
  }

  /**
   * Method yang lebih aman untuk load data
   */
  async loadOrCreate(year: number, quarter: number): Promise<HukumEntity> {
    console.log(`[Service] loadOrCreate: ${year}-Q${quarter}`);

    try {
      // 1. Cari data yang sudah ada
      let data = await this.findByYearQuarter(year, quarter);

      if (data) {
        console.log(`[Service] loadOrCreate: Found existing data, ID: ${data.id}`);

        // PERBAIKAN: Pastikan parameters selalu array
        if (!Array.isArray(data.parameters)) {
          data.parameters = [];
        }

        return data;
      }

      // 2. Buat data baru
      console.log(`[Service] loadOrCreate: Creating new data`);

      const createDto: CreateHukumDto = {
        year,
        quarter,
        isActive: true,
        createdBy: 'system',
      };

      data = await this.create(createDto);

      // PERBAIKAN: Pastikan parameters array
      if (!Array.isArray(data.parameters)) {
        data.parameters = [];
      }

      console.log(`[Service] loadOrCreate: New data created, ID: ${data.id}`);
      return data;
    } catch (error: any) {
      console.error('[Service] loadOrCreate error:', {
        message: error.message,
        year,
        quarter,
      });

      // Buat data fallback jika gagal
      const fallbackData: HukumEntity = {
        id: -1, // Temporary ID
        year,
        quarter,
        isActive: true,
        parameters: [], // Pastikan array kosong
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('[Service] loadOrCreate: Returning fallback data');
      return fallbackData;
    }
  }

  /**
   * Method yang selalu return array untuk frontend
   */
  async getFormattedData(year?: number, quarter?: number): Promise<any[]> {
    console.log(`[Service] getFormattedData: year=${year}, quarter=${quarter}`);

    try {
      let data: HukumEntity | null = null;

      if (year && quarter) {
        data = await this.findByYearQuarter(year, quarter);
      } else {
        data = await this.findActive();
      }

      // PERBAIKAN: Pastikan selalu return array
      const result = this.formatToFrontend(data);

      console.log(`[Service] getFormattedData: Returning ${result.length} parameters`);
      return result;
    } catch (error: any) {
      console.error('[Service] getFormattedData error:', {
        message: error.message,
        year,
        quarter,
      });

      // PERBAIKAN: Return empty array jika error
      return [];
    }
  }

  /**
   * Format judul dari object ke string untuk parameter
   */
  formatParameterJudul(judul: any): string {
    if (!judul) return '';

    if (typeof judul === 'string') {
      return judul.trim();
    }

    if (typeof judul === 'object' && judul !== null) {
      return judul.text || judul.judul || judul.value || judul.label || '';
    }

    return String(judul).trim();
  }

  /**
   * Format judul dari string ke object untuk nilai
   */
  formatNilaiJudul(judul: any): CreateNilaiDto['judul'] {
    if (!judul) {
      return {
        type: 'Tanpa Faktor',
        text: '',
        value: null,
        pembilang: '',
        valuePembilang: null,
        penyebut: '',
        valuePenyebut: null,
        formula: '',
        percent: false,
      };
    }

    if (typeof judul === 'string') {
      return {
        type: 'Tanpa Faktor',
        text: judul.trim(),
        value: null,
        pembilang: '',
        valuePembilang: null,
        penyebut: '',
        valuePenyebut: null,
        formula: '',
        percent: false,
      };
    }

    // Jika sudah object
    return {
      type: judul.type || 'Tanpa Faktor',
      text: judul.text || '',
      value: judul.value ?? null,
      pembilang: judul.pembilang || '',
      valuePembilang: judul.valuePembilang ?? null,
      penyebut: judul.penyebut || '',
      valuePenyebut: judul.valuePenyebut ?? null,
      formula: judul.formula || '',
      percent: judul.percent || false,
    };
  }

  /**
   * Validate API connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      const response = await api_hukum.get(this.baseUrl, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('[Service] API connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const hukumService = new HukumService();
export default hukumService;
