// services/kepatuhan.service.ts
import api_kepatuhan_produk from '../kepatuhan-api.service';

// =============================================
// TYPES UNTUK INHERENT RISK (BUKAN KPMR)
// =============================================

export interface KepatuhanOjkEntity {
  id: number;
  year: number;
  quarter: number;
  isActive: boolean;
  parameters?: ParameterEntity[]; // ✅ BUKAN aspekList
  summary?: {
    totalWeighted?: number; // ✅ BUKAN totalScore
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
  // ✅ BUKAN AspekEntity
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
  nilaiList?: NilaiEntity[]; // ✅ BUKAN pertanyaanList
  orderIndex: number;
  kepatuhanId: number; // ✅ BUKAN kpmrKepatuhanId
  createdAt: Date;
  updatedAt: Date;
}

export interface NilaiEntity {
  // ✅ BUKAN PertanyaanEntity
  id: number;
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
// DTOs UNTUK INHERENT RISK
// =============================================

export interface CreateKepatuhanDto {
  year: number;
  quarter: number;
  isActive?: boolean;
  createdBy?: string;
  version?: string;
  notes?: string;
  summary?: {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
  };
}

export interface UpdateKepatuhanDto {
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

export interface ReorderParametersDto {
  parameterIds: number[];
}

export interface ReorderNilaiDto {
  nilaiIds: number[];
}

export interface UpdateSummaryDto {
  totalWeighted?: number;
  summaryBg?: string;
  computedAt?: Date;
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

export class KepatuhanService {
  private baseUrl = '/kepatuhan-ojk';

  // =============================================
  // FIND OR CREATE UTILITY
  // =============================================

  async findOrCreate(
    year: number,
    quarter: number,
  ): Promise<{
    success: boolean;
    data: KepatuhanOjkEntity | null;
    isNew: boolean;
    message: string;
  }> {
    console.log(`[Service] findOrCreate: ${year}-Q${quarter}`);

    try {
      // 1. Cari data yang sudah ada
      const existingData = await this.findByYearQuarter(year, quarter);

      if (existingData) {
        console.log(`[Service] findOrCreate: Data found, ID: ${existingData.id}`);
        return {
          success: true,
          data: existingData,
          isNew: false,
          message: 'Data ditemukan',
        };
      }

      // 2. Jika tidak ada, buat data baru
      console.log(`[Service] findOrCreate: Creating new data`);

      const createDto: CreateKepatuhanDto = {
        year,
        quarter,
        isActive: true,
        createdBy: 'system',
        version: '1.0.0',
      };

      const newData = await this.create(createDto);

      console.log(`[Service] findOrCreate: New data created, ID: ${newData.id}`);

      return {
        success: true,
        data: newData,
        isNew: true,
        message: 'Data berhasil dibuat',
      };
    } catch (error: any) {
      console.error('[Service] findOrCreate error:', error);

      return {
        success: false,
        data: null,
        isNew: false,
        message: error.message || 'Gagal memuat atau membuat data',
      };
    }
  }

