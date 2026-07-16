// src/modules/rekap-data/rekap-data.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as XLSX from 'xlsx';

// Import entities dari 8 modul
import { Investasi } from 'src/investasi/new-investasi/entities/new-investasi.entity';
import { InvestasiSection } from 'src/investasi/new-investasi/entities/new-investasi-section.entity';
import { Pasar } from 'src/pasar/pasar/entities/pasar.entity';
import { PasarSection } from 'src/pasar/pasar/entities/pasar-section.entity';
import { Likuiditas } from 'src/likuiditas/likuiditas/entities/likuiditas.entity';
import { LikuiditasSection } from 'src/likuiditas/likuiditas/entities/likuiditas-section.entity';
import { Operasional } from 'src/operasional/operasional/entities/operasional.entity';
import { OperasionalSection } from 'src/operasional/operasional/entities/operasional-section.entity';
import { Hukum } from 'src/hukum/hukum/entities/hukum.entity';
import { HukumSection } from 'src/hukum/hukum/entities/hukum-section.entity';
import { Stratejik } from 'src/stratejik/stratejik/entities/stratejik.entity';
import { StratejikSection } from 'src/stratejik/stratejik/entities/stratejik-section.entity';
import { Kepatuhan } from 'src/kepatuhan/kepatuhan/entities/kepatuhan.entity';
import { KepatuhanSection } from 'src/kepatuhan/kepatuhan/entities/kepatuhan-section.entity';
import { Reputasi } from 'src/reputasi/reputasi/entities/reputasi.entity';
import { ReputasiSection } from 'src/reputasi/reputasi/entities/reputasi-section.entity';

import {
  GetRekapDataDto,
  UpdateRekapRowDto,
  RiskSource,
  Quarter,
  RekapDataResponseDto,
} from './dto/rekap-data.dto';
import { CloneRekapDataDto } from './dto/clone-rekap-data.dto';
import { CloneHoldingKpmrDto } from './dto/clone-kpmr.dto';

// Import KPMR entities for holding
import { KPMRAspect as KpmrInvestasiAspek } from 'src/investasi/kpmr-investasi/entities/kpmr-investasi-aspek.entity';
import { KPMRQuestion as KpmrInvestasiPertanyaan } from 'src/investasi/kpmr-investasi/entities/kpmr-investasi-pertanyaan.entity';
import { KPMRDefinition as KpmrInvestasiDefinisi } from 'src/investasi/kpmr-investasi/entities/kpmr-investasi-definisi.entity';
import { KPMRScore as KpmrInvestasiSkor } from 'src/investasi/kpmr-investasi/entities/kpmr-investasi-skor.entity';

import { KPMRPasarAspect as KpmrPasarAspek } from 'src/pasar/kpmr-pasar/entities/kpmr-pasar-aspek.entity';
import { KPMRPasarQuestion as KpmrPasarPertanyaan } from 'src/pasar/kpmr-pasar/entities/kpmr-pasar-pertanyaan.entity';
import { KPMRPasarDefinition as KpmrPasarDefinisi } from 'src/pasar/kpmr-pasar/entities/kpmr-pasar-definisi.entity';
import { KPMRPasarScore as KpmrPasarSkor } from 'src/pasar/kpmr-pasar/entities/kpmr-pasar-skor.entity';

import { KPMRLikuiditasAspect as KpmrLikuiditasAspek } from 'src/likuiditas/kpmr-likuiditas/entities/kpmr-likuiditas-aspek.entity';
import { KPMRLikuiditasQuestion as KpmrLikuiditasPertanyaan } from 'src/likuiditas/kpmr-likuiditas/entities/kpmr-likuiditas-pertanyaan.entity';
import { KPMRLikuiditasDefinition as KpmrLikuiditasDefinisi } from 'src/likuiditas/kpmr-likuiditas/entities/kpmr-likuiditas-definisi.entity';
import { KPMRLikuiditasScore as KpmrLikuiditasSkor } from 'src/likuiditas/kpmr-likuiditas/entities/kpmr-likuiditas-skor.entity';

import { KPMROperasionalAspect as KpmrOperasionalAspek } from 'src/operasional/kpmr-operasional/entities/kpmr-operasional-aspek.entity';
import { KPMROperasionalQuestion as KpmrOperasionalPertanyaan } from 'src/operasional/kpmr-operasional/entities/kpmr-operasional-pertanyaan.entity';
import { KPMROperasionalDefinition as KpmrOperasionalDefinisi } from 'src/operasional/kpmr-operasional/entities/kpmr-operasional-definisi.entity';
import { KPMROperasionalScore as KpmrOperasionalSkor } from 'src/operasional/kpmr-operasional/entities/kpmr-operasional-skor.entity';

import { KPMRHukumAspect as KpmrHukumAspek } from 'src/hukum/kpmr-hukum/entities/kpmr-hukum-aspek.entity';
import { KPMRHukumQuestion as KpmrHukumPertanyaan } from 'src/hukum/kpmr-hukum/entities/kpmr-hukum-pertanyaan.entity';
import { KPMRHukumDefinition as KpmrHukumDefinisi } from 'src/hukum/kpmr-hukum/entities/kpmr-hukum-definisi.entity';
import { KPMRHukumScore as KpmrHukumSkor } from 'src/hukum/kpmr-hukum/entities/kpmr-hukum-skor.entity';

import { KPMRStratejikAspect as KpmrStratejikAspek } from 'src/stratejik/kpmr-stratejik/entities/kpmr-stratejik-aspek.entity';
import { KPMRStratejikQuestion as KpmrStratejikPertanyaan } from 'src/stratejik/kpmr-stratejik/entities/kpmr-stratejik-pertanyaan.entity';
import { KPMRStratejikDefinition as KpmrStratejikDefinisi } from 'src/stratejik/kpmr-stratejik/entities/kpmr-stratejik-definisi.entity';
import { KPMRStratejikScore as KpmrStratejikSkor } from 'src/stratejik/kpmr-stratejik/entities/kpmr-stratejik-skor.entity';

import { KPMRKepatuhanAspect as KpmrKepatuhanAspek } from 'src/kepatuhan/kpmr-kepatuhan/entities/kpmr-kepatuhan-aspek.entity';
import { KPMRKepatuhanQuestion as KpmrKepatuhanPertanyaan } from 'src/kepatuhan/kpmr-kepatuhan/entities/kpmr-kepatuhan-pertanyaan.entity';
import { KPMRKepatuhanDefinition as KpmrKepatuhanDefinisi } from 'src/kepatuhan/kpmr-kepatuhan/entities/kpmr-kepatuhan-definisi.entity';
import { KPMRKepatuhanScore as KpmrKepatuhanSkor } from 'src/kepatuhan/kpmr-kepatuhan/entities/kpmr-kepatuhan-skor.entity';

import { KPMRReputasiAspect as KpmrReputasiAspek } from 'src/reputasi/kpmr-reputasi/entities/kpmr-reputasi-aspek.entity';
import { KPMRReputasiQuestion as KpmrReputasiPertanyaan } from 'src/reputasi/kpmr-reputasi/entities/kpmr-reputasi-pertanyaan.entity';
import { KPMRReputasiDefinition as KpmrReputasiDefinisi } from 'src/reputasi/kpmr-reputasi/entities/kpmr-reputasi-definisi.entity';
import { KPMRReputasiScore as KpmrReputasiSkor } from 'src/reputasi/kpmr-reputasi/entities/kpmr-reputasi-skor.entity';

