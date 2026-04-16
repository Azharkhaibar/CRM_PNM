// src/features/Dashboard/pages/RiskProfile/pages/Pasar/services/kpmr-pasar.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { KPMRPasarDefinition } from './entities/kpmr-pasar-definisi.entity';
import { KPMRPasarScore } from './entities/kpmr-pasar-skor.entity';
import { KPMRPasarAspect } from './entities/kpmr-pasar-aspek.entity';
import { KPMRPasarQuestion } from './entities/kpmr-pasar-pertanyaan.entity';
import {
  CreateKPMRPasarAspectDto,
  UpdateKPMRPasarAspectDto,
  CreateKPMRPasarQuestionDto,
  UpdateKPMRPasarQuestionDto,
  CreateKPMRPasarDefinitionDto,
  UpdateKPMRPasarDefinitionDto,
  CreateKPMRPasarScoreDto,
  UpdateKPMRPasarScoreDto,
} from './dto/kpmr-pasar.dto';

@Injectable()
export class KPMRPasarService {
  private readonly logger = new Logger(KPMRPasarService.name);

  constructor(
    @InjectRepository(KPMRPasarDefinition)
    private readonly definitionRepo: Repository<KPMRPasarDefinition>,

    @InjectRepository(KPMRPasarScore)
    private readonly scoreRepo: Repository<KPMRPasarScore>,

    @InjectRepository(KPMRPasarAspect)
    private readonly aspectRepo: Repository<KPMRPasarAspect>,

    @InjectRepository(KPMRPasarQuestion)
    private readonly questionRepo: Repository<KPMRPasarQuestion>,
  ) {}

  // ==================== HELPER METHODS ====================

  private validateQuarter(quarter: string): void {
    const validQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    if (!validQuarters.includes(quarter)) {
      throw new BadRequestException(
        `Quarter harus salah satu dari: ${validQuarters.join(', ')}`,
      );
    }
  }

