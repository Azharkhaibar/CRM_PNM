// services/permodalan.service.ts
import api_permodalan_produk from '../permodalan-api.service';

// =============================================
// TYPES UNTUK INHERENT RISK (BUKAN KPMR)
// =============================================

export interface PermodalanOjkEntity {
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
  permodalanId: number; // ✅ BUKAN kpmrPermodalanId
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

export interface CreatePermodalanDto {
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

export interface UpdatePermodalanDto {
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

export class PermodalanService {
  private baseUrl = '/permodalan-ojk';

  // =============================================
  // FIND OR CREATE UTILITY
  // =============================================

  async findOrCreate(
    year: number,
    quarter: number,
  ): Promise<{
    success: boolean;
    data: PermodalanOjkEntity | null;
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

      const createDto: CreatePermodalanDto = {
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
  async ensureDataExists(year: number, quarter: number): Promise<PermodalanOjkEntity> {
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
  async loadOrCreateData(year: number, quarter: number): Promise<PermodalanOjkEntity> {
    console.log(`[Service] loadOrCreateData: ${year}-Q${quarter}`);
    return this.ensureDataExists(year, quarter);
  }

  // =============================================
  // FORMATTING UTILITIES
  // =============================================

  /**
   * Helper untuk format data ke frontend
   */
  private formatToFrontend(entity: PermodalanOjkEntity | null): any[] {
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
        // Metadata dari permodalan
        metadata: {
          permodalanId: entity.id,
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

    console.error(`[PermodalanService] Error in ${operation}:`, errorDetails);

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

  async findActive(): Promise<PermodalanOjkEntity | null> {
    const url = `${this.baseUrl}/active`;
    this.logApiCall('GET', url);

    try {
      const response = await api_permodalan_produk.get<PermodalanOjkEntity>(url);

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

  async findByYearQuarter(year: number, quarter: number): Promise<PermodalanOjkEntity | null> {
    const url = this.baseUrl;
    const params = { year, quarter };

    this.logApiCall('GET', url, params);

    try {
      const response = await api_permodalan_produk.get<any>(url, { params });

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

  async getById(id: number): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('GET', url);

    try {
      const response = await api_permodalan_produk.get<PermodalanOjkEntity>(url);

      if (response.data && !Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      this.handleError(error, 'getById', url);
    }
  }

  async create(createDto: CreatePermodalanDto): Promise<PermodalanOjkEntity> {
    const url = this.baseUrl;
    this.logApiCall('POST', url, undefined, createDto);

    try {
      const response = await api_permodalan_produk.post<PermodalanOjkEntity>(url, createDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'create', url);
    }
  }

  async update(id: number, updateDto: UpdatePermodalanDto): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('PUT', url, undefined, updateDto);

    try {
      const response = await api_permodalan_produk.put<PermodalanOjkEntity>(url, updateDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'update', url);
    }
  }

  async updateActiveStatus(id: number, isActive: boolean): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${id}/status`;
    this.logApiCall('PUT', url, undefined, { isActive });

    try {
      const response = await api_permodalan_produk.put<PermodalanOjkEntity>(url, { isActive });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateActiveStatus', url);
    }
  }

  async updateSummary(id: number, summary: UpdatePermodalanDto['summary']): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${id}/summary`;
    this.logApiCall('PUT', url, undefined, { summary });

    try {
      const response = await api_permodalan_produk.put<PermodalanOjkEntity>(url, { summary });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateSummary', url);
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const url = `${this.baseUrl}/${id}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_permodalan_produk.delete<{ message: string; id: number }>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'remove', url);
    }
  }

  // =============================================
  // OPERASI PARAMETER (✅ INHERENT)
  // =============================================

  async getParameters(permodalanId: number): Promise<ParameterEntity[]> {
    const url = `${this.baseUrl}/${permodalanId}/parameters`;
    this.logApiCall('GET', url);

    try {
      const response = await api_permodalan_produk.get<ParameterEntity[]>(url);
      return response.data || [];
    } catch (error: any) {
      this.handleError(error, 'getParameters', url);
    }
  }

  async addParameter(permodalanId: number, dto: CreateParameterDto): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters`;

    console.log('[Service] addParameter:', { url, permodalanId, dto });

    try {
      const payload: CreateParameterDto = {
        ...dto,
        judul: typeof dto.judul === 'string' ? dto.judul.trim() : String(dto.judul || '').trim(),
        bobot: Number(dto.bobot) || 0,
      };

      this.logApiCall('POST', url, undefined, payload);

      const response = await api_permodalan_produk.post<PermodalanOjkEntity>(url, payload);

      if (response.data && !Array.isArray(response.data.parameters)) {
        response.data.parameters = [];
      }

      return response.data;
    } catch (error: any) {
      this.handleError(error, 'addParameter', url);
    }
  }

  async updateParameter(permodalanId: number, parameterId: number, dto: UpdateParameterDto): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}`;

    try {
      const payload: UpdateParameterDto = { ...dto };

      if (dto.judul !== undefined) {
        payload.judul = typeof dto.judul === 'string' ? dto.judul.trim() : String(dto.judul || '').trim();
      }

      if (dto.bobot !== undefined) {
        payload.bobot = Number(dto.bobot);
      }

      this.logApiCall('PUT', url, undefined, payload);

      const response = await api_permodalan_produk.put<PermodalanOjkEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateParameter', url);
    }
  }

  async copyParameter(permodalanId: number, parameterId: number): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/copy`;
    this.logApiCall('POST', url);

    try {
      const response = await api_permodalan_produk.post<PermodalanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'copyParameter', url);
    }
  }

  async removeParameter(permodalanId: number, parameterId: number): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_permodalan_produk.delete<PermodalanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'removeParameter', url);
    }
  }

  async reorderParameters(permodalanId: number, parameterIds: number[]): Promise<{ message: string }> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/reorder`;

    try {
      const response = await api_permodalan_produk.put<{ message: string }>(url, { parameterIds });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'reorderParameters', url);
    }
  }

  // =============================================
  // OPERASI NILAI (✅ INHERENT)
  // =============================================

  async getNilai(permodalanId: number, parameterId: number): Promise<NilaiEntity[]> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/nilai`;
    this.logApiCall('GET', url);

    try {
      const response = await api_permodalan_produk.get<NilaiEntity[]>(url);
      return response.data || [];
    } catch (error: any) {
      this.handleError(error, 'getNilai', url);
    }
  }

  async addNilai(permodalanId: number, parameterId: number, dto: CreateNilaiDto): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/nilai`;

    try {
      const payload: CreateNilaiDto = {
        ...dto,
        bobot: Number(dto.bobot) || 0,
      };

      this.logApiCall('POST', url, undefined, payload);

      const response = await api_permodalan_produk.post<PermodalanOjkEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'addNilai', url);
    }
  }

  async updateNilai(permodalanId: number, parameterId: number, nilaiId: number, dto: UpdateNilaiDto): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/nilai/${nilaiId}`;

    try {
      const payload: UpdateNilaiDto = { ...dto };

      if (dto.bobot !== undefined) {
        payload.bobot = Number(dto.bobot);
      }

      this.logApiCall('PUT', url, undefined, payload);

      const response = await api_permodalan_produk.put<PermodalanOjkEntity>(url, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'updateNilai', url);
    }
  }

