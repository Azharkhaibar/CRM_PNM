// src/features/Dashboard/pages/RiskProfile/pages/Investasi/services/kpmr.service.ts

import api_investasi from './api.service';
// ============================================================================
// INTERFACES - Sesuai dengan Entity Backend (dengan Year) - HARD DELETE ONLY
// ============================================================================

// ---------- ASPEK (Master) ----------
export interface KPMRAspect {
  id: number;
  year: number;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateKPMRAspectData {
  year: number;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
}

export interface UpdateKPMRAspectData {
  aspekNo?: string;
  aspekTitle?: string;
  aspekBobot?: number;
}

// ---------- QUESTION (Master Pertanyaan) ----------
export interface KPMRQuestion {
  id: number;
  year: number;
  aspekNo: string;
  sectionNo: string;
  sectionTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateKPMRQuestionData {
  year: number;
  aspekNo: string;
  sectionNo: string;
  sectionTitle: string;
}

export interface UpdateKPMRQuestionData {
  aspekNo?: string;
  sectionNo?: string;
  sectionTitle?: string;
}

// ---------- DEFINITION (Year-Level) ----------
export interface KPMRDefinition {
  id: number;
  year: number;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  sectionNo: string;
  sectionTitle: string;
  level1: string | null;
  level2: string | null;
  level3: string | null;
  level4: string | null;
  level5: string | null;
  evidence: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  scores?: KPMRScore[];
}

export interface CreateKPMRDefinitionData {
  year: number;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  sectionNo: string;
  sectionTitle: string;
  level1?: string;
  level2?: string;
  level3?: string;
  level4?: string;
  level5?: string;
  evidence?: string;
}

export interface UpdateKPMRDefinitionData {
  year?: number;
  aspekNo?: string;
  aspekTitle?: string;
  aspekBobot?: number;
  sectionNo?: string;
  sectionTitle?: string;
  level1?: string;
  level2?: string;
  level3?: string;
  level4?: string;
  level5?: string;
  evidence?: string;
}

// ---------- SCORE (Quarter-Level) ----------
export interface KPMRScore {
  id: number;
  definitionId: number;
  year: number;
  quarter: string;
  sectionSkor: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  definition?: KPMRDefinition;
}

export interface CreateKPMRScoreData {
  definitionId: number;
  year: number;
  quarter: string;
  sectionSkor?: number;
}

export interface UpdateKPMRScoreData {
  definitionId?: number;
  year?: number;
  quarter?: string;
  sectionSkor?: number;
}

// ---------- RESPONSE INTERFACES ----------
export interface KPMRFullDataResponse {
  success: boolean;
  year: number;
  aspects: Array<{
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sections: Array<{
      definitionId: number;
      sectionNo: string;
      sectionTitle: string;
      level1: string | null;
      level2: string | null;
      level3: string | null;
      level4: string | null;
      level5: string | null;
      evidence: string | null;
      scores: Record<
        string,
        {
          sectionSkor: number | null;
          id: number;
        }
      >;
    }>;
    quarterAverages: Record<string, number | null>;
  }>;
  overallAverages: Record<string, number | null>;
}

export interface Period {
  year: number;
  quarter: string;
}

export interface PeriodsResponse {
  success: boolean;
  data: Period[];
}

export interface YearsResponse {
  success: boolean;
  data: number[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// API SERVICE CLASS - HARD DELETE ONLY
// ============================================================================

class KPMRApiService {
  // ========== ASPECT API ==========
  async createAspect(data: CreateKPMRAspectData): Promise<KPMRAspect> {
    console.log('📤 POST to: /kpmr-investasi/aspects', data);
    const response = await api_investasi.post<KPMRAspect>('/kpmr-investasi/aspects', data);
    return response.data;
  }

  async getAllAspects(year?: number): Promise<KPMRAspect[]> {
    let url = '/kpmr-investasi/aspects';
    if (year) url += `?year=${year}`;
    console.log('📥 GET from:', url);
    const response = await api_investasi.get<KPMRAspect[]>(url);
    return response.data;
  }

  async getAspectById(id: number): Promise<KPMRAspect> {
    console.log(`📥 GET from: /kpmr-investasi/aspects/${id}`);
    const response = await api_investasi.get<KPMRAspect>(`/kpmr-investasi/aspects/${id}`);
    return response.data;
  }

  async updateAspect(id: number, data: UpdateKPMRAspectData): Promise<KPMRAspect> {
    console.log(`📤 PUT to: /kpmr-investasi/aspects/${id}`, data);
    const response = await api_investasi.put<KPMRAspect>(`/kpmr-investasi/aspects/${id}`, data);
    return response.data;
  }

  // HARD DELETE
  async deleteAspect(id: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE (hard) from: /kpmr-investasi/aspects/${id}`);
    const response = await api_investasi.delete<DeleteResponse>(`/kpmr-investasi/aspects/${id}`);
    return response.data;
  }

  // ========== QUESTION API ==========
  async createQuestion(data: CreateKPMRQuestionData): Promise<KPMRQuestion> {
    console.log('📤 POST to: /kpmr-investasi/questions', data);
    const response = await api_investasi.post<KPMRQuestion>('/kpmr-investasi/questions', data);
    return response.data;
  }

  async getAllQuestions(year?: number): Promise<KPMRQuestion[]> {
    let url = '/kpmr-investasi/questions';
    if (year) url += `?year=${year}`;
    console.log('📥 GET from:', url);
    const response = await api_investasi.get<KPMRQuestion[]>(url);
    return response.data;
  }

  async getQuestionsByAspect(aspekNo: string, year?: number): Promise<KPMRQuestion[]> {
    let url = `/kpmr-investasi/questions/aspect/${aspekNo}`;
    if (year) url += `?year=${year}`;
    console.log('📥 GET from:', url);
    const response = await api_investasi.get<KPMRQuestion[]>(url);
    return response.data;
  }

  async getQuestionById(id: number): Promise<KPMRQuestion> {
    console.log(`📥 GET from: /kpmr-investasi/questions/${id}`);
    const response = await api_investasi.get<KPMRQuestion>(`/kpmr-investasi/questions/${id}`);
    return response.data;
  }

  async updateQuestion(id: number, data: UpdateKPMRQuestionData): Promise<KPMRQuestion> {
    console.log(`📤 PUT to: /kpmr-investasi/questions/${id}`, data);
    const response = await api_investasi.put<KPMRQuestion>(`/kpmr-investasi/questions/${id}`, data);
    return response.data;
  }

  // HARD DELETE
  async deleteQuestion(id: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE (hard) from: /kpmr-investasi/questions/${id}`);
    const response = await api_investasi.delete<DeleteResponse>(`/kpmr-investasi/questions/${id}`);
    return response.data;
  }

  // ========== DEFINITION API ==========
  async createOrUpdateDefinition(data: CreateKPMRDefinitionData): Promise<KPMRDefinition> {
    console.log('📤 POST to: /kpmr-investasi/definitions', data);
    const response = await api_investasi.post<KPMRDefinition>('/kpmr-investasi/definitions', data);
    return response.data;
  }

  async getAllDefinitions(): Promise<KPMRDefinition[]> {
    console.log('📥 GET from: /kpmr-investasi/definitions');
    const response = await api_investasi.get<KPMRDefinition[]>('/kpmr-investasi/definitions');
    return response.data;
  }

  async getDefinitionsByYear(year: number): Promise<KPMRDefinition[]> {
    console.log(`📥 GET from: /kpmr-investasi/definitions/year/${year}`);
    const response = await api_investasi.get<KPMRDefinition[]>(`/kpmr-investasi/definitions/year/${year}`);
    return response.data;
  }

  async getDefinitionById(id: number): Promise<KPMRDefinition> {
    console.log(`📥 GET from: /kpmr-investasi/definitions/${id}`);
    const response = await api_investasi.get<KPMRDefinition>(`/kpmr-investasi/definitions/${id}`);
    return response.data;
  }

  async updateDefinition(id: number, data: UpdateKPMRDefinitionData): Promise<KPMRDefinition> {
    console.log(`📤 PUT to: /kpmr-investasi/definitions/${id}`, data);
    const response = await api_investasi.put<KPMRDefinition>(`/kpmr-investasi/definitions/${id}`, data);
    return response.data;
  }

  // HARD DELETE definition with scores
  // HARD DELETE definition with scores - menggunakan DELETE method
  async deleteDefinitionPermanent(definitionId: number, year: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE to: /kpmr-investasi/definition/${definitionId}/${year}`);
    const response = await api_investasi.delete<DeleteResponse>(`/kpmr-investasi/definition/${definitionId}/${year}`);
    return response.data;
  }

  // ========== SCORE API ==========
  async createOrUpdateScore(data: CreateKPMRScoreData): Promise<KPMRScore> {
    console.log('📤 POST to: /kpmr-investasi/scores', data);
    const response = await api_investasi.post<KPMRScore>('/kpmr-investasi/scores', data);
    return response.data;
  }

  async getAllScores(): Promise<KPMRScore[]> {
    console.log('📥 GET from: /kpmr-investasi/scores');
    const response = await api_investasi.get<KPMRScore[]>('/kpmr-investasi/scores');
    return response.data;
  }

  async getScoresByPeriod(year: number, quarter?: string): Promise<KPMRScore[]> {
    let url = `/kpmr-investasi/scores/period?year=${year}`;
    if (quarter) url += `&quarter=${quarter}`;
    console.log('📥 GET from:', url);
    const response = await api_investasi.get<KPMRScore[]>(url);
    return response.data;
  }

  async getScoresByDefinition(definitionId: number): Promise<KPMRScore[]> {
    console.log(`📥 GET from: /kpmr-investasi/scores/definition/${definitionId}`);
    const response = await api_investasi.get<KPMRScore[]>(`/kpmr-investasi/scores/definition/${definitionId}`);
    return response.data;
  }

  async getScoreById(id: number): Promise<KPMRScore> {
    console.log(`📥 GET from: /kpmr-investasi/scores/${id}`);
    const response = await api_investasi.get<KPMRScore>(`/kpmr-investasi/scores/${id}`);
    return response.data;
  }

  async updateScore(id: number, data: UpdateKPMRScoreData): Promise<KPMRScore> {
    console.log(`📤 PUT to: /kpmr-investasi/scores/${id}`, data);
    const response = await api_investasi.put<KPMRScore>(`/kpmr-investasi/scores/${id}`, data);
    return response.data;
  }

  // HARD DELETE
  async deleteScore(id: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE (hard) from: /kpmr-investasi/scores/${id}`);
    const response = await api_investasi.delete<DeleteResponse>(`/kpmr-investasi/scores/${id}`);
    return response.data;
  }

