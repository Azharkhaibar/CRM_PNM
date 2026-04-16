// src/features/Dashboard/pages/RiskProfile/pages/Pasar/services/kpmr-pasar.service.ts
import api_pasar from '../api-pasar.service';
// ============================================================================
// INTERFACES - Sesuai dengan Entity Backend (dengan Year) - HARD DELETE ONLY
// ============================================================================

// ---------- ASPEK (Master) ----------
export interface KPMRPasarAspect {
  id: number;
  year: number;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateKPMRPasarAspectData {
  year: number;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
}

export interface UpdateKPMRPasarAspectData {
  aspekNo?: string;
  aspekTitle?: string;
  aspekBobot?: number;
}

// ---------- QUESTION (Master Pertanyaan) ----------
export interface KPMRPasarQuestion {
  id: number;
  year: number;
  aspekNo: string;
  sectionNo: string;
  sectionTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateKPMRPasarQuestionData {
  year: number;
  aspekNo: string;
  sectionNo: string;
  sectionTitle: string;
}

export interface UpdateKPMRPasarQuestionData {
  aspekNo?: string;
  sectionNo?: string;
  sectionTitle?: string;
}

// ---------- DEFINITION (Year-Level) ----------
export interface KPMRPasarDefinition {
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
  scores?: KPMRPasarScore[];
}

export interface CreateKPMRPasarDefinitionData {
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

export interface UpdateKPMRPasarDefinitionData {
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
export interface KPMRPasarScore {
  id: number;
  definitionId: number;
  year: number;
  quarter: string;
  sectionSkor: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  definition?: KPMRPasarDefinition;
}

export interface CreateKPMRPasarScoreData {
  definitionId: number;
  year: number;
  quarter: string;
  sectionSkor?: number;
}

export interface UpdateKPMRPasarScoreData {
  definitionId?: number;
  year?: number;
  quarter?: string;
  sectionSkor?: number;
}

// ---------- RESPONSE INTERFACES ----------
export interface KPMRPasarFullDataResponse {
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

class KPMRPasarApiService {
  // ========== ASPECT API ==========
  async createAspect(data: CreateKPMRPasarAspectData): Promise<KPMRPasarAspect> {
    console.log('📤 POST to: /kpmr-pasar/aspects', data);
    const response = await api_pasar.post<KPMRPasarAspect>('/kpmr-pasar/aspects', data);
    return response.data;
  }

  async getAllAspects(year?: number): Promise<KPMRPasarAspect[]> {
    let url = '/kpmr-pasar/aspects';
    if (year) url += `?year=${year}`;
    console.log('📥 GET from:', url);
    const response = await api_pasar.get<KPMRPasarAspect[]>(url);
    return response.data;
  }

  async getAspectById(id: number): Promise<KPMRPasarAspect> {
    console.log(`📥 GET from: /kpmr-pasar/aspects/${id}`);
    const response = await api_pasar.get<KPMRPasarAspect>(`/kpmr-pasar/aspects/${id}`);
    return response.data;
  }

  async updateAspect(id: number, data: UpdateKPMRPasarAspectData): Promise<KPMRPasarAspect> {
    console.log(`📤 PUT to: /kpmr-pasar/aspects/${id}`, data);
    const response = await api_pasar.put<KPMRPasarAspect>(`/kpmr-pasar/aspects/${id}`, data);
    return response.data;
  }