  /**
   * Method untuk memastikan data tersedia sebelum operasi
   */
  async ensureDataExists(year: number, quarter: number): Promise<KepatuhanOjkEntity> {
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
  async loadOrCreateData(year: number, quarter: number): Promise<KepatuhanOjkEntity> {
    console.log(`[Service] loadOrCreateData: ${year}-Q${quarter}`);
    return this.ensureDataExists(year, quarter);
  }

  // =============================================
  // FORMATTING UTILITIES
  // =============================================

  /**
   * Helper untuk format data ke frontend
   */
  private formatToFrontend(entity: KepatuhanOjkEntity | null): any[] {
    console.log('[Service] formatToFrontend - Input entity:', {
      entity,
      hasParameters: !!entity?.parameters,
      parametersType: Array.isArray(entity?.parameters) ? 'array' : typeof entity?.parameters,
    });

    if (!entity) {
      console.log('[Service] formatToFrontend: Entity is null, returning empty array');
      return [];
    }

    // Pastikan parameters selalu array
    const parameters = Array.isArray(entity.parameters) ? entity.parameters : [];

    console.log(`[Service] formatToFrontend: Processing ${parameters.length} parameters`);

    const result = parameters.map((parameter, index) => {
      // Pastikan nilaiList selalu array
      const nilaiList = Array.isArray(parameter.nilaiList) ? parameter.nilaiList : [];

      const formattedParameter = {
        id: parameter.id?.toString() || `temp-${Date.now()}-${index}`,
        nomor: parameter.nomor || '',
        judul: parameter.judul || '',
        bobot: parameter.bobot || 0,
        kategori: parameter.kategori || {},
        orderIndex: parameter.orderIndex || index,
        // Format nilaiList
        nilaiList: nilaiList.map((nilai, idx) => ({
          id: nilai.id?.toString() || `temp-nilai-${Date.now()}-${idx}`,
          nomor: nilai.nomor || '',
          judul: nilai.judul || { text: '' },
          bobot: nilai.bobot || 0,
          portofolio: nilai.portofolio || '',
          keterangan: nilai.keterangan || '',
          riskindikator: nilai.riskindikator || {},
          orderIndex: nilai.orderIndex || idx,
        })),
        // Metadata dari kepatuhan
        metadata: {
          kepatuhanId: entity.id,
          year: entity.year,
          quarter: entity.quarter,
          isActive: entity.isActive,
          isLocked: entity.isLocked || false,
          summary: entity.summary,
        },
      };

      console.log(`[Service] formatToFrontend: Parameter ${index} formatted:`, {
        id: formattedParameter.id,
        judul: formattedParameter.judul,
        nilaiCount: formattedParameter.nilaiList.length,
      });

      return formattedParameter;
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

    console.error(`[KepatuhanService] Error in ${operation}:`, errorDetails);

    let errorMessage = `Gagal melakukan operasi ${operation}`;

    if (error.response?.status === 404) {
      errorMessage = `Endpoint tidak ditemukan: ${url}`;
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

  async findActive(): Promise<KepatuhanOjkEntity | null> {
    const url = `${this.baseUrl}/active`;
    this.logApiCall('GET', url);

    try {
      const response = await api_kepatuhan_produk.get<KepatuhanOjkEntity>(url);

      if (!response.data) {
        return null;
      }

      // Pastikan parameters array
      if (!Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      this.handleError(error, 'findActive', url);
    }
  }

  async findByYearQuarter(year: number, quarter: number): Promise<KepatuhanOjkEntity | null> {
    const url = this.baseUrl;
    const params = { year, quarter };

    this.logApiCall('GET', url, params);

    try {
      const response = await api_kepatuhan_produk.get<any>(url, { params });

      if (!response.data) {
        return null;
      }

      let data = response.data;

      // Handle response array
      if (Array.isArray(data)) {
        data = data.length > 0 ? data[0] : null;
      }

      if (!data) {
        return null;
      }

      // Pastikan parameters array
      if (!Array.isArray(data.parameters)) {
        data.parameters = [];
      }

      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      this.handleError(error, 'findByYearQuarter', `${url}?year=${year}&quarter=${quarter}`);
    }
  }

  async getById(id: number): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('GET', url);

    try {
      const response = await api_kepatuhan_produk.get<KepatuhanOjkEntity>(url);

      if (response.data && !Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      this.handleError(error, 'getById', url);
    }
  }

  async create(createDto: CreateKepatuhanDto): Promise<KepatuhanOjkEntity> {
    const url = this.baseUrl;
    this.logApiCall('POST', url, undefined, createDto);

    try {
      const response = await api_kepatuhan_produk.post<KepatuhanOjkEntity>(url, createDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'create', url);
    }
  }

  async update(id: number, updateDto: UpdateKepatuhanDto): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('PUT', url, undefined, updateDto);

    try {
      const response = await api_kepatuhan_produk.put<KepatuhanOjkEntity>(url, updateDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'update', url);
    }
  }

  async updateActiveStatus(id: number, isActive: boolean): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${id}/status`;
    this.logApiCall('PUT', url, undefined, { isActive });

    try {
      const response = await api_kepatuhan_produk.put<KepatuhanOjkEntity>(url, { isActive });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateActiveStatus', url);
    }
  }

  async updateSummary(id: number, summary: UpdateKepatuhanDto['summary']): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${id}/summary`;
    this.logApiCall('PUT', url, undefined, { summary });

    try {
      const response = await api_kepatuhan_produk.put<KepatuhanOjkEntity>(url, { summary });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateSummary', url);
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_kepatuhan_produk.delete<{ message: string; id: number }>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'remove', url);
    }
  }

  // =============================================
  // OPERASI PARAMETER (✅ INHERENT)
  // =============================================

  async getParameters(kepatuhanId: number): Promise<ParameterEntity[]> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters`;
    this.logApiCall('GET', url);

    try {
      const response = await api_kepatuhan_produk.get<ParameterEntity[]>(url);
      return response.data || [];
    } catch (error: any) {
      this.handleError(error, 'getParameters', url);
    }
  }

  async addParameter(kepatuhanId: number, dto: CreateParameterDto): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters`;

    console.log('[Service] addParameter:', { url, kepatuhanId, dto });

    try {
      const payload: CreateParameterDto = {
        ...dto,
        judul: typeof dto.judul === 'string' ? dto.judul.trim() : String(dto.judul || '').trim(),
        bobot: Number(dto.bobot) || 0,
      };

      this.logApiCall('POST', url, undefined, payload);

      const response = await api_kepatuhan_produk.post<KepatuhanOjkEntity>(url, payload);

      if (response.data && !Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      this.handleError(error, 'addParameter', url);
    }
  }

  async updateParameter(kepatuhanId: number, parameterId: number, dto: UpdateParameterDto): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}`;

    try {
      const payload: UpdateParameterDto = { ...dto };

      if (dto.judul !== undefined) {
        payload.judul = typeof dto.judul === 'string' ? dto.judul.trim() : String(dto.judul || '').trim();
      }

      if (dto.bobot !== undefined) {
        payload.bobot = Number(dto.bobot);
      }

      this.logApiCall('PUT', url, undefined, payload);

      const response = await api_kepatuhan_produk.put<KepatuhanOjkEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateParameter', url);
    }
  }

  async copyParameter(kepatuhanId: number, parameterId: number): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/copy`;
    this.logApiCall('POST', url);

    try {
      const response = await api_kepatuhan_produk.post<KepatuhanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'copyParameter', url);
    }
  }