  async deleteScoreByTarget(definitionId: number, year: number, quarter: string): Promise<DeleteResponse> {
    console.log('🗑️ POST to: /kpmr-investasi/scores/target/delete', { definitionId, year, quarter });
    const response = await api_investasi.post<DeleteResponse>('/kpmr-investasi/scores/target/delete', { definitionId, year, quarter });
    return response.data;
  }

  // ========== COMPLEX QUERIES ==========
  async getFullData(year: number): Promise<KPMRFullDataResponse> {
    console.log(`📥 GET full data from: /kpmr-investasi/full-data/${year}`);
    const response = await api_investasi.get<KPMRFullDataResponse>(`/kpmr-investasi/full-data/${year}`);
    return response.data;
  }

  async searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<KPMRDefinition[]> {
    let url = '/kpmr-investasi/search';
    const params = new URLSearchParams();
    if (year) params.append('year', String(year));
    if (query) params.append('query', query);
    if (aspekNo) params.append('aspekNo', aspekNo);

    if (params.toString()) url += `?${params.toString()}`;
    console.log('📥 GET from:', url);
    const response = await api_investasi.get<KPMRDefinition[]>(url);
    return response.data;
  }

  async getAvailableYears(): Promise<number[]> {
    console.log('📥 GET from: /kpmr-investasi/years');
    const response = await api_investasi.get<YearsResponse>('/kpmr-investasi/years');
    return response.data.data;
  }