  // HARD DELETE
  async deleteAspect(id: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE (hard) from: /kpmr-pasar/aspects/${id}`);
    const response = await api_pasar.delete<DeleteResponse>(`/kpmr-pasar/aspects/${id}`);
    return response.data;
  }

  // ========== QUESTION API ==========
  async createQuestion(data: CreateKPMRPasarQuestionData): Promise<KPMRPasarQuestion> {
    console.log('📤 POST to: /kpmr-pasar/questions', data);
    const response = await api_pasar.post<KPMRPasarQuestion>('/kpmr-pasar/questions', data);
    return response.data;
  }

  async getAllQuestions(year?: number): Promise<KPMRPasarQuestion[]> {
    let url = '/kpmr-pasar/questions';
    if (year) url += `?year=${year}`;
    console.log('📥 GET from:', url);
    const response = await api_pasar.get<KPMRPasarQuestion[]>(url);
    return response.data;
  }

  async getQuestionsByAspect(aspekNo: string, year?: number): Promise<KPMRPasarQuestion[]> {
    let url = `/kpmr-pasar/questions/aspect/${aspekNo}`;
    if (year) url += `?year=${year}`;
    console.log('📥 GET from:', url);
    const response = await api_pasar.get<KPMRPasarQuestion[]>(url);
    return response.data;
  }

  async getQuestionById(id: number): Promise<KPMRPasarQuestion> {
    console.log(`📥 GET from: /kpmr-pasar/questions/${id}`);
    const response = await api_pasar.get<KPMRPasarQuestion>(`/kpmr-pasar/questions/${id}`);
    return response.data;
  }

  async updateQuestion(id: number, data: UpdateKPMRPasarQuestionData): Promise<KPMRPasarQuestion> {
    console.log(`📤 PUT to: /kpmr-pasar/questions/${id}`, data);
    const response = await api_pasar.put<KPMRPasarQuestion>(`/kpmr-pasar/questions/${id}`, data);
    return response.data;
  }

  // HARD DELETE
  async deleteQuestion(id: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE (hard) from: /kpmr-pasar/questions/${id}`);
    const response = await api_pasar.delete<DeleteResponse>(`/kpmr-pasar/questions/${id}`);
    return response.data;
  }

  // ========== DEFINITION API ==========
  async createOrUpdateDefinition(data: CreateKPMRPasarDefinitionData): Promise<KPMRPasarDefinition> {
    console.log('📤 POST to: /kpmr-pasar/definitions', data);
    const response = await api_pasar.post<KPMRPasarDefinition>('/kpmr-pasar/definitions', data);
    return response.data;
  }

  async getAllDefinitions(): Promise<KPMRPasarDefinition[]> {
    console.log('📥 GET from: /kpmr-pasar/definitions');
    const response = await api_pasar.get<KPMRPasarDefinition[]>('/kpmr-pasar/definitions');
    return response.data;
  }

  async getDefinitionsByYear(year: number): Promise<KPMRPasarDefinition[]> {
    console.log(`📥 GET from: /kpmr-pasar/definitions/year/${year}`);
    const response = await api_pasar.get<KPMRPasarDefinition[]>(`/kpmr-pasar/definitions/year/${year}`);
    return response.data;
  }

  async getDefinitionById(id: number): Promise<KPMRPasarDefinition> {
    console.log(`📥 GET from: /kpmr-pasar/definitions/${id}`);
    const response = await api_pasar.get<KPMRPasarDefinition>(`/kpmr-pasar/definitions/${id}`);
    return response.data;
  }

  async updateDefinition(id: number, data: UpdateKPMRPasarDefinitionData): Promise<KPMRPasarDefinition> {
    console.log(`📤 PUT to: /kpmr-pasar/definitions/${id}`, data);
    const response = await api_pasar.put<KPMRPasarDefinition>(`/kpmr-pasar/definitions/${id}`, data);
    return response.data;
  }