// Interface untuk row Excel
interface ExcelRow {
  source?: string;
  Source?: string;
  no?: string;
  No?: string;
  subNo?: string;
  'Sub No'?: string;
  sectionLabel?: string;
  Section?: string;
  indikator?: string;
  Indikator?: string;
  numeratorLabel?: string;
  'Pembilang Label'?: string;
  numeratorValue?: string | number;
  Pembilang?: string | number;
  pembilangLabel?: string;
  pembilangValue?: string | number;
  denominatorLabel?: string;
  'Penyebut Label'?: string;
  denominatorValue?: string | number;
  Penyebut?: string | number;
  penyebutLabel?: string;
  penyebutValue?: string | number;
  isPercent?: string | boolean;
  '%'?: string;
  mode?: string;
  formula?: string;
  hasilText?: string;
  'Hasil Text'?: string;
  low?: string;
  lowToModerate?: string;
  moderate?: string;
  moderateToHigh?: string;
  high?: string;
  bobotSection?: string | number;
  bobotIndikator?: string | number;
  sumberRisiko?: string;
  dampak?: string;
  keterangan?: string;
  [key: string]: any;
}

@Injectable()
export class RekapDataService {
  constructor(
    // Investasi
    @InjectRepository(Investasi)
    private readonly investasiRepo: Repository<Investasi>,
    @InjectRepository(InvestasiSection)
    private readonly investasiSectionRepo: Repository<InvestasiSection>,

    // Pasar
    @InjectRepository(Pasar)
    private readonly pasarRepo: Repository<Pasar>,
    @InjectRepository(PasarSection)
    private readonly pasarSectionRepo: Repository<PasarSection>,

    // Likuiditas
    @InjectRepository(Likuiditas)
    private readonly likuiditasRepo: Repository<Likuiditas>,
    @InjectRepository(LikuiditasSection)
    private readonly likuiditasSectionRepo: Repository<LikuiditasSection>,

    // Operasional
    @InjectRepository(Operasional)
    private readonly operasionalRepo: Repository<Operasional>,
    @InjectRepository(OperasionalSection)
    private readonly operasionalSectionRepo: Repository<OperasionalSection>,

    // Hukum
    @InjectRepository(Hukum)
    private readonly hukumRepo: Repository<Hukum>,
    @InjectRepository(HukumSection)
    private readonly hukumSectionRepo: Repository<HukumSection>,

    // Stratejik
    @InjectRepository(Stratejik)
    private readonly stratejikRepo: Repository<Stratejik>,
    @InjectRepository(StratejikSection)
    private readonly stratejikSectionRepo: Repository<StratejikSection>,

    // Kepatuhan
    @InjectRepository(Kepatuhan)
    private readonly kepatuhanRepo: Repository<Kepatuhan>,
    @InjectRepository(KepatuhanSection)
    private readonly kepatuhanSectionRepo: Repository<KepatuhanSection>,

    // Reputasi
    @InjectRepository(Reputasi)
    private readonly reputasiRepo: Repository<Reputasi>,
    @InjectRepository(ReputasiSection)
    private readonly reputasiSectionRepo: Repository<ReputasiSection>,
    private readonly dataSource: DataSource,
  ) {}

  // ===================== MAPPING RELATION NAME =====================
  private getRelationName(source: RiskSource): string {
    const relationMap: Record<RiskSource, string> = {
      [RiskSource.INVESTASI]: 'investasiIndicators',
      [RiskSource.PASAR]: 'pasarIndicators',
      [RiskSource.LIKUIDITAS]: 'likuiditasIndicators',
      [RiskSource.OPERASIONAL]: 'operasionalIndicators',
      [RiskSource.HUKUM]: 'hukumIndicators',
      [RiskSource.STRATEJIK]: 'stratejikIndicators',
      [RiskSource.KEPATUHAN]: 'kepatuhanIndicators',
      [RiskSource.REPUTASI]: 'reputasiIndicators',
    };
    return relationMap[source];
  }

  // ===================== GET SECTION REPOSITORY =====================
  private getSectionRepository(source: RiskSource): Repository<any> | null {
    const repoMap: Record<RiskSource, Repository<any>> = {
      [RiskSource.INVESTASI]: this.investasiSectionRepo,
      [RiskSource.PASAR]: this.pasarSectionRepo,
      [RiskSource.LIKUIDITAS]: this.likuiditasSectionRepo,
      [RiskSource.OPERASIONAL]: this.operasionalSectionRepo,
      [RiskSource.HUKUM]: this.hukumSectionRepo,
      [RiskSource.STRATEJIK]: this.stratejikSectionRepo,
      [RiskSource.KEPATUHAN]: this.kepatuhanSectionRepo,
      [RiskSource.REPUTASI]: this.reputasiSectionRepo,
    };
    return repoMap[source] || null;
  }

  // ===================== GET INDICATOR REPOSITORY =====================
  private getIndicatorRepository(source: RiskSource): Repository<any> | null {
    const repoMap: Record<RiskSource, Repository<any>> = {
      [RiskSource.INVESTASI]: this.investasiRepo,
      [RiskSource.PASAR]: this.pasarRepo,
      [RiskSource.LIKUIDITAS]: this.likuiditasRepo,
      [RiskSource.OPERASIONAL]: this.operasionalRepo,
      [RiskSource.HUKUM]: this.hukumRepo,
      [RiskSource.STRATEJIK]: this.stratejikRepo,
      [RiskSource.KEPATUHAN]: this.kepatuhanRepo,
      [RiskSource.REPUTASI]: this.reputasiRepo,
    };
    return repoMap[source] || null;
  }

  // ===================== GET ALL TRIWULAN DATA =====================
  async getAllTriwulanData(
    dto: GetRekapDataDto,
  ): Promise<RekapDataResponseDto> {
    const { year, quarter } = dto;

    const [
      investasiRows,
      pasarRows,
      likuiditasRows,
      operasionalRows,
      hukumRows,
      stratejikRows,
      kepatuhanRows,
      reputasiRows,
      operasionalSections,
      hukumSections,
      stratejikSections,
      kepatuhanSections,
      reputasiSections,
    ] = await Promise.all([
      this.getFlatRows(this.investasiRepo, year, quarter),
      this.getFlatRows(this.pasarRepo, year, quarter),
      this.getFlatRows(this.likuiditasRepo, year, quarter),
      this.getFlatRows(this.operasionalRepo, year, quarter),
      this.getFlatRows(this.hukumRepo, year, quarter),
      this.getFlatRows(this.stratejikRepo, year, quarter),
      this.getFlatRows(this.kepatuhanRepo, year, quarter),
      this.getFlatRows(this.reputasiRepo, year, quarter),
      this.getSectionsData(RiskSource.OPERASIONAL, year, quarter),
      this.getSectionsData(RiskSource.HUKUM, year, quarter),
      this.getSectionsData(RiskSource.STRATEJIK, year, quarter),
      this.getSectionsData(RiskSource.KEPATUHAN, year, quarter),
      this.getSectionsData(RiskSource.REPUTASI, year, quarter),
    ]);

    return {
      investasiRows,
      pasarRows,
      likuiditasRows,
      operasionalRows,
      hukumRows,
      stratejikRows,
      kepatuhanRows,
      reputasiRows,
      operasionalSections,
      hukumSections,
      stratejikSections,
      kepatuhanSections,
      reputasiSections,
    };
  }