  async removeParameter(kepatuhanId: number, parameterId: number): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_kepatuhan_produk.delete<KepatuhanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'removeParameter', url);
    }
  }

  async reorderParameters(kepatuhanId: number, parameterIds: number[]): Promise<{ message: string }> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/reorder`;

    try {
      const response = await api_kepatuhan_produk.put<{ message: string }>(url, { parameterIds });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'reorderParameters', url);
    }
  }

  // =============================================
  // OPERASI NILAI (✅ INHERENT)
  // =============================================

  async getNilai(kepatuhanId: number, parameterId: number): Promise<NilaiEntity[]> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/nilai`;
    this.logApiCall('GET', url);

    try {
      const response = await api_kepatuhan_produk.get<NilaiEntity[]>(url);
      return response.data || [];
    } catch (error: any) {
      this.handleError(error, 'getNilai', url);
    }
  }

  async addNilai(kepatuhanId: number, parameterId: number, dto: CreateNilaiDto): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/nilai`;

    try {
      const payload: CreateNilaiDto = {
        ...dto,
        bobot: Number(dto.bobot) || 0,
      };

      this.logApiCall('POST', url, undefined, payload);

      const response = await api_kepatuhan_produk.post<KepatuhanOjkEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'addNilai', url);
    }
  }

  async updateNilai(kepatuhanId: number, parameterId: number, nilaiId: number, dto: UpdateNilaiDto): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/nilai/${nilaiId}`;