  async copyNilai(permodalanId: number, parameterId: number, nilaiId: number): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/nilai/${nilaiId}/copy`;
    this.logApiCall('POST', url);

    try {
      const response = await api_permodalan_produk.post<PermodalanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'copyNilai', url);
    }
  }

  async removeNilai(permodalanId: number, parameterId: number, nilaiId: number): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/nilai/${nilaiId}`;
    this.logApiCall('DELETE', url);

    try {
      const response = await api_permodalan_produk.delete<PermodalanOjkEntity>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'removeNilai', url);
    }
  }

  async reorderNilai(permodalanId: number, parameterId: number, nilaiIds: number[]): Promise<{ message: string }> {
    const url = `${this.baseUrl}/${permodalanId}/parameters/${parameterId}/nilai/reorder`;

    try {
      const response = await api_permodalan_produk.put<{ message: string }>(url, { nilaiIds });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'reorderNilai', url);
    }
  }

  // =============================================
  // IMPORT/EXPORT OPERATIONS
  // =============================================

  async exportToExcel(permodalanId: number): Promise<any> {
    const url = `${this.baseUrl}/${permodalanId}/export`;
    this.logApiCall('GET', url);

    try {
      const response = await api_permodalan_produk.get<any>(url);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'exportToExcel', url);
    }
  }

  async importFromExcel(importData: any): Promise<PermodalanOjkEntity> {
    const url = `${this.baseUrl}/import`;
    this.logApiCall('POST', url, undefined, importData);

    try {
      const response = await api_permodalan_produk.post<PermodalanOjkEntity>(url, importData);
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
      const response = await api_permodalan_produk.get<ReferenceItem[]>(url, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'getReferences', url);
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async checkExists(year: number, quarter: number): Promise<{ exists: boolean; data: PermodalanOjkEntity | null }> {
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

  async loadOrCreate(year: number, quarter: number): Promise<PermodalanOjkEntity> {
    console.log(`[Service] loadOrCreate: ${year}-Q${quarter}`);

    try {
      let data = await this.findByYearQuarter(year, quarter);

      if (data) {
        if (!Array.isArray(data.parameters)) {
          data.parameters = [];
        }
        return data;
      }

      const createDto: CreatePermodalanDto = {
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

      const fallbackData: PermodalanOjkEntity = {
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
      let data: PermodalanOjkEntity | null = null;

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
      const response = await api_permodalan_produk.get(this.baseUrl, {
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
export const permodalanService = new PermodalanService();
export default permodalanService;