  // ===================== GET ALL TAHUNAN DATA =====================
  async getAllTahunanData(year: number): Promise<any> {
    const quarters = [Quarter.Q1, Quarter.Q2, Quarter.Q3, Quarter.Q4];

    const results = await Promise.all(
      quarters.map(async (quarter) => {
        const data = await this.getAllTriwulanData({ year, quarter });
        return { quarter, data };
      }),
    );

    const merged: any = {
      investasiRows: [],
      pasarRows: [],
      likuiditasRows: [],
      operasionalRows: [],
      hukumRows: [],
      stratejikRows: [],
      kepatuhanRows: [],
      reputasiRows: [],
    };

    results.forEach(({ quarter, data }) => {
      Object.keys(merged).forEach((key) => {
        if (data[key]) {
          const rowsWithQuarter = data[key].map((row: any) => ({
            ...row,
            quarter,
          }));
          merged[key] = [...merged[key], ...rowsWithQuarter];
        }
      });
    });

    return merged;
  }

  // ===================== GET FLAT ROWS =====================
  private async getFlatRows(
    repo: Repository<any>,
    year: number,
    quarter: string,
  ): Promise<any[]> {
    const rows = await repo.find({
      where: {
        year,
        quarter,
        isDeleted: false, // ✅ FILTER SOFT DELETE
      },
      order: { no: 'ASC', subNo: 'ASC' },
    });

    return rows.map((row) => this.normalizeFlatRow(row));
  }

  // ===================== GET SECTIONS DATA =====================
  private async getSectionsData(
    source: RiskSource,
    year: number,
    quarter: string,
  ): Promise<any[]> {
    let sectionRepo: Repository<any> | null = null;

    switch (source) {
      case RiskSource.OPERASIONAL:
        sectionRepo = this.operasionalSectionRepo;
        break;
      case RiskSource.HUKUM:
        sectionRepo = this.hukumSectionRepo;
        break;
      case RiskSource.STRATEJIK:
        sectionRepo = this.stratejikSectionRepo;
        break;
      case RiskSource.KEPATUHAN:
        sectionRepo = this.kepatuhanSectionRepo;
        break;
      case RiskSource.REPUTASI:
        sectionRepo = this.reputasiSectionRepo;
        break;
      default:
        return []; // Investasi, Pasar, Likuiditas tidak punya section
    }

    const relationName = this.getRelationName(source);

    const sections = await sectionRepo.find({
      where: {
        year,
        quarter,
        isDeleted: false, // ✅ FILTER SECTION YANG DI-SOFT-DELETE
      },
      relations: [relationName],
      order: { sortOrder: 'ASC' },
    });

    return sections.map((section) => ({
      ...section,
      indicators: (section[relationName] || [])
        .filter((ind: any) => !ind.isDeleted) // ✅ FILTER INDICATORS YANG DI-SOFT-DELETE
        .map((ind: any) => this.normalizeFlatRow(ind)),
    }));
  }

  // ===================== NORMALIZE FLAT ROW =====================
  private normalizeFlatRow(row: any): any {
    return {
      id: row.id,
      year: row.year,
      quarter: row.quarter,
      no: row.no,
      subNo: row.subNo,
      sectionLabel: row.sectionLabel || row.parameter,
      indikator: row.indikator,
      numeratorLabel: row.pembilangLabel || row.numeratorLabel,
      numeratorValue: row.pembilangValue ?? row.numeratorValue ?? null,
      pembilangLabel: row.pembilangLabel || '',
      pembilangValue: row.pembilangValue ?? null,
      denominatorLabel: row.penyebutLabel || row.denominatorLabel,
      denominatorValue: row.penyebutValue ?? row.denominatorValue ?? null,
      penyebutLabel: row.penyebutLabel || '',
      penyebutValue: row.penyebutValue ?? null,
      isPercent: row.isPercent ?? false,
      mode: row.mode ?? 'RASIO',
      formula: row.formula || '',
      hasil: row.hasil ?? null,
      hasilText: row.hasilText || '',
      low: row.low || '',
      lowToModerate: row.lowToModerate || '',
      moderate: row.moderate || '',
      moderateToHigh: row.moderateToHigh || '',
      high: row.high || '',
      peringkat: row.peringkat ?? 0,
      weighted: row.weighted ?? 0,
      bobotSection: row.bobotSection ?? 0,
      bobotIndikator: row.bobotIndikator ?? 0,
      sumberRisiko: row.sumberRisiko || '',
      dampak: row.dampak || '',
      keterangan: row.keterangan || '',
    };
  }

  // ===================== UPDATE ROW =====================
  async updateRow(dto: UpdateRekapRowDto): Promise<any> {
    const { source, year, quarter, rowKey, field, value } = dto;

    const parts = rowKey.split('|');
    const no = parts[3] || '';
    const subNo = parts[4] || '';
    const sectionLabel = parts[5] || '';
    const indikator = parts[6] || '';

    const repo = this.getRepository(source);

    const row = await repo.findOne({
      where: {
        year,
        quarter,
        no,
        subNo,
        sectionLabel,
        indikator,
        isDeleted: false, // ✅ HANYA UPDATE DATA YANG TIDAK DI-SOFT-DELETE
      },
    });

    if (!row) {
      throw new Error('Row not found');
    }

    row[field] = value;

    if (field === 'numeratorValue') {
      row.pembilangValue = value;
    }
    if (field === 'denominatorValue') {
      row.penyebutValue = value;
    }

    if (
      ['numeratorValue', 'denominatorValue', 'formula', 'hasilText'].includes(
        field,
      )
    ) {
      row.hasil = this.computeHasil(row);
      row.peringkat = this.computePeringkat(row);
      if (row.bobotIndikator) {
        row.weighted = ((row.bobotSection || 0) * row.bobotIndikator * row.peringkat) / 10000;
      }
    }

    await repo.save(row);

    return this.normalizeFlatRow(row);
  }

  // ===================== GET REPOSITORY BY SOURCE =====================
  private getRepository(source: RiskSource): Repository<any> {
    const repoMap: Record<RiskSource, Repository<any>> = {
      [RiskSource.INVESTASI]: this.investasiRepo,
      [RiskSource.PASAR]: this.pasarRepo,
      [RiskSource.LIKUIDITAS]: this.likuiditasRepo,
      [RiskSource.OPERASIONAL]: this.operasionalRepo,
      [RiskSource.HUKUM]: this.hukumRepo,
      [RiskSource.STRATEJIK]: this.stratejikRepo,
      [RiskSource.KEPATUHAN]: this.kepatuhanRepo,
      [RiskSource.REPUTASI]: this.reputasiRepo,
    };
    return repoMap[source];
  }