    try {
      const payload: UpdateNilaiDto = { ...dto };

      if (dto.bobot !== undefined) {
        payload.bobot = Number(dto.bobot);
      }

      this.logApiCall('PUT', url, undefined, payload);

      const response = await api_kepatuhan_produk.put<KepatuhanOjkEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateNilai', url);
    }
  }

  async copyNilai(kepatuhanId: number, parameterId: number, nilaiId: number): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/nilai/${nilaiId}/copy`;
    this.logApiCall('POST', url);

    try {
      const response = await api_kepatuhan_produk.post<KepatuhanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'copyNilai', url);
    }
  }

  async removeNilai(kepatuhanId: number, parameterId: number, nilaiId: number): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/nilai/${nilaiId}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_kepatuhan_produk.delete<KepatuhanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'removeNilai', url);
    }
  }

  async reorderNilai(kepatuhanId: number, parameterId: number, nilaiIds: number[]): Promise<{ message: string }> {
    const url = `${this.baseUrl}/${kepatuhanId}/parameters/${parameterId}/nilai/reorder`;

    try {
      const response = await api_kepatuhan_produk.put<{ message: string }>(url, { nilaiIds });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'reorderNilai', url);
    }
  }

  // =============================================
  // IMPORT/EXPORT OPERATIONS
  // =============================================

  async exportToExcel(kepatuhanId: number): Promise<any> {
    const url = `${this.baseUrl}/${kepatuhanId}/export`;
    this.logApiCall('GET', url);

    try {
      const response = await api_kepatuhan_produk.get<any>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'exportToExcel', url);
    }
  }

  async importFromExcel(importData: any): Promise<KepatuhanOjkEntity> {
    const url = `${this.baseUrl}/import`;
    this.logApiCall('POST', url, undefined, importData);

    try {
      const response = await api_kepatuhan_produk.post<KepatuhanOjkEntity>(url, importData);
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
      const response = await api_kepatuhan_produk.get<ReferenceItem[]>(url, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'getReferences', url);
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async checkExists(year: number, quarter: number): Promise<{ exists: boolean; data: KepatuhanOjkEntity | null }> {
    try {
      const data = await this.findByYearQuarter(year, quarter);
      return {
        exists: !!data,
        data,
      };
    } catch (error: any) {
      return {
        exists: false,
        data: null,
      };
    }
  }

  async loadOrCreate(year: number, quarter: number): Promise<KepatuhanOjkEntity> {
    console.log(`[Service] loadOrCreate: ${year}-Q${quarter}`);

    try {
      let data = await this.findByYearQuarter(year, quarter);

      if (data) {
        if (!Array.isArray(data.parameters)) {
          data.parameters = [];
        }
        return data;
      }

      const createDto: CreateKepatuhanDto = {
        year,
        quarter,
        isActive: true,
        createdBy: 'system',
      };

      data = await this.create(createDto);

      if (!Array.isArray(data.parameters)) {
        data.parameters = [];
      }

      return data;
    } catch (error: any) {
      console.error('[Service] loadOrCreate error:', error);

      const fallbackData: KepatuhanOjkEntity = {
        id: -1,
        year,
        quarter,
        isActive: true,
        parameters: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return fallbackData;
    }
  }

  async getFormattedData(year?: number, quarter?: number): Promise<any[]> {
    console.log(`[Service] getFormattedData: year=${year}, quarter=${quarter}`);

    try {
      let data: KepatuhanOjkEntity | null = null;

      if (year && quarter) {
        data = await this.findByYearQuarter(year, quarter);
      } else {
        data = await this.findActive();
      }

      const result = this.formatToFrontend(data);
      return result;
    } catch (error: any) {
      console.error('[Service] getFormattedData error:', error);
      return [];
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      const response = await api_kepatuhan_produk.get(this.baseUrl, {
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
export const kepatuhanService = new KepatuhanService();
export default kepatuhanService;