  // HARD DELETE definition with scores
  async deleteDefinitionPermanent(definitionId: number, year: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE to: /kpmr-pasar/definition/${definitionId}/${year}`);
    const response = await api_pasar.delete<DeleteResponse>(`/kpmr-pasar/definition/${definitionId}/${year}`);
    return response.data;
  }

  // ========== SCORE API ==========
  async createOrUpdateScore(data: CreateKPMRPasarScoreData): Promise<KPMRPasarScore> {
    console.log('📤 POST to: /kpmr-pasar/scores', data);
    const response = await api_pasar.post<KPMRPasarScore>('/kpmr-pasar/scores', data);
    return response.data;
  }

  async getAllScores(): Promise<KPMRPasarScore[]> {
    console.log('📥 GET from: /kpmr-pasar/scores');
    const response = await api_pasar.get<KPMRPasarScore[]>('/kpmr-pasar/scores');
    return response.data;
  }

  async getScoresByPeriod(year: number, quarter?: string): Promise<KPMRPasarScore[]> {
    let url = `/kpmr-pasar/scores/period?year=${year}`;
    if (quarter) url += `&quarter=${quarter}`;
    console.log('📥 GET from:', url);
    const response = await api_pasar.get<KPMRPasarScore[]>(url);
    return response.data;
  }

  async getScoresByDefinition(definitionId: number): Promise<KPMRPasarScore[]> {
    console.log(`📥 GET from: /kpmr-pasar/scores/definition/${definitionId}`);
    const response = await api_pasar.get<KPMRPasarScore[]>(`/kpmr-pasar/scores/definition/${definitionId}`);
    return response.data;
  }

  async getScoreById(id: number): Promise<KPMRPasarScore> {
    console.log(`📥 GET from: /kpmr-pasar/scores/${id}`);
    const response = await api_pasar.get<KPMRPasarScore>(`/kpmr-pasar/scores/${id}`);
    return response.data;
  }

  async updateScore(id: number, data: UpdateKPMRPasarScoreData): Promise<KPMRPasarScore> {
    console.log(`📤 PUT to: /kpmr-pasar/scores/${id}`, data);
    const response = await api_pasar.put<KPMRPasarScore>(`/kpmr-pasar/scores/${id}`, data);
    return response.data;
  }

  // HARD DELETE
  async deleteScore(id: number): Promise<DeleteResponse> {
    console.log(`🗑️ DELETE (hard) from: /kpmr-pasar/scores/${id}`);
    const response = await api_pasar.delete<DeleteResponse>(`/kpmr-pasar/scores/${id}`);
    return response.data;
  }

  async deleteScoreByTarget(definitionId: number, year: number, quarter: string): Promise<DeleteResponse> {
    console.log('🗑️ POST to: /kpmr-pasar/scores/target/delete', { definitionId, year, quarter });
    const response = await api_pasar.post<DeleteResponse>('/kpmr-pasar/scores/target/delete', { definitionId, year, quarter });
    return response.data;
  }

  // ========== COMPLEX QUERIES ==========
  async getFullData(year: number): Promise<KPMRPasarFullDataResponse> {
    console.log(`📥 GET full data from: /kpmr-pasar/full-data/${year}`);
    const response = await api_pasar.get<KPMRPasarFullDataResponse>(`/kpmr-pasar/full-data/${year}`);
    return response.data;
  }

  async searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<KPMRPasarDefinition[]> {
    let url = '/kpmr-pasar/search';
    const params = new URLSearchParams();
    if (year) params.append('year', String(year));
    if (query) params.append('query', query);
    if (aspekNo) params.append('aspekNo', aspekNo);

    if (params.toString()) url += `?${params.toString()}`;
    console.log('📥 GET from:', url);
    const response = await api_pasar.get<KPMRPasarDefinition[]>(url);
    return response.data;
  }

  async getAvailableYears(): Promise<number[]> {
    console.log('📥 GET from: /kpmr-pasar/years');
    const response = await api_pasar.get<YearsResponse>('/kpmr-pasar/years');
    return response.data.data;
  }

  async getPeriods(): Promise<Period[]> {
    console.log('📥 GET from: /kpmr-pasar/periods');
    const response = await api_pasar.get<PeriodsResponse>('/kpmr-pasar/periods');
    return response.data.data;
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const kpmrPasarApiService = new KPMRPasarApiService();

// ============================================================================
// UTILITY FUNCTIONS untuk Transform Data
// ============================================================================

export const transformDefinitionToComponent = (definition: KPMRPasarDefinition, scores: KPMRPasarScore[] = []) => {
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

export const transformFullDataToGroups = (fullData: KPMRPasarFullDataResponse) => {
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