  // ===================== COMPUTE HASIL =====================
  private computeHasil(row: any): number | null {
    const mode = row.mode || 'RASIO';

    if (mode === 'TEKS') {
      return null;
    }

    const pemb = parseFloat(row.pembilangValue || row.numeratorValue || '0');
    const peny = parseFloat(row.penyebutValue || row.denominatorValue || '0');

    if (mode === 'NILAI_TUNGGAL' || mode === 'NILAI_TUNGGAL_PENY') {
      return pemb || peny || null;
    }

    if (!pemb || !peny || peny === 0) {
      return null;
    }

    if (row.formula) {
      try {
        const formula = row.formula
          .replace(/pemb/g, String(pemb))
          .replace(/peny/g, String(peny));
        const result = eval(formula);
        return Number(result);
      } catch {
        // Fallback
      }
    }

    return pemb / peny;
  }

  // ===================== COMPUTE PERINGKAT =====================
  private parseNumber(str: string): number {
    const cleaned = str.replace('%', '').replace(',', '.');
    return parseFloat(cleaned);
  }

  private evaluateRiskCondition(hasilPercent: number, condition: string): boolean {
    if (hasilPercent === null || hasilPercent === undefined) return false;
    if (!condition || typeof condition !== 'string') return false;

    try {
      let normalized = condition.replace(/\s+/g, '');
      normalized = normalized
        .replace(/≥/g, '>=')
        .replace(/≤/g, '<=')
        .replace(/＞/g, '>')
        .replace(/＜/g, '<')
        .replace(/＝/g, '=');

      // Pattern 1: REVERSED RANGE "20% >= x > 17.5%" or "0 >= x > -3%"
      const reversedRangePattern = /^(-?[\d.,]+)%?([><=]+)x([><=]+)(-?[\d.,]+)%?$/;
      const reversedMatch = normalized.match(reversedRangePattern);

      if (reversedMatch) {
        const upperBound = this.parseNumber(reversedMatch[1]);
        const upperOp = reversedMatch[2];
        const lowerOp = reversedMatch[3];
        const lowerBound = this.parseNumber(reversedMatch[4]);

        if (upperBound > lowerBound || (upperBound >= 0 && lowerBound < 0)) {
          let upperCheck = false;
          let lowerCheck = false;

          if (upperOp === '>=') upperCheck = hasilPercent <= upperBound;
          else if (upperOp === '>') upperCheck = hasilPercent < upperBound;
          else if (upperOp === '<=') upperCheck = hasilPercent >= upperBound;
          else if (upperOp === '<') upperCheck = hasilPercent > upperBound;

          if (lowerOp === '>') lowerCheck = hasilPercent > lowerBound;
          else if (lowerOp === '>=') lowerCheck = hasilPercent >= lowerBound;
          else if (lowerOp === '<') lowerCheck = hasilPercent < lowerBound;
          else if (lowerOp === '<=') lowerCheck = hasilPercent <= lowerBound;

          return upperCheck && lowerCheck;
        }
      }

      // Pattern 2: NORMAL RANGE "1% < x <= 2%" or "-5% < x < -3%"
      const normalRangePattern = /^(-?[\d.,]+)%?([<>=]+)x([<>=]+)(-?[\d.,]+)%?$/;
      const normalMatch = normalized.match(normalRangePattern);

      if (normalMatch) {
        const lowerBound = this.parseNumber(normalMatch[1]);
        const lowerOp = normalMatch[2];
        const upperOp = normalMatch[3];
        const upperBound = this.parseNumber(normalMatch[4]);

        if (lowerBound < upperBound) {
          let lowerCheck = false;
          let upperCheck = false;

          if (lowerOp === '<') lowerCheck = lowerBound < hasilPercent;
          else if (lowerOp === '<=') lowerCheck = lowerBound <= hasilPercent;

          if (upperOp === '<') upperCheck = hasilPercent < upperBound;
          else if (upperOp === '<=') upperCheck = hasilPercent <= upperBound;

          return lowerCheck && upperCheck;
        }
      }

      // Pattern 3: SINGLE COMPARISON (x first) "x > 15%" or "x < -7%"
      const singleXFirstPattern = /^x([><=]+)(-?[\d.,]+)%?$/;
      const singleXFirstMatch = normalized.match(singleXFirstPattern);

      if (singleXFirstMatch) {
        const operator = singleXFirstMatch[1];
        const threshold = this.parseNumber(singleXFirstMatch[2]);
        let result = false;
        if (operator === '>') result = hasilPercent > threshold;
        else if (operator === '<') result = hasilPercent < threshold;
        else if (operator === '>=') result = hasilPercent >= threshold;
        else if (operator === '<=') result = hasilPercent <= threshold;
        else if (operator === '=' || operator === '==') result = Math.abs(hasilPercent - threshold) < 0.0001;
        return result;
      }

      // Pattern 4: SINGLE COMPARISON (value first - REVERSED) "15% < x" or "-7% > x"
      const singleValueFirstPattern = /^(-?[\d.,]+)%?([><=]+)x$/;
      const singleValueFirstMatch = normalized.match(singleValueFirstPattern);

      if (singleValueFirstMatch) {
        const threshold = this.parseNumber(singleValueFirstMatch[1]);
        const operator = singleValueFirstMatch[2];
        let result = false;
        if (operator === '>') result = hasilPercent < threshold;
        else if (operator === '<') result = hasilPercent > threshold;
        else if (operator === '>=') result = hasilPercent <= threshold;
        else if (operator === '<=') result = hasilPercent >= threshold;
        else if (operator === '=' || operator === '==') result = Math.abs(hasilPercent - threshold) < 0.0001;
        return result;
      }

      return false;
    } catch (err) {
      console.error('[EVAL] ✗ ERROR:', err);
      return false;
    }
  }

  private isPercentRiskLevels(row: any): boolean {
    const levelKeys = ['low', 'lowToModerate', 'moderate', 'moderateToHigh', 'high'];
    for (const key of levelKeys) {
      const value = row[key];
      if (value && typeof value === 'string' && value.includes('%')) {
        return true;
      }
    }
    return false;
  }

  // ===================== COMPUTE PERINGKAT =====================
  private computePeringkat(row: any): number {
    const hasil = row.hasil;
    if (hasil === null || hasil === undefined) return 0;

    const vRaw = Number(hasil);
    if (!isFinite(vRaw) || isNaN(vRaw)) return 0;

    const usesPercentageFormat = this.isPercentRiskLevels(row);

    let hasilPercent: number;
    if (usesPercentageFormat) {
      if (row.mode === 'TEKS' || row.mode === 'KUALITATIF') {
        hasilPercent = vRaw;
      } else {
        if (vRaw < 0) {
          hasilPercent = vRaw;
        } else {
          hasilPercent = vRaw * 100;
        }
      }
    } else {
      hasilPercent = vRaw;
    }

    const riskFields = ['low', 'lowToModerate', 'moderate', 'moderateToHigh', 'high'];

    for (let i = riskFields.length - 1; i >= 0; i--) {
      const field = riskFields[i];
      const condition = row[field];

      if (!condition || String(condition).trim() === '') continue;

      const conditionMet = this.evaluateRiskCondition(hasilPercent, String(condition).trim());
      if (conditionMet) {
        return i + 1;
      }
    }

    // Fallback
    if (hasilPercent <= 0) return 1;
    if (hasilPercent <= 5) return 1;
    if (hasilPercent <= 10) return 2;
    if (hasilPercent <= 15) return 3;
    if (hasilPercent <= 20) return 4;
    return 5;
  }

