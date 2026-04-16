"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var KPMROperasionalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPMROperasionalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kpmr_operasional_definisi_entity_1 = require("./entities/kpmr-operasional-definisi.entity");
const kpmr_operasional_skor_entity_1 = require("./entities/kpmr-operasional-skor.entity");
const kpmr_operasional_aspek_entity_1 = require("./entities/kpmr-operasional-aspek.entity");
const kpmr_operasional_pertanyaan_entity_1 = require("./entities/kpmr-operasional-pertanyaan.entity");
let KPMROperasionalService = KPMROperasionalService_1 = class KPMROperasionalService {
    definitionRepo;
    scoreRepo;
    aspectRepo;
    questionRepo;
    logger = new common_1.Logger(KPMROperasionalService_1.name);
    constructor(definitionRepo, scoreRepo, aspectRepo, questionRepo) {
        this.definitionRepo = definitionRepo;
        this.scoreRepo = scoreRepo;
        this.aspectRepo = aspectRepo;
        this.questionRepo = questionRepo;
    }
    validateQuarter(quarter) {
        const validQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        if (!validQuarters.includes(quarter)) {
            throw new common_1.BadRequestException(`Quarter harus salah satu dari: ${validQuarters.join(', ')}`);
        }
    }
    async validateDefinitionExists(definitionId) {
        const definition = await this.definitionRepo.findOne({
            where: { id: definitionId },
        });
        if (!definition) {
            throw new common_1.NotFoundException(`Definition dengan ID ${definitionId} tidak ditemukan`);
        }
        return definition;
    }
    async createAspect(createDto) {
        this.logger.log(`Creating aspect for year ${createDto.year}: ${JSON.stringify(createDto)}`);
        const existing = await this.aspectRepo.findOne({
            where: { year: createDto.year, aspekNo: createDto.aspekNo },
        });
        if (existing) {
            existing.aspekTitle = createDto.aspekTitle;
            existing.aspekBobot = createDto.aspekBobot;
            return await this.aspectRepo.save(existing);
        }
        const aspect = this.aspectRepo.create(createDto);
        return await this.aspectRepo.save(aspect);
    }
    async findAllAspects(year) {
        const where = {};
        if (year)
            where.year = year;
        return await this.aspectRepo.find({
            where,
            order: { year: 'DESC', aspekNo: 'ASC' },
        });
    }
    async findAspectById(id) {
        const aspect = await this.aspectRepo.findOne({ where: { id } });
        if (!aspect)
            throw new common_1.NotFoundException(`Aspek dengan ID ${id} tidak ditemukan`);
        return aspect;
    }
    async updateAspect(id, updateDto) {
        const aspect = await this.findAspectById(id);
        Object.assign(aspect, updateDto);
        return await this.aspectRepo.save(aspect);
    }
    async deleteAspect(id) {
        const aspect = await this.aspectRepo.findOne({ where: { id } });
        if (!aspect)
            throw new common_1.NotFoundException(`Aspek dengan ID ${id} tidak ditemukan`);
        this.logger.log(`🗑️ Deleting aspect ID ${id} (${aspect.aspekNo} - ${aspect.year})`);
        await this.aspectRepo.delete(id);
        return {
            success: true,
            message: `Aspek "${aspect.aspekTitle}" untuk tahun ${aspect.year} berhasil dihapus permanen.`,
        };
    }
    async createQuestion(createDto) {
        this.logger.log(`Creating question for year ${createDto.year}: ${JSON.stringify(createDto)}`);
        if (!createDto.aspekNo || !createDto.sectionNo || !createDto.sectionTitle) {
            throw new common_1.BadRequestException('aspekNo, sectionNo, dan sectionTitle harus diisi');
        }
        const aspect = await this.aspectRepo.findOne({
            where: { year: createDto.year, aspekNo: createDto.aspekNo },
        });
        if (!aspect) {
            throw new common_1.NotFoundException(`Aspek dengan nomor "${createDto.aspekNo}" untuk tahun ${createDto.year} tidak ditemukan.`);
        }
        try {
            const question = this.questionRepo.create(createDto);
            const savedQuestion = await this.questionRepo.save(question);
            this.logger.log(`✅ Question created successfully: ID ${savedQuestion.id}`);
            return savedQuestion;
        }
        catch (error) {
            this.logger.error(`❌ Failed to create question: ${error.message}`);
            throw new common_1.BadRequestException(`Gagal membuat pertanyaan: ${error.message}`);
        }
    }
    async findAllQuestions(year) {
        const where = {};
        if (year)
            where.year = year;
        return await this.questionRepo.find({
            where,
            order: { year: 'DESC', aspekNo: 'ASC', sectionNo: 'ASC' },
        });
    }
    async findQuestionsByAspect(aspekNo, year) {
        const where = { aspekNo };
        if (year)
            where.year = year;
        return await this.questionRepo.find({
            where,
            order: { year: 'DESC', sectionNo: 'ASC' },
        });
    }
    async findQuestionById(id) {
        const question = await this.questionRepo.findOne({ where: { id } });
        if (!question)
            throw new common_1.NotFoundException(`Pertanyaan dengan ID ${id} tidak ditemukan`);
        return question;
    }
    async updateQuestion(id, updateDto) {
        const question = await this.findQuestionById(id);
        Object.assign(question, updateDto);
        return await this.questionRepo.save(question);
    }
    async deleteQuestion(id) {
        const question = await this.findQuestionById(id);
        this.logger.log(`🗑️ Deleting question ID ${id} (${question.sectionNo} - ${question.sectionTitle})`);
        const definitions = await this.definitionRepo.find({
            where: {
                year: question.year,
                aspekNo: question.aspekNo,
                sectionNo: question.sectionNo,
            },
        });
        const definitionsCount = definitions.length;
        await this.questionRepo.delete(id);
        return {
            success: true,
            message: `Pertanyaan "${question.sectionTitle}" berhasil dihapus permanen beserta ${definitionsCount} data terkait.`,
        };
    }
    async createOrUpdateDefinition(createDto, createdBy) {
        this.logger.log(`Creating/updating definition: ${JSON.stringify(createDto)}`);
        const aspect = await this.aspectRepo.findOne({
            where: { year: createDto.year, aspekNo: createDto.aspekNo },
        });
        if (!aspect)
            throw new common_1.NotFoundException(`Aspek dengan nomor "${createDto.aspekNo}" untuk tahun ${createDto.year} tidak ditemukan`);
        const question = await this.questionRepo.findOne({
            where: {
                year: createDto.year,
                aspekNo: createDto.aspekNo,
                sectionNo: createDto.sectionNo,
            },
        });
        if (!question)
            throw new common_1.NotFoundException(`Pertanyaan dengan aspek ${createDto.aspekNo} dan section ${createDto.sectionNo} tidak ditemukan`);
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
            if (createdBy)
                existing.updatedBy = createdBy;
            return await this.definitionRepo.save(existing);
        }
        else {
            const definition = this.definitionRepo.create({
                ...createDto,
                createdBy,
            });
            return await this.definitionRepo.save(definition);
        }
    }
    async findAllDefinitions() {
        return await this.definitionRepo.find({
            relations: ['question', 'scores'],
            order: { year: 'DESC', aspekNo: 'ASC', sectionNo: 'ASC' },
        });
    }
    async findDefinitionsByYear(year) {
        return await this.definitionRepo.find({
            where: { year },
            relations: ['question', 'scores'],
            order: { aspekNo: 'ASC', sectionNo: 'ASC' },
        });
    }
    async findDefinitionById(id) {
        const definition = await this.definitionRepo.findOne({
            where: { id },
            relations: ['question', 'scores'],
        });
        if (!definition)
            throw new common_1.NotFoundException(`Definition dengan ID ${id} tidak ditemukan`);
        return definition;
    }
    async updateDefinition(id, updateDto, updatedBy) {
        const definition = await this.findDefinitionById(id);
        if (updateDto.aspekNo || updateDto.sectionNo) {
            const checkAspekNo = updateDto.aspekNo || definition.aspekNo;
            const checkSectionNo = updateDto.sectionNo || definition.sectionNo;
            const existing = await this.definitionRepo.findOne({
                where: {
                    year: definition.year,
                    aspekNo: checkAspekNo,
                    sectionNo: checkSectionNo,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (existing)
                throw new common_1.ConflictException(`Definition dengan aspek ${checkAspekNo} dan section ${checkSectionNo} sudah ada`);
        }
        Object.assign(definition, updateDto);
        if (updatedBy)
            definition.updatedBy = updatedBy;
        return await this.definitionRepo.save(definition);
    }
    async deleteDefinition(definitionId, year) {
        try {
            const definition = await this.definitionRepo.findOne({
                where: { id: definitionId, year },
            });
            if (!definition)
                return { success: true, message: 'Data sudah tidak ada' };
            await this.definitionRepo.delete(definition.id);
            return { success: true, message: 'Data berhasil dihapus' };
        }
        catch (error) {
            return { success: false, message: `Gagal menghapus: ${error.message}` };
        }
    }
    async createOrUpdateScore(createDto, createdBy) {
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
            if (createdBy)
                existing.updatedBy = createdBy;
            return await this.scoreRepo.save(existing);
        }
        else {
            const score = this.scoreRepo.create({ ...createDto, createdBy });
            return await this.scoreRepo.save(score);
        }
    }
    async findAllScores() {
        return await this.scoreRepo.find({
            relations: ['definition'],
            order: { year: 'DESC', quarter: 'ASC' },
        });
    }
    async findScoresByPeriod(year, quarter) {
        const where = { year };
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
    async findScoresByDefinition(definitionId) {
        await this.validateDefinitionExists(definitionId);
        return await this.scoreRepo.find({
            where: { definitionId },
            relations: ['definition'],
            order: { quarter: 'ASC' },
        });
    }
    async findScoreById(id) {
        const score = await this.scoreRepo.findOne({
            where: { id },
            relations: ['definition'],
        });
        if (!score)
            throw new common_1.NotFoundException(`Score dengan ID ${id} tidak ditemukan`);
        return score;
    }
    async updateScore(id, updateDto, updatedBy) {
        const score = await this.findScoreById(id);
        if (updateDto.definitionId)
            await this.validateDefinitionExists(updateDto.definitionId);
        if (updateDto.quarter)
            this.validateQuarter(updateDto.quarter);
        Object.assign(score, updateDto);
        if (updatedBy)
            score.updatedBy = updatedBy;
        return await this.scoreRepo.save(score);
    }
    async deleteScore(id) {
        const score = await this.findScoreById(id);
        await this.scoreRepo.delete(id);
        return { success: true, message: 'Score berhasil dihapus permanen' };
    }
    async deleteScoreByTarget(definitionId, year, quarter) {
        this.validateQuarter(quarter);
        const score = await this.scoreRepo.findOne({
            where: { definitionId, year, quarter },
        });
        if (!score)
            return { success: true, message: 'Data sudah tidak ada' };
        await this.scoreRepo.delete(score.id);
        return { success: true, message: 'Score berhasil dihapus permanen' };
    }
    async getKPMRFullData(year) {
        this.logger.log(`Getting full KPMR Operasional data for year: ${year}`);
        const definitions = await this.definitionRepo.find({
            where: { year },
            relations: ['scores'],
            order: { aspekNo: 'ASC', sectionNo: 'ASC' },
        });
        const aspekMap = new Map();
        for (const def of definitions) {
            const aspekKey = def.aspekNo;
            if (!aspekMap.has(aspekKey)) {
                aspekMap.set(aspekKey, {
                    aspekNo: def.aspekNo,
                    aspekTitle: def.aspekTitle,
                    aspekBobot: def.aspekBobot,
                    sections: [],
                });
            }
            const sectionScores = (def.scores || []).reduce((acc, score) => {
                acc[score.quarter] = { sectionSkor: score.sectionSkor, id: score.id };
                return acc;
            }, {});
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
        for (const aspek of result) {
            const quarterAverages = {};
            ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter) => {
                const allScores = aspek.sections
                    .map((s) => s.scores[quarter]?.sectionSkor)
                    .filter((s) => s != null && !isNaN(s));
                quarterAverages[quarter] = allScores.length
                    ? Number((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2))
                    : null;
            });
            aspek.quarterAverages = quarterAverages;
        }
        const overallAverages = {};
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter) => {
            const allAspectAverages = result
                .map((aspek) => aspek.quarterAverages[quarter])
                .filter((avg) => avg != null && !isNaN(avg));
            overallAverages[quarter] = allAspectAverages.length
                ? Number((allAspectAverages.reduce((a, b) => a + b, 0) /
                    allAspectAverages.length).toFixed(2))
                : null;
        });
        return { success: true, year, aspects: result, overallAverages };
    }
    async searchKPMR(year, query, aspekNo) {
        const qb = this.definitionRepo
            .createQueryBuilder('def')
            .leftJoinAndSelect('def.scores', 'scores')
            .leftJoinAndSelect('def.question', 'question');
        if (year)
            qb.andWhere('def.year = :year', { year });
        if (aspekNo)
            qb.andWhere('def.aspekNo = :aspekNo', { aspekNo });
        if (query)
            qb.andWhere(`(def.aspekNo LIKE :query OR def.aspekTitle LIKE :query OR def.sectionNo LIKE :query OR def.sectionTitle LIKE :query OR def.evidence LIKE :query OR def.level1 LIKE :query OR def.level2 LIKE :query OR def.level3 LIKE :query OR def.level4 LIKE :query OR def.level5 LIKE :query)`, { query: `%${query}%` });
        return await qb
            .orderBy('def.aspekNo', 'ASC')
            .addOrderBy('def.sectionNo', 'ASC')
            .getMany();
    }
    async getAvailableYears() {
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
        }
        catch (error) {
            return [new Date().getFullYear()];
        }
    }
    async getPeriods() {
        try {
            const periods = await this.scoreRepo
                .createQueryBuilder('score')
                .select('DISTINCT score.year', 'year')
                .addSelect('score.quarter', 'quarter')
                .orderBy('score.year', 'DESC')
                .addOrderBy('score.quarter', 'DESC')
                .getRawMany();
            return periods.map((p) => ({ year: Number(p.year), quarter: p.quarter }));
        }
        catch (error) {
            return [];
        }
    }
};
exports.KPMROperasionalService = KPMROperasionalService;
exports.KPMROperasionalService = KPMROperasionalService = KPMROperasionalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kpmr_operasional_definisi_entity_1.KPMROperasionalDefinition)),
    __param(1, (0, typeorm_1.InjectRepository)(kpmr_operasional_skor_entity_1.KPMROperasionalScore)),
    __param(2, (0, typeorm_1.InjectRepository)(kpmr_operasional_aspek_entity_1.KPMROperasionalAspect)),
    __param(3, (0, typeorm_1.InjectRepository)(kpmr_operasional_pertanyaan_entity_1.KPMROperasionalQuestion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], KPMROperasionalService);
//# sourceMappingURL=kpmr-operasional.service.js.map