  async getPeriods(): Promise<Period[]> {
    console.log('📥 GET from: /kpmr-investasi/periods');
    const response = await api_investasi.get<PeriodsResponse>('/kpmr-investasi/periods');
    return response.data.data;
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const kpmrApiService = new KPMRApiService();

// ============================================================================
// UTILITY FUNCTIONS untuk Transform Data
// ============================================================================

export const transformDefinitionToComponent = (definition: KPMRDefinition, scores: KPMRScore[] = []) => {
  const quarterScores = scores.reduce(
    (acc, score) => {
      acc[score.quarter] = {
        sectionSkor: score.sectionSkor,
        id: score.id,
      };
      return acc;
    },
    {} as Record<string, { sectionSkor: number | null; id: number }>,
  );

  return {
    definitionId: definition.id,
    year: definition.year,
    aspekNo: definition.aspekNo,
    aspekTitle: definition.aspekTitle,
    aspekBobot: definition.aspekBobot,
    sectionNo: definition.sectionNo,
    sectionTitle: definition.sectionTitle,
    level1: definition.level1,
    level2: definition.level2,
    level3: definition.level3,
    level4: definition.level4,
    level5: definition.level5,
    evidence: definition.evidence,
    scores: quarterScores,
  };
};

export const transformFullDataToGroups = (fullData: KPMRFullDataResponse) => {
  return fullData.aspects.map((aspect) => ({
    aspekNo: aspect.aspekNo,
    aspekTitle: aspect.aspekTitle,
    aspekBobot: aspect.aspekBobot,
    sections: aspect.sections.map((section) => ({
      sectionNo: section.sectionNo,
      sectionTitle: section.sectionTitle,
      definitionId: section.definitionId,
      level1: section.level1,
      level2: section.level2,
      level3: section.level3,
      level4: section.level4,
      level5: section.level5,
      evidence: section.evidence,
      quarters: Object.keys(section.scores).reduce(
        (acc, quarter) => {
          acc[quarter] = {
            sectionSkor: section.scores[quarter].sectionSkor,
            id: section.scores[quarter].id,
          };
          return acc;
        },
        {} as Record<string, { sectionSkor: number | null; id: number }>,
      ),
    })),
    quarterAverages: aspect.quarterAverages,
  }));
};