  // ===================== PARSE EXCEL NUMBER HELPER =====================
  private parseExcelNumber(v: any): number | null {
    if (v === undefined || v === null || String(v).trim() === '') {
      return null;
    }
    if (typeof v === 'number') {
      return isNaN(v) || !isFinite(v) ? null : v;
    }
    let s = String(v).trim().replace(/%/g, '').replace(/\s+/g, '');
    
    // Handle Indonesian formatting e.g. "1.250,50" -> "1250.50"
    if (s.includes('.') && s.includes(',')) {
      const lastComma = s.lastIndexOf(',');
      const lastDot = s.lastIndexOf('.');
      if (lastComma > lastDot) {
        s = s.replace(/\./g, '').replace(',', '.');
      } else {
        s = s.replace(/,/g, '');
      }
    } else if (s.includes(',') && !s.includes('.')) {
      const parts = s.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        s = s.replace(',', '.');
      } else {
        s = s.replace(/,/g, '');
      }
    }
    
    const parsed = parseFloat(s);
    return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
  }

  // ===================== IMPORT EXCEL =====================
  async importExcel(
    file: { buffer: Buffer },
    year: number,
    quarter: string,
  ): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    if (jsonData.length < 2) {
      throw new BadRequestException('File Excel tidak valid: tidak ada data');
    }

    const headers = jsonData[0];
    const qLabel = { Q1: 'MAR', Q2: 'JUN', Q3: 'SEP', Q4: 'DES' }[quarter];
    const targetHeaderPattern = `${qLabel} ${year}`.toUpperCase();

    // Find the correct value column index based on the header
    let valueColIdx = 4; // Default to index 4 (first data column)
    for (let c = 4; c < headers.length; c++) {
      const h = String(headers[c] || '').toUpperCase().trim();
      if (h.includes(targetHeaderPattern)) {
        valueColIdx = c;
        break;
      }
    }

    let currentSource = '';
    let currentSection = '';
    let totalUpdated = 0;

    const results: any = {
      investasiRows: [],
      pasarRows: [],
      likuiditasRows: [],
      operasionalRows: [],
      hukumRows: [],
      stratejikRows: [],
      kepatuhanRows: [],
      reputasiRows: [],
    };

    let i = 1;
    while (i < jsonData.length) {
      const row = jsonData[i];
      if (!row || row.length === 0) {
        i++;
        continue;
      }

      const col0 = row[0]; // Source
      const col1 = row[1]; // Section
      const col2 = row[2]; // Indikator
      const col3 = row[3]; // Mode

      const isCol0Empty = col0 === undefined || col0 === null || String(col0).trim() === '';
      const isCol1Empty = col1 === undefined || col1 === null || String(col1).trim() === '';
      const isCol2Empty = col2 === undefined || col2 === null || String(col2).trim() === '';
      const isCol3Empty = col3 === undefined || col3 === null || String(col3).trim() === '';

      if (isCol0Empty && isCol1Empty && isCol2Empty) {
        i++;
        continue;
      }

      // Skip detail rows at the top level
      if (isCol0Empty && isCol1Empty && !isCol2Empty && isCol3Empty) {
        i++;
        continue;
      }

      // Track merged cells
      if (!isCol0Empty) {
        currentSource = String(col0).trim().toUpperCase();
      }
      if (!isCol1Empty) {
        currentSection = String(col1).trim();
      }

      const indikatorLabel = String(col2 || '').trim();
      const mode = String(col3 || '').trim().toUpperCase();

      if (!currentSource || !currentSection || !indikatorLabel) {
        i++;
        continue;
      }

      // Gather detail rows for the current indicator
      const detailRows: any[] = [];
      let scanIdx = i + 1;
      while (scanIdx < jsonData.length) {
        const nextRow = jsonData[scanIdx];
        if (!nextRow) break;
        
        const nextCol0 = nextRow[0];
        const nextCol1 = nextRow[1];
        const nextCol2 = nextRow[2];
        const nextCol3 = nextRow[3];

        const nextCol0Empty = nextCol0 === undefined || nextCol0 === null || String(nextCol0).trim() === '';
        const nextCol1Empty = nextCol1 === undefined || nextCol1 === null || String(nextCol1).trim() === '';
        const nextCol2NotEmpty = nextCol2 !== undefined && nextCol2 !== null && String(nextCol2).trim() !== '';
        const nextCol3Empty = nextCol3 === undefined || nextCol3 === null || String(nextCol3).trim() === '';

        if (nextCol0Empty && nextCol1Empty && nextCol2NotEmpty && nextCol3Empty) {
          detailRows.push(nextRow);
          scanIdx++;
        } else {
          break;
        }
      }

      const rowsToSkip = 1 + detailRows.length;
      const repo = this.getRepository(currentSource as RiskSource);

      if (!repo) {
        i += rowsToSkip;
        continue;
      }

      // Find the existing row in the database
      const existingRow = await repo.findOne({
        where: {
          year,
          quarter: quarter as any,
          sectionLabel: currentSection,
          indikator: indikatorLabel,
          isDeleted: false,
        },
      });

      if (existingRow) {
        const rowMode = existingRow.mode || 'RASIO';

        if (rowMode === 'TEKS' || rowMode === 'KUALITATIF') {
          const rawVal = row[valueColIdx];
          existingRow.hasilText = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : '';
          existingRow.hasil = null;
        } else {
          let newPembilang: number | null = null;
          let newPenyebut: number | null = null;

          if (rowMode === 'RASIO') {
            if (detailRows.length >= 2) {
              newPembilang = this.parseExcelNumber(detailRows[0][valueColIdx]);
              newPenyebut = this.parseExcelNumber(detailRows[1][valueColIdx]);
            } else if (detailRows.length === 1) {
              const label = String(detailRows[0][2] || '').toLowerCase();
              const val = this.parseExcelNumber(detailRows[0][valueColIdx]);
              if (label.includes('pembilang') || label.includes('numerator')) {
                newPembilang = val;
              } else {
                newPenyebut = val;
              }
            }
          } else if (rowMode === 'NILAI_TUNGGAL' || rowMode === 'NILAI_TUNGGAL_PENY') {
            if (detailRows.length >= 1) {
              const val = this.parseExcelNumber(detailRows[0][valueColIdx]);
              const label = String(detailRows[0][2] || '').toLowerCase();
              if (label.includes('pembilang') || label.includes('numerator')) {
                newPembilang = val;
              } else {
                newPenyebut = val;
              }
            } else {
              newPembilang = this.parseExcelNumber(row[valueColIdx]);
            }
          }

          existingRow.pembilangValue = newPembilang;
          existingRow.numeratorValue = newPembilang;
          existingRow.penyebutValue = newPenyebut;
          existingRow.denominatorValue = newPenyebut;

          // Recompute hasil
          existingRow.hasil = this.computeHasil(existingRow);
        }

        // Recompute peringkat & weighted score
        existingRow.peringkat = this.computePeringkat(existingRow);
        if (existingRow.bobotIndikator) {
          existingRow.weighted = ((existingRow.bobotSection || 0) * existingRow.bobotIndikator * existingRow.peringkat) / 10000;
        }

        // Save back to database
        const saved = await repo.save(existingRow);
        
        // Push normalized row for response Compatibility
        const normalized = this.normalizeFlatRow(saved);
        const sourceLower = currentSource.toLowerCase();
        if (results[`${sourceLower}Rows`]) {
          results[`${sourceLower}Rows`].push(normalized);
        }
        totalUpdated++;
      } else {
        console.warn(`[IMPORT] No matching database record found for: ${currentSource} | ${currentSection} | ${indikatorLabel}`);
      }

      i += rowsToSkip;
    }

    return {
      totalImported: totalUpdated,
      ...results,
    };
  }

  // ===================== CLEANUP DUPLICATES =====================
  async cleanupDuplicates(
    year: number,
    quarter: string,
  ): Promise<{ removed: number }> {
    let totalRemoved = 0;
    const sources = Object.values(RiskSource);

    for (const source of sources) {
      const repo = this.getRepository(source);

      const rows = await repo.find({
        where: {
          year,
          quarter,
          isDeleted: false, // ✅ HANYA PROSES DATA YANG TIDAK DI-SOFT-DELETE
        },
        order: { no: 'ASC', subNo: 'ASC' },
      });

      const seen = new Map<string, any>();
      const duplicates: number[] = [];

      rows.forEach((row: any) => {
        const key = `${row.no}-${row.subNo}-${row.sectionLabel}-${row.indikator}`;

        if (seen.has(key)) {
          const existing = seen.get(key);
          const existingScore =
            (existing.pembilangValue ? 2 : 0) +
            (existing.penyebutValue ? 1 : 0);
          const currentScore =
            (row.pembilangValue ? 2 : 0) + (row.penyebutValue ? 1 : 0);

          if (currentScore > existingScore) {
            duplicates.push(existing.id);
            seen.set(key, row);
          } else {
            duplicates.push(row.id);
          }
        } else {
          seen.set(key, row);
        }
      });

      if (duplicates.length > 0) {
        // Soft delete duplicates (set isDeleted = true)
        await repo.update(duplicates, { isDeleted: true });
        totalRemoved += duplicates.length;
      }
    }

    return { removed: totalRemoved };
  }

  // ===================== RESET PERIOD DATA =====================
  async resetPeriodData(
    year: number,
    quarter: string,
    source: RiskSource,
  ): Promise<{ success: boolean; message: string }> {
    const indRepo = this.getIndicatorRepository(source);
    const secRepo = this.getSectionRepository(source);

    if (indRepo) {
      await indRepo.delete({ year, quarter: quarter as any });
    }
    if (secRepo) {
      await secRepo.delete({ year, quarter: quarter as any });
    }

    return {
      success: true,
      message: `Data untuk periode ${year} ${quarter} berhasil di-reset.`,
    };
  }

  // ===================== GET SECTIONS FOR FILTER =====================
  async getSections(
    source: RiskSource,
    year: number,
    quarter: string,
  ): Promise<string[]> {
    const repo = this.getRepository(source);

    const rows = await repo
      .createQueryBuilder('row')
      .select('DISTINCT row.sectionLabel', 'sectionLabel')
      .where('row.year = :year', { year })
      .andWhere('row.quarter = :quarter', { quarter })
      .andWhere('row.isDeleted = :isDeleted', { isDeleted: false }) // ✅ FILTER SOFT DELETE
      .getRawMany<{ sectionLabel: string }>();

    return rows.map((r) => r.sectionLabel).filter(Boolean);
  }

  // ===================== CLONE PERIOD DATA =====================
  async clonePeriodData(
    dto: CloneRekapDataDto,
    createdBy?: string,
  ): Promise<{ success: boolean; sectionsCloned: number; indicatorsCloned: number }> {
    const { sourceYear, sourceQuarter, targetYear, targetQuarter, overrideExisting = false, source, sources } = dto;

    if (sourceYear === targetYear && sourceQuarter === targetQuarter) {
      throw new BadRequestException('Periode asal dan periode tujuan tidak boleh sama.');
    }

    let activeSources: RiskSource[] = [];
    if (sources && sources.length > 0) {
      activeSources = sources;
    } else if (source) {
      activeSources = [source];
    } else {
      activeSources = Object.values(RiskSource);
    }

    const hasData = await this.checkDataExists(targetYear, targetQuarter, activeSources);
    if (hasData && !overrideExisting) {
      throw new BadRequestException(
        `Data untuk periode tujuan ${targetYear} ${targetQuarter} sudah ada. Gunakan opsi 'overrideExisting' untuk menimpa.`,
      );
    }

    // Jika override, hapus data existing di target terlebih dahulu
    if (overrideExisting) {
      for (const src of activeSources) {
        const indRepo = this.getIndicatorRepository(src);
        const secRepo = this.getSectionRepository(src);
        if (indRepo) {
          await indRepo.delete({ year: targetYear, quarter: targetQuarter as any });
        }
        if (secRepo) {
          await secRepo.delete({ year: targetYear, quarter: targetQuarter as any });
        }
      }
    }

    let totalSectionsCloned = 0;
    let totalIndicatorsCloned = 0;

    for (const src of activeSources) {
      const sectionRepo = this.getSectionRepository(src);
      const indicatorRepo = this.getIndicatorRepository(src);
      if (!sectionRepo || !indicatorRepo) continue;

      const res = await this.cloneModulePeriod(
        src,
        sectionRepo,
        indicatorRepo,
        sourceYear,
        sourceQuarter,
        targetYear,
        targetQuarter,
        createdBy,
      );

      totalSectionsCloned += res.sectionsCloned;
      totalIndicatorsCloned += res.indicatorsCloned;
    }

    return {
      success: true,
      sectionsCloned: totalSectionsCloned,
      indicatorsCloned: totalIndicatorsCloned,
    };
  }

  // Helper untuk mengecek apakah data di target periode sudah ada
  private async checkDataExists(year: number, quarter: string, activeSources: RiskSource[]): Promise<boolean> {
    for (const src of activeSources) {
      const indRepo = this.getIndicatorRepository(src);
      const secRepo = this.getSectionRepository(src);

      if (indRepo) {
        // Cek data indikator (baik yang aktif maupun soft-deleted karena unique constraint tetap berlaku)
        const count = await indRepo.count({
          where: { year, quarter: quarter as any },
        });
        if (count > 0) return true;
      }

      if (secRepo) {
        // Cek data section (baik yang aktif maupun soft-deleted karena unique constraint tetap berlaku)
        const count = await secRepo.count({
          where: { year, quarter: quarter as any },
        });
        if (count > 0) return true;
      }
    }
    return false;
  }

  // Helper untuk melakukan kloning modul secara berurutan
  private async cloneModulePeriod(
    source: RiskSource,
    sectionRepo: Repository<any>,
    indicatorRepo: Repository<any>,
    sourceYear: number,
    sourceQuarter: string,
    targetYear: number,
    targetQuarter: string,
    createdBy?: string,
  ): Promise<{ sectionsCloned: number; indicatorsCloned: number }> {
    let sectionsCloned = 0;
    let indicatorsCloned = 0;

    const hasSection = true;

    if (hasSection) {
      const sourceSections = await sectionRepo.find({
        where: { year: sourceYear, quarter: sourceQuarter, isDeleted: false },
        order: { sortOrder: 'ASC' },
      });

      for (const srcSec of sourceSections) {
        // Create new section
        const newSec = sectionRepo.create({
          ...srcSec,
          id: undefined, // biarkan DB menggenerasi id baru
          year: targetYear,
          quarter: targetQuarter,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: createdBy || srcSec.createdBy,
          updatedBy: null,
          isDeleted: false,
        });

        const savedSec = await sectionRepo.save(newSec);
        sectionsCloned++;

        // Cari indikator untuk section asal pada periode asal
        const srcIndicators = await indicatorRepo.find({
          where: {
            year: sourceYear,
            quarter: sourceQuarter,
            sectionId: srcSec.id,
            isDeleted: false,
          },
        });

        for (const srcInd of srcIndicators) {
          // Create new indicator dikaitkan dengan section yang baru disimpan
          const newInd = indicatorRepo.create({
            ...srcInd,
            id: undefined, // biarkan DB menggenerasi id baru
            year: targetYear,
            quarter: targetQuarter,
            sectionId: savedSec.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: createdBy || srcInd.createdBy,
            updatedBy: null,
            validatedAt: null,
            validatedBy: null,
            isValidated: false,
            isDeleted: false,
          });

          await indicatorRepo.save(newInd);
          indicatorsCloned++;
        }
      }
    }

    return { sectionsCloned, indicatorsCloned };
  }

  // ===================== CLONE KPMR PERIOD DATA (HOLDING) =====================
  async cloneKpmrPeriodData(
    dto: CloneHoldingKpmrDto,
    createdBy?: string,
  ): Promise<{ success: boolean; modulesCloned: number; aspectsCloned: number; questionsCloned: number; definitionsCloned: number; scoresCloned: number }> {
    const { sourceYear, targetYear, overrideExisting = false, categories, sourceCategory } = dto;

    if (sourceYear === targetYear && !sourceCategory) {
      throw new BadRequestException('Tahun asal dan tahun tujuan tidak boleh sama.');
    }

    const configMap: Record<string, {
      aspectEntity: any;
      questionEntity: any;
      definitionEntity: any;
      scoreEntity: any;
      label: string;
    }> = {
      'investasi': {
        aspectEntity: KpmrInvestasiAspek,
        questionEntity: KpmrInvestasiPertanyaan,
        definitionEntity: KpmrInvestasiDefinisi,
        scoreEntity: KpmrInvestasiSkor,
        label: 'Investasi',
      },
      'pasar': {
        aspectEntity: KpmrPasarAspek,
        questionEntity: KpmrPasarPertanyaan,
        definitionEntity: KpmrPasarDefinisi,
        scoreEntity: KpmrPasarSkor,
        label: 'Pasar',
      },
      'likuiditas': {
        aspectEntity: KpmrLikuiditasAspek,
        questionEntity: KpmrLikuiditasPertanyaan,
        definitionEntity: KpmrLikuiditasDefinisi,
        scoreEntity: KpmrLikuiditasSkor,
        label: 'Likuiditas',
      },
      'operasional': {
        aspectEntity: KpmrOperasionalAspek,
        questionEntity: KpmrOperasionalPertanyaan,
        definitionEntity: KpmrOperasionalDefinisi,
        scoreEntity: KpmrOperasionalSkor,
        label: 'Operasional',
      },
      'hukum': {
        aspectEntity: KpmrHukumAspek,
        questionEntity: KpmrHukumPertanyaan,
        definitionEntity: KpmrHukumDefinisi,
        scoreEntity: KpmrHukumSkor,
        label: 'Hukum',
      },
      'stratejik': {
        aspectEntity: KpmrStratejikAspek,
        questionEntity: KpmrStratejikPertanyaan,
        definitionEntity: KpmrStratejikDefinisi,
        scoreEntity: KpmrStratejikSkor,
        label: 'Stratejik',
      },
      'strategis': {
        aspectEntity: KpmrStratejikAspek,
        questionEntity: KpmrStratejikPertanyaan,
        definitionEntity: KpmrStratejikDefinisi,
        scoreEntity: KpmrStratejikSkor,
        label: 'Stratejik',
      },
      'kepatuhan': {
        aspectEntity: KpmrKepatuhanAspek,
        questionEntity: KpmrKepatuhanPertanyaan,
        definitionEntity: KpmrKepatuhanDefinisi,
        scoreEntity: KpmrKepatuhanSkor,
        label: 'Kepatuhan',
      },
      'reputasi': {
        aspectEntity: KpmrReputasiAspek,
        questionEntity: KpmrReputasiPertanyaan,
        definitionEntity: KpmrReputasiDefinisi,
        scoreEntity: KpmrReputasiSkor,
        label: 'Reputasi',
      },
    };

    // Tentukan kategori yang valid untuk dikloning
    const targetCategories =
      categories && categories.length > 0
        ? categories.filter((c) => configMap[c.toLowerCase()])
        : ['investasi', 'pasar', 'likuiditas', 'operasional', 'hukum', 'stratejik', 'kepatuhan', 'reputasi'];

    if (targetCategories.length === 0) {
      throw new BadRequestException('Kategori yang valid wajib dipilih untuk kloning.');
    }

    // 1. Cek apakah ada data di periode target
    if (!overrideExisting) {
      for (const catId of targetCategories) {
        if (sourceYear === targetYear && sourceCategory && catId.toLowerCase() === sourceCategory.toLowerCase()) {
          continue;
        }

        const config = configMap[catId.toLowerCase()];
        if (!config) continue;

        const count = await this.dataSource.getRepository(config.aspectEntity).count({
          where: { year: targetYear },
        });

        if (count > 0) {
          throw new BadRequestException(
            `Data KPMR target untuk '${config.label}' pada tahun ${targetYear} sudah ada. Gunakan opsi 'overrideExisting' untuk menimpa data.`,
          );
        }
      }
    }

    let modulesCloned = 0;
    let aspectsCloned = 0;
    let questionsCloned = 0;
    let definitionsCloned = 0;
    let scoresCloned = 0;

    // Set map untuk menyimpan kategori unik saja agar jika ada 'strategis' dan 'stratejik' tidak double clone
    const processedLabels = new Set<string>();

    for (const catId of targetCategories) {
      if (sourceYear === targetYear && sourceCategory && catId.toLowerCase() === sourceCategory.toLowerCase()) {
        console.warn(`Cannot clone to the same category '${catId}' in the same year. Skipping.`);
        continue;
      }

      const config = configMap[catId.toLowerCase()];
      if (!config || processedLabels.has(config.label)) continue;
      processedLabels.add(config.label);

      const aspectRepo = this.dataSource.getRepository(config.aspectEntity);
      const questionRepo = this.dataSource.getRepository(config.questionEntity);
      const definitionRepo = this.dataSource.getRepository(config.definitionEntity);
      const scoreRepo = this.dataSource.getRepository(config.scoreEntity);

      // Jika overrideExisting, hapus target data terlebih dahulu
      if (overrideExisting) {
        // Hapus target score, definition, question, aspect (berurutan untuk menghindari integrity constraint issue)
        await scoreRepo.delete({ year: targetYear });
        await definitionRepo.delete({ year: targetYear });
        await questionRepo.delete({ year: targetYear });
        await aspectRepo.delete({ year: targetYear });
      }

      // Tentukan repository asal (jika sourceCategory dikirim, ambil dari sourceCategory tersebut)
      let srcAspectRepo = aspectRepo;
      let srcQuestionRepo = questionRepo;
      let srcDefinitionRepo = definitionRepo;
      let srcScoreRepo = scoreRepo;

      if (sourceCategory) {
        const sourceConfig = configMap[sourceCategory.toLowerCase()];
        if (sourceConfig) {
          srcAspectRepo = this.dataSource.getRepository(sourceConfig.aspectEntity);
          srcQuestionRepo = this.dataSource.getRepository(sourceConfig.questionEntity);
          srcDefinitionRepo = this.dataSource.getRepository(sourceConfig.definitionEntity);
          srcScoreRepo = this.dataSource.getRepository(sourceConfig.scoreEntity);
        }
      }

      // Cari source aspects
      const sourceAspects = await srcAspectRepo.find({
        where: { year: sourceYear },
      });

      if (!sourceAspects.length) {
        console.warn(`Source data aspects not found at year ${sourceYear}. Skipping.`);
        continue;
      }

      modulesCloned++;

      // Cari source questions, definitions, scores
      const sourceQuestions = await srcQuestionRepo.find({
        where: { year: sourceYear },
      });
      const sourceDefinitions = await srcDefinitionRepo.find({
        where: { year: sourceYear },
      });
      const sourceScores = await srcScoreRepo.find({
        where: { year: sourceYear },
      });

      // 1. Clone Aspects
      for (const aspect of sourceAspects) {
        const targetAspect = aspectRepo.create({
          year: targetYear,
          aspekNo: aspect.aspekNo,
          aspekTitle: aspect.aspekTitle,
          aspekBobot: aspect.aspekBobot,
        });
        await aspectRepo.save(targetAspect);
        aspectsCloned++;
      }

      // 2. Clone Questions
      for (const question of sourceQuestions) {
        const targetQuestion = questionRepo.create({
          year: targetYear,
          aspekNo: question.aspekNo,
          sectionNo: question.sectionNo,
          sectionTitle: question.sectionTitle,
        });
        await questionRepo.save(targetQuestion);
        questionsCloned++;
      }

      // 3. Clone Definitions (dan build map ID untuk scores)
      const definitionIdMap = new Map<number, number>();

      for (const def of sourceDefinitions) {
        const targetDef = definitionRepo.create({
          year: targetYear,
          aspekNo: def.aspekNo,
          aspekTitle: def.aspekTitle,
          aspekBobot: def.aspekBobot,
          sectionNo: def.sectionNo,
          sectionTitle: def.sectionTitle,
          level1: def.level1,
          level2: def.level2,
          level3: def.level3,
          level4: def.level4,
          level5: def.level5,
          evidence: def.evidence,
          createdBy: createdBy || 'system',
        });
        const savedDef = await definitionRepo.save(targetDef);
        definitionIdMap.set(def.id, savedDef.id);
        definitionsCloned++;
      }

      // 4. Clone Scores
      for (const score of sourceScores) {
        const newDefId = definitionIdMap.get(score.definitionId);
        if (newDefId) {
          const targetScore = scoreRepo.create({
            definitionId: newDefId,
            year: targetYear,
            quarter: score.quarter,
            sectionSkor: score.sectionSkor,
            createdBy: createdBy || 'system',
          });
          await scoreRepo.save(targetScore);
          scoresCloned++;
        }
      }
    }

    return {
      success: true,
      modulesCloned,
      aspectsCloned,
      questionsCloned,
      definitionsCloned,
      scoresCloned,
    };
  }

  // ===================== RESET KPMR PERIOD DATA (HOLDING) =====================
  async resetKpmrPeriodData(
    year: number,
    category: string,
  ): Promise<{ success: boolean; message: string }> {
    const configMap: Record<string, {
      aspectEntity: any;
      questionEntity: any;
      definitionEntity: any;
      scoreEntity: any;
      label: string;
    }> = {
      'investasi': {
        aspectEntity: KpmrInvestasiAspek,
        questionEntity: KpmrInvestasiPertanyaan,
        definitionEntity: KpmrInvestasiDefinisi,
        scoreEntity: KpmrInvestasiSkor,
        label: 'Investasi',
      },
      'pasar': {
        aspectEntity: KpmrPasarAspek,
        questionEntity: KpmrPasarPertanyaan,
        definitionEntity: KpmrPasarDefinisi,
        scoreEntity: KpmrPasarSkor,
        label: 'Pasar',
      },
      'likuiditas': {
        aspectEntity: KpmrLikuiditasAspek,
        questionEntity: KpmrLikuiditasPertanyaan,
        definitionEntity: KpmrLikuiditasDefinisi,
        scoreEntity: KpmrLikuiditasSkor,
        label: 'Likuiditas',
      },
      'operasional': {
        aspectEntity: KpmrOperasionalAspek,
        questionEntity: KpmrOperasionalPertanyaan,
        definitionEntity: KpmrOperasionalDefinisi,
        scoreEntity: KpmrOperasionalSkor,
        label: 'Operasional',
      },
      'hukum': {
        aspectEntity: KpmrHukumAspek,
        questionEntity: KpmrHukumPertanyaan,
        definitionEntity: KpmrHukumDefinisi,
        scoreEntity: KpmrHukumSkor,
        label: 'Hukum',
      },
      'stratejik': {
        aspectEntity: KpmrStratejikAspek,
        questionEntity: KpmrStratejikPertanyaan,
        definitionEntity: KpmrStratejikDefinisi,
        scoreEntity: KpmrStratejikSkor,
        label: 'Stratejik',
      },
      'strategis': {
        aspectEntity: KpmrStratejikAspek,
        questionEntity: KpmrStratejikPertanyaan,
        definitionEntity: KpmrStratejikDefinisi,
        scoreEntity: KpmrStratejikSkor,
        label: 'Stratejik',
      },
      'kepatuhan': {
        aspectEntity: KpmrKepatuhanAspek,
        questionEntity: KpmrKepatuhanPertanyaan,
        definitionEntity: KpmrKepatuhanDefinisi,
        scoreEntity: KpmrKepatuhanSkor,
        label: 'Kepatuhan',
      },
      'reputasi': {
        aspectEntity: KpmrReputasiAspek,
        questionEntity: KpmrReputasiPertanyaan,
        definitionEntity: KpmrReputasiDefinisi,
        scoreEntity: KpmrReputasiSkor,
        label: 'Reputasi',
      },
    };

    const config = configMap[category.toLowerCase()];
    if (!config) {
      throw new BadRequestException(`Kategori KPMR '${category}' tidak dikenali.`);
    }

    const aspectRepo = this.dataSource.getRepository(config.aspectEntity);
    const questionRepo = this.dataSource.getRepository(config.questionEntity);
    const definitionRepo = this.dataSource.getRepository(config.definitionEntity);
    const scoreRepo = this.dataSource.getRepository(config.scoreEntity);

    await scoreRepo.delete({ year });
    await definitionRepo.delete({ year });
    await questionRepo.delete({ year });
    await aspectRepo.delete({ year });

    return {
      success: true,
      message: `Data KPMR ${config.label} untuk tahun ${year} berhasil di-reset.`,
    };
  }
}