  async validateDefinitionExists(
    definitionId: number,
  ): Promise<KPMRPasarDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id: definitionId },
    });

    if (!definition) {
      throw new NotFoundException(
        `Definition dengan ID ${definitionId} tidak ditemukan`,
      );
    }

    return definition;
  }

  // ========== ASPECT SERVICES ==========
  async createAspect(
    createDto: CreateKPMRPasarAspectDto,
  ): Promise<KPMRPasarAspect> {
    this.logger.log(
      `Creating aspect for year ${createDto.year}: ${JSON.stringify(createDto)}`,
    );

    // Cek apakah sudah ada
    const existing = await this.aspectRepo.findOne({
      where: {
        year: createDto.year,
        aspekNo: createDto.aspekNo,
      },
    });

    if (existing) {
      // UPDATE jika sudah ada (hard delete sebenarnya tidak menghapus data)
      existing.aspekTitle = createDto.aspekTitle;
      existing.aspekBobot = createDto.aspekBobot;
      return await this.aspectRepo.save(existing);
    }

    const aspect = this.aspectRepo.create(createDto);
    return await this.aspectRepo.save(aspect);
  }

  async findAllAspects(year?: number): Promise<KPMRPasarAspect[]> {
    const where: any = {};
    if (year) {
      where.year = year;
    }

    return await this.aspectRepo.find({
      where,
      order: { year: 'DESC', aspekNo: 'ASC' },
    });
  }

  async findAspectById(id: number): Promise<KPMRPasarAspect> {
    const aspect = await this.aspectRepo.findOne({
      where: { id },
    });

    if (!aspect) {
      throw new NotFoundException(`Aspek dengan ID ${id} tidak ditemukan`);
    }

    return aspect;
  }

  async updateAspect(
    id: number,
    updateDto: UpdateKPMRPasarAspectDto,
  ): Promise<KPMRPasarAspect> {
    const aspect = await this.findAspectById(id);
    Object.assign(aspect, updateDto);
    return await this.aspectRepo.save(aspect);
  }

  async deleteAspect(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const aspect = await this.aspectRepo.findOne({
      where: { id },
    });

    if (!aspect) {
      throw new NotFoundException(`Aspek dengan ID ${id} tidak ditemukan`);
    }

    this.logger.log(
      `🗑️ Deleting aspect ID ${id} (${aspect.aspekNo} - ${aspect.year})`,
    );

    // Karena ada ON DELETE CASCADE di database, cukup hapus aspek saja
    // Database akan otomatis menghapus questions, definitions, scores
    await this.aspectRepo.delete(id);

    this.logger.log(
      `✅ Aspect ID ${id} and all related data deleted (cascade)`,
    );

    return {
      success: true,
      message: `Aspek "${aspect.aspekTitle}" untuk tahun ${aspect.year} berhasil dihapus permanen.`,
    };
  }

  // ========== QUESTION SERVICES ==========
  async createQuestion(
    createDto: CreateKPMRPasarQuestionDto,
  ): Promise<KPMRPasarQuestion> {
    this.logger.log(
      `Creating question for year ${createDto.year}: ${JSON.stringify(createDto)}`,
    );

    if (!createDto.aspekNo || !createDto.sectionNo || !createDto.sectionTitle) {
      throw new BadRequestException(
        'aspekNo, sectionNo, dan sectionTitle harus diisi',
      );
    }

    const aspect = await this.aspectRepo.findOne({
      where: {
        year: createDto.year,
        aspekNo: createDto.aspekNo,
      },
    });

    if (!aspect) {
      throw new NotFoundException(
        `Aspek dengan nomor "${createDto.aspekNo}" untuk tahun ${createDto.year} tidak ditemukan. Silakan buat aspek terlebih dahulu.`,
      );
    }

    try {
      const question = this.questionRepo.create(createDto);
      const savedQuestion = await this.questionRepo.save(question);
      this.logger.log(
        `✅ Question created successfully: ID ${savedQuestion.id}`,
      );
      return savedQuestion;
    } catch (error) {
      this.logger.error(`❌ Failed to create question: ${error.message}`);
      throw new BadRequestException(
        `Gagal membuat pertanyaan: ${error.message}`,
      );
    }
  }

  async findAllQuestions(year?: number): Promise<KPMRPasarQuestion[]> {
    const where: any = {};
    if (year) {
      where.year = year;
    }

    return await this.questionRepo.find({
      where,
      order: { year: 'DESC', aspekNo: 'ASC', sectionNo: 'ASC' },
    });
  }

  async findQuestionsByAspect(
    aspekNo: string,
    year?: number,
  ): Promise<KPMRPasarQuestion[]> {
    const where: any = { aspekNo };
    if (year) {
      where.year = year;
    }

    return await this.questionRepo.find({
      where,
      order: { year: 'DESC', sectionNo: 'ASC' },
    });
  }

  async findQuestionById(id: number): Promise<KPMRPasarQuestion> {
    const question = await this.questionRepo.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Pertanyaan dengan ID ${id} tidak ditemukan`);
    }

    return question;
  }

  async updateQuestion(
    id: number,
    updateDto: UpdateKPMRPasarQuestionDto,
  ): Promise<KPMRPasarQuestion> {
    const question = await this.findQuestionById(id);
    Object.assign(question, updateDto);
    return await this.questionRepo.save(question);
  }

  async deleteQuestion(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const question = await this.findQuestionById(id);

    this.logger.log(
      `🗑️ Deleting question ID ${id} (${question.sectionNo} - ${question.sectionTitle}) for year ${question.year}`,
    );

    // Cari semua definitions yang menggunakan question ini
    const definitions = await this.definitionRepo.find({
      where: {
        year: question.year,
        aspekNo: question.aspekNo,
        sectionNo: question.sectionNo,
      },
    });

    const definitionsCount = definitions.length;

    // Hapus question (karena ON DELETE CASCADE, definitions dan scores ikut terhapus)
    await this.questionRepo.delete(id);

    this.logger.log(
      `✅ Question ID ${id} and ${definitionsCount} definitions permanently deleted`,
    );

    return {
      success: true,
      message: `Pertanyaan "${question.sectionTitle}" untuk tahun ${question.year} berhasil dihapus permanen beserta ${definitionsCount} data terkait.`,
    };
  }

  // ========== DEFINITION SERVICES ==========
  async createOrUpdateDefinition(
    createDto: CreateKPMRPasarDefinitionDto,
    createdBy?: string,
  ): Promise<KPMRPasarDefinition> {
    this.logger.log(
      `Creating/updating definition: ${JSON.stringify(createDto)}`,
    );

    const aspect = await this.aspectRepo.findOne({
      where: {
        year: createDto.year,
        aspekNo: createDto.aspekNo,
      },
    });

    if (!aspect) {
      throw new NotFoundException(
        `Aspek dengan nomor "${createDto.aspekNo}" untuk tahun ${createDto.year} tidak ditemukan`,
      );
    }

    const question = await this.questionRepo.findOne({
      where: {
        year: createDto.year,
        aspekNo: createDto.aspekNo,
        sectionNo: createDto.sectionNo,
      },
    });

    if (!question) {
      throw new NotFoundException(
        `Pertanyaan dengan aspek ${createDto.aspekNo} dan section ${createDto.sectionNo} untuk tahun ${createDto.year} tidak ditemukan`,
      );
    }

    const existing = await this.definitionRepo.findOne({
      where: {
        year: createDto.year,
        aspekNo: createDto.aspekNo,
        sectionNo: createDto.sectionNo,
      },
    });

    if (existing) {
      existing.aspekTitle = createDto.aspekTitle;
      existing.aspekBobot = createDto.aspekBobot;
      existing.sectionTitle = createDto.sectionTitle;
      existing.level1 = createDto.level1 ?? existing.level1;
      existing.level2 = createDto.level2 ?? existing.level2;
      existing.level3 = createDto.level3 ?? existing.level3;
      existing.level4 = createDto.level4 ?? existing.level4;
      existing.level5 = createDto.level5 ?? existing.level5;
      existing.evidence = createDto.evidence ?? existing.evidence;

      if (createdBy) {
        existing.updatedBy = createdBy;
      }

      this.logger.log(`✅ Definition updated: ID ${existing.id}`);
      return await this.definitionRepo.save(existing);
    } else {
      const definitionData = {
        ...createDto,
        createdBy,
      };

      const definition = this.definitionRepo.create(definitionData);
      this.logger.log(`✅ New definition created: ID ${definition.id}`);
      return await this.definitionRepo.save(definition);
    }
  }

  async findAllDefinitions(): Promise<KPMRPasarDefinition[]> {
    return await this.definitionRepo.find({
      relations: ['question', 'scores'],
      order: { year: 'DESC', aspekNo: 'ASC', sectionNo: 'ASC' },
    });
  }

  async findDefinitionsByYear(year: number): Promise<KPMRPasarDefinition[]> {
    return await this.definitionRepo.find({
      where: { year },
      relations: ['question', 'scores'],
      order: { aspekNo: 'ASC', sectionNo: 'ASC' },
    });
  }

  async findDefinitionById(id: number): Promise<KPMRPasarDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
      relations: ['question', 'scores'],
    });

    if (!definition) {
      throw new NotFoundException(`Definition dengan ID ${id} tidak ditemukan`);
    }

    return definition;
  }

  async updateDefinition(
    id: number,
    updateDto: UpdateKPMRPasarDefinitionDto,
    updatedBy?: string,
  ): Promise<KPMRPasarDefinition> {
    const definition = await this.findDefinitionById(id);

    if (updateDto.aspekNo || updateDto.sectionNo) {
      const checkAspekNo = updateDto.aspekNo || definition.aspekNo;
      const checkSectionNo = updateDto.sectionNo || definition.sectionNo;

      const existing = await this.definitionRepo.findOne({
        where: {
          year: definition.year,
          aspekNo: checkAspekNo,
          sectionNo: checkSectionNo,
          id: Not(id),
        },
      });

      if (existing) {
        throw new ConflictException(
          `Definition dengan aspek ${checkAspekNo} dan section ${checkSectionNo} sudah ada untuk tahun ${definition.year}`,
        );
      }
    }

    Object.assign(definition, updateDto);

    if (updatedBy) {
      definition.updatedBy = updatedBy;
    }

    return await this.definitionRepo.save(definition);
  }

  async deleteDefinition(
    definitionId: number,
    year: number,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`🗑️ Deleting definition ${definitionId} for year ${year}`);

    try {
      const definition = await this.definitionRepo.findOne({
        where: { id: definitionId, year },
      });

      if (!definition) {
        this.logger.warn(
          `Definition ${definitionId} for year ${year} not found`,
        );
        return {
          success: true,
          message: 'Data sudah tidak ada',
        };
      }

      // Karena ON DELETE CASCADE, hapus definition akan otomatis hapus scores
      await this.definitionRepo.delete(definition.id);

      this.logger.log(`Deleted definition ID ${definition.id}`);

      return {
        success: true,
        message: 'Data berhasil dihapus',
      };
    } catch (error) {
      this.logger.error(`Error deleting definition: ${error.message}`);
      return {
        success: false,
        message: `Gagal menghapus: ${error.message}`,
      };
    }
  }

  // ========== SCORE SERVICES ==========
  async createOrUpdateScore(
    createDto: CreateKPMRPasarScoreDto,
    createdBy?: string,
  ): Promise<KPMRPasarScore> {
    this.logger.log(`Creating/updating score: ${JSON.stringify(createDto)}`);

    await this.validateDefinitionExists(createDto.definitionId);
    this.validateQuarter(createDto.quarter);

    const existing = await this.scoreRepo.findOne({
      where: {
        definitionId: createDto.definitionId,
        year: createDto.year,
        quarter: createDto.quarter,
      },
    });

    if (existing) {
      existing.sectionSkor = createDto.sectionSkor ?? null;

      if (createdBy) {
        existing.updatedBy = createdBy;
      }

      return await this.scoreRepo.save(existing);
    } else {
      const scoreData = {
        ...createDto,
        createdBy,
      };

      const score = this.scoreRepo.create(scoreData);
      return await this.scoreRepo.save(score);
    }
  }

  async findAllScores(): Promise<KPMRPasarScore[]> {
    return await this.scoreRepo.find({
      relations: ['definition'],
      order: { year: 'DESC', quarter: 'ASC' },
    });
  }

  async findScoresByPeriod(
    year: number,
    quarter?: string,
  ): Promise<KPMRPasarScore[]> {
    const where: any = { year };

    if (quarter) {
      this.validateQuarter(quarter);
      where.quarter = quarter;
    }

    return await this.scoreRepo.find({
      where,
      relations: ['definition'],
      order: { quarter: 'ASC' },
    });
  }

  async findScoresByDefinition(
    definitionId: number,
  ): Promise<KPMRPasarScore[]> {
    await this.validateDefinitionExists(definitionId);
    return await this.scoreRepo.find({
      where: { definitionId },
      relations: ['definition'],
      order: { quarter: 'ASC' },
    });
  }

  async findScoreById(id: number): Promise<KPMRPasarScore> {
    const score = await this.scoreRepo.findOne({
      where: { id },
      relations: ['definition'],
    });

    if (!score) {
      throw new NotFoundException(`Score dengan ID ${id} tidak ditemukan`);
    }

    return score;
  }

  async updateScore(
    id: number,
    updateDto: UpdateKPMRPasarScoreDto,
    updatedBy?: string,
  ): Promise<KPMRPasarScore> {
    const score = await this.findScoreById(id);

    if (updateDto.definitionId) {
      await this.validateDefinitionExists(updateDto.definitionId);
    }

    if (updateDto.quarter) {
      this.validateQuarter(updateDto.quarter);
    }

    Object.assign(score, updateDto);

    if (updatedBy) {
      score.updatedBy = updatedBy;
    }

    return await this.scoreRepo.save(score);
  }

  async deleteScore(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const score = await this.findScoreById(id);
    await this.scoreRepo.delete(id);
    this.logger.log(`Score ID ${id} permanently deleted`);
    return {
      success: true,
      message: 'Score berhasil dihapus permanen',
    };
  }

  async deleteScoreByTarget(
    definitionId: number,
    year: number,
    quarter: string,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `Deleting score: definitionId=${definitionId}, year=${year}, quarter=${quarter}`,
    );

    this.validateQuarter(quarter);

    const score = await this.scoreRepo.findOne({
      where: {
        definitionId,
        year,
        quarter,
      },
    });

    if (!score) {
      this.logger.warn('Score not found');
      return {
        success: true,
        message: 'Data sudah tidak ada',
      };
    }

    await this.scoreRepo.delete(score.id);
    this.logger.log(`Score ID ${score.id} permanently deleted`);

    return {
      success: true,
      message: 'Score berhasil dihapus permanen',
    };
  }

  // ========== COMPLEX QUERIES ==========
  async getKPMRFullData(year: number): Promise<any> {
    this.logger.log(`Getting full KPMR Pasar data for year: ${year}`);

    const definitions = await this.definitionRepo.find({
      where: { year },
      relations: ['scores'],
      order: { aspekNo: 'ASC', sectionNo: 'ASC' },
    });

    // PERBAIKAN: Group berdasarkan aspekNo SAJA, bukan gabungan dengan title dan bobot
    const aspekMap = new Map();

    for (const def of definitions) {
      // Gunakan aspekNo sebagai key saja
      const aspekKey = def.aspekNo;

      if (!aspekMap.has(aspekKey)) {
        aspekMap.set(aspekKey, {
          aspekNo: def.aspekNo,
          aspekTitle: def.aspekTitle,
          aspekBobot: def.aspekBobot,
          sections: [],
        });
      }

      const sectionScores = (def.scores || []).reduce(
        (acc, score) => {
          acc[score.quarter] = {
            sectionSkor: score.sectionSkor,
            id: score.id,
          };
          return acc;
        },
        {} as Record<string, any>,
      );

      aspekMap.get(aspekKey).sections.push({
        definitionId: def.id,
        sectionNo: def.sectionNo,
        sectionTitle: def.sectionTitle,
        level1: def.level1,
        level2: def.level2,
        level3: def.level3,
        level4: def.level4,
        level5: def.level5,
        evidence: def.evidence,
        scores: sectionScores,
      });
    }

    const result = Array.from(aspekMap.values());

    // Hitung quarter averages untuk setiap aspek
    for (const aspek of result) {
      const quarterAverages: Record<string, number | null> = {};
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter) => {
        const allScores = aspek.sections
          .map((s: any) => s.scores[quarter]?.sectionSkor)
          .filter((s: number) => s != null && !isNaN(s));
        quarterAverages[quarter] = allScores.length
          ? Number(
              (
                allScores.reduce((a: number, b: number) => a + b, 0) /
                allScores.length
              ).toFixed(2),
            )
          : null;
      });
      aspek.quarterAverages = quarterAverages;
    }

    // Hitung overall averages
    const overallAverages: Record<string, number | null> = {};
    ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter) => {
      const allAspectAverages = result
        .map((aspek) => aspek.quarterAverages[quarter])
        .filter((avg) => avg != null && !isNaN(avg));
      overallAverages[quarter] = allAspectAverages.length
        ? Number(
            (
              allAspectAverages.reduce((a, b) => a + b, 0) /
              allAspectAverages.length
            ).toFixed(2),
          )
        : null;
    });

    return {
      success: true,
      year,
      aspects: result,
      overallAverages,
    };
  }

  async searchKPMR(
    year?: number,
    query?: string,
    aspekNo?: string,
  ): Promise<KPMRPasarDefinition[]> {
    const qb = this.definitionRepo
      .createQueryBuilder('def')
      .leftJoinAndSelect('def.scores', 'scores')
      .leftJoinAndSelect('def.question', 'question');

    if (year) {
      qb.andWhere('def.year = :year', { year });
    }

    if (aspekNo) {
      qb.andWhere('def.aspekNo = :aspekNo', { aspekNo });
    }

    if (query) {
      qb.andWhere(
        '(def.aspekNo LIKE :query OR def.aspekTitle LIKE :query OR def.sectionNo LIKE :query OR def.sectionTitle LIKE :query OR def.evidence LIKE :query OR def.level1 LIKE :query OR def.level2 LIKE :query OR def.level3 LIKE :query OR def.level4 LIKE :query OR def.level5 LIKE :query)',
        { query: `%${query}%` },
      );
    }

    qb.orderBy('def.aspekNo', 'ASC').addOrderBy('def.sectionNo', 'ASC');

    return await qb.getMany();
  }

  async getAvailableYears(): Promise<number[]> {
    try {
      const definitionYears = await this.definitionRepo
        .createQueryBuilder('def')
        .select('DISTINCT def.year', 'year')
        .orderBy('def.year', 'DESC')
        .getRawMany();

      const scoreYears = await this.scoreRepo
        .createQueryBuilder('score')
        .select('DISTINCT score.year', 'year')
        .orderBy('score.year', 'DESC')
        .getRawMany();

      const allYears = [
        ...new Set([
          ...definitionYears.map((y) => Number(y.year)),
          ...scoreYears.map((y) => Number(y.year)),
        ]),
      ];

      return allYears.length > 0 ? allYears : [new Date().getFullYear()];
    } catch (error) {
      this.logger.error('Error getting available years:', error);
      return [new Date().getFullYear()];
    }
  }

  async getPeriods(): Promise<Array<{ year: number; quarter: string }>> {
    try {
      const periods = await this.scoreRepo
        .createQueryBuilder('score')
        .select('DISTINCT score.year', 'year')
        .addSelect('score.quarter', 'quarter')
        .orderBy('score.year', 'DESC')
        .addOrderBy('score.quarter', 'DESC')
        .getRawMany();

      return periods.map((p) => ({
        year: Number(p.year),
        quarter: p.quarter,
      }));
    } catch (error) {
      this.logger.error('Error getting periods:', error);
      return [];
    }
  }
}
