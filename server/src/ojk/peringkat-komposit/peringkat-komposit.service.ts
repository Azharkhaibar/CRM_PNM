// peringkat-komposit.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// operasional-ojk
import { Operasional } from '../operasional-ojk/operasional-ojk/entities/operasional-ojk.entity';
import { KpmrOperasionalOjk } from '../operasional-ojk/operasional-kpmr-ojk/entities/operasional-kpmr-ojk.entity';

// hukum-ojk
import { HukumOjk } from '../hukum-ojk/hukum-ojk/entities/hukum-ojk.entity';
import { KpmrHukumOjk } from '../hukum-ojk/hukum-kpmr-ojk/entities/hukum-kpmr-ojk.entity';

// investasi-ojk
import { Investasi } from '../investasi-ojk/investasi-ojk/entities/investasi-ojk.entity';
import { KpmrInvestasiOjk } from '../investasi-ojk/investasi-kpmr-ojk/entities/investasi-kpmr-ojk.entity';

// kepatuhan-ojk
import { KepatuhanOjk } from '../kepatuhan-ojk/kepatuhan-ojk/entities/kepatuhan-ojk.entity';
import { KpmrKepatuhanOjk } from '../kepatuhan-ojk/kepatuhan-kpmr-ojk/entities/kepatuhan-kpmr-ojk.entity';

// konsentrasi-produk
import { KonsentrasiProdukOjk } from '../konsentrasi-produk/konsentrasi-produk-ojk/entities/konsentrasi-produk-ojk.entity';
import { KpmrKonsentrasiOjk } from '../konsentrasi-produk/konsentrasi-produk-kpmr/entities/konsentrasi-produk-kpmr-ojk.entity';

// kredit-produk
import { Kredit } from '../kredit-produk/kredit-produk-ojk/entities/kredit-produk-ojk.entity';
import { KpmrKreditOjk } from '../kredit-produk/kredit-produk-kpmr/entities/kredit-produk-kpmr-ojk.entity';

// likuiditas-produk
import { Likuiditas } from '../likuiditas-produk/likuiditas-produk-ojk/entities/likuiditas-ojk.entity';
import { KpmrLikuiditasProdukOjk } from '../likuiditas-produk/likuiditas-produk-kpmr/entities/likuiditas-produk-kpmr-ojk.entity';

// pasar-produk
import { PasarProduk } from '../pasar-produk/pasar-produk-ojk/entities/pasar-produk-ojk.entity';
import { KpmrPasarProdukOjk } from '../pasar-produk/pasar-produk-kpmr/entities/pasar-produk-ojk.entity';

// permodalan-ojk
import { Permodalan } from '../permodalan-ojk/permodalan-ojk/entities/permodalan-ojk.entity';
import { KpmrPermodalanOjk } from '../permodalan-ojk/permodalan-kpmr-ojk/entities/permodalan-kpmr-ojk.entity';

// rentabilitas-ojk
import { Rentabilitas } from '../rentabilitas-ojk/rentabilitas-ojk/entities/rentabilitas-ojk.entity';
import { KpmrRentabilitasOjk } from '../rentabilitas-ojk/rentabilitas-kpmr-ojk/entities/rentabilitas-kpmr-ojk.entity';

// reputasi-ojk
import { Reputasi } from '../reputasi-ojk/reputasi-ojk/entities/reputasi-ojk.entity';
import { KpmrReputasiOjk } from '../reputasi-ojk/reputasi-kpmr-ojk/entities/reputasi-kpmr-ojk.entity';

// strategis-ojk
import { Strategis } from '../strategis-ojk/strategis-ojk/entities/strategis-ojk.entity';
import { KpmrStrategisOjk } from '../strategis-ojk/strategis-kpmr-ojk/entities/strategis-kpmr-ojk.entity';

// tatakelola-ojk
import { Tatakelola } from '../tatakelola-ojk/tatakelola-ojk/entities/tatakelola-ojk.entity';
import { KpmrTatakelolaOjk } from '../tatakelola-ojk/tatakelola-kpmr-ojk/entities/tatakelola-kpmr-ojk.entity';

import {
  PeringkatKompositQueryDto,
  PeringkatKompositItemDto,
} from './dto/peringkat-komposit.dto';

interface ModuleConfig {
  nama: string;
  repo: Repository<any> | null;
  kpmrRepo: Repository<any> | null;
}

@Injectable()
export class PeringkatKompositService {
  private readonly logger = new Logger(PeringkatKompositService.name);

  // 13 Module - sama persis dengan rekap-data-2
  private readonly modules: Record<string, ModuleConfig> = {
    'pasar-produk': { nama: 'Pasar Produk', repo: null, kpmrRepo: null },
    'likuiditas-produk': {
      nama: 'Likuiditas Produk',
      repo: null,
      kpmrRepo: null,
    },
    'kredit-produk': { nama: 'Kredit Produk', repo: null, kpmrRepo: null },
    'konsentrasi-produk': {
      nama: 'Konsentrasi Produk',
      repo: null,
      kpmrRepo: null,
    },
    operasional: { nama: 'Operasional', repo: null, kpmrRepo: null },
    'hukum-regulatory': { nama: 'Hukum', repo: null, kpmrRepo: null },
    'kepatuhan-regulatory': { nama: 'Kepatuhan', repo: null, kpmrRepo: null },
    'reputasi-regulatory': { nama: 'Reputasi', repo: null, kpmrRepo: null },
    'strategis-regulatory': { nama: 'Strategis', repo: null, kpmrRepo: null },
    'investasi-regulatory': { nama: 'Investasi', repo: null, kpmrRepo: null },
    'rentabilitas-regulatory': {
      nama: 'Rentabilitas',
      repo: null,
      kpmrRepo: null,
    },
    'permodalan-regulatory': { nama: 'Permodalan', repo: null, kpmrRepo: null },
    'tatakelola-regulatory': {
      nama: 'Tata Kelola',
      repo: null,
      kpmrRepo: null,
    },
  };

  constructor(
    @InjectRepository(Operasional)
    private readonly operasionalRepo: Repository<Operasional>,
    @InjectRepository(KpmrOperasionalOjk)
    private readonly kpmrOperasionalRepo: Repository<KpmrOperasionalOjk>,

    @InjectRepository(HukumOjk)
    private readonly hukumRepo: Repository<HukumOjk>,
    @InjectRepository(KpmrHukumOjk)
    private readonly kpmrHukumRepo: Repository<KpmrHukumOjk>,

    @InjectRepository(Investasi)
    private readonly investasiRepo: Repository<Investasi>,
    @InjectRepository(KpmrInvestasiOjk)
    private readonly kpmrInvestasiRepo: Repository<KpmrInvestasiOjk>,

    @InjectRepository(KepatuhanOjk)
    private readonly kepatuhanRepo: Repository<KepatuhanOjk>,
    @InjectRepository(KpmrKepatuhanOjk)
    private readonly kpmrKepatuhanRepo: Repository<KpmrKepatuhanOjk>,

    @InjectRepository(KonsentrasiProdukOjk)
    private readonly konsentrasiRepo: Repository<KonsentrasiProdukOjk>,
    @InjectRepository(KpmrKonsentrasiOjk)
    private readonly kpmrKonsentrasiRepo: Repository<KpmrKonsentrasiOjk>,

    @InjectRepository(Kredit)
    private readonly kreditRepo: Repository<Kredit>,
    @InjectRepository(KpmrKreditOjk)
    private readonly kpmrKreditRepo: Repository<KpmrKreditOjk>,

    @InjectRepository(Likuiditas)
    private readonly likuiditasRepo: Repository<Likuiditas>,
    @InjectRepository(KpmrLikuiditasProdukOjk)
    private readonly kpmrLikuiditasRepo: Repository<KpmrLikuiditasProdukOjk>,

    @InjectRepository(PasarProduk)
    private readonly pasarRepo: Repository<PasarProduk>,
    @InjectRepository(KpmrPasarProdukOjk)
    private readonly kpmrPasarRepo: Repository<KpmrPasarProdukOjk>,

    @InjectRepository(Permodalan)
    private readonly permodalanRepo: Repository<Permodalan>,
    @InjectRepository(KpmrPermodalanOjk)
    private readonly kpmrPermodalanRepo: Repository<KpmrPermodalanOjk>,

    @InjectRepository(Rentabilitas)
    private readonly rentabilitasRepo: Repository<Rentabilitas>,
    @InjectRepository(KpmrRentabilitasOjk)
    private readonly kpmrRentabilitasRepo: Repository<KpmrRentabilitasOjk>,

    @InjectRepository(Reputasi)
    private readonly reputasiRepo: Repository<Reputasi>,
    @InjectRepository(KpmrReputasiOjk)
    private readonly kpmrReputasiRepo: Repository<KpmrReputasiOjk>,

    @InjectRepository(Strategis)
    private readonly strategisRepo: Repository<Strategis>,
    @InjectRepository(KpmrStrategisOjk)
    private readonly kpmrStrategisRepo: Repository<KpmrStrategisOjk>,

    @InjectRepository(Tatakelola)
    private readonly tatakelolaRepo: Repository<Tatakelola>,
    @InjectRepository(KpmrTatakelolaOjk)
    private readonly kpmrTatakelolaRepo: Repository<KpmrTatakelolaOjk>,
  ) {
    this.modules['operasional'].repo = operasionalRepo;
    this.modules['operasional'].kpmrRepo = kpmrOperasionalRepo;

    this.modules['pasar-produk'].repo = pasarRepo;
    this.modules['pasar-produk'].kpmrRepo = kpmrPasarRepo;

    this.modules['likuiditas-produk'].repo = likuiditasRepo;
    this.modules['likuiditas-produk'].kpmrRepo = kpmrLikuiditasRepo;

    this.modules['kredit-produk'].repo = kreditRepo;
    this.modules['kredit-produk'].kpmrRepo = kpmrKreditRepo;

    this.modules['konsentrasi-produk'].repo = konsentrasiRepo;
    this.modules['konsentrasi-produk'].kpmrRepo = kpmrKonsentrasiRepo;

    this.modules['hukum-regulatory'].repo = hukumRepo;
    this.modules['hukum-regulatory'].kpmrRepo = kpmrHukumRepo;

    this.modules['kepatuhan-regulatory'].repo = kepatuhanRepo;
    this.modules['kepatuhan-regulatory'].kpmrRepo = kpmrKepatuhanRepo;

    this.modules['reputasi-regulatory'].repo = reputasiRepo;
    this.modules['reputasi-regulatory'].kpmrRepo = kpmrReputasiRepo;

    this.modules['strategis-regulatory'].repo = strategisRepo;
    this.modules['strategis-regulatory'].kpmrRepo = kpmrStrategisRepo;

    this.modules['investasi-regulatory'].repo = investasiRepo;
    this.modules['investasi-regulatory'].kpmrRepo = kpmrInvestasiRepo;

    this.modules['rentabilitas-regulatory'].repo = rentabilitasRepo;
    this.modules['rentabilitas-regulatory'].kpmrRepo = kpmrRentabilitasRepo;

    this.modules['permodalan-regulatory'].repo = permodalanRepo;
    this.modules['permodalan-regulatory'].kpmrRepo = kpmrPermodalanRepo;

    this.modules['tatakelola-regulatory'].repo = tatakelolaRepo;
    this.modules['tatakelola-regulatory'].kpmrRepo = kpmrTatakelolaRepo;
  }

  async getPeringkatKomposit(
    query: PeringkatKompositQueryDto,
  ): Promise<PeringkatKompositItemDto[]> {
    const { year, quarter } = query;
    this.logger.log(`Peringkat Komposit tahun ${year}, quarter ${quarter}`);

    const results: PeringkatKompositItemDto[] = [];

    for (const [id, config] of Object.entries(this.modules)) {
      try {
        const [inherentSummary, kpmrSummary] = await Promise.all([
          this.getInherentSummary(config.repo, year, quarter),
          this.getKpmrSummary(config.kpmrRepo, year, quarter),
        ]);

        results.push({ id, nama: config.nama, inherentSummary, kpmrSummary });
      } catch (error) {
        this.logger.error(`Gagal ambil data ${id}: ${error.message}`);
        results.push({
          id,
          nama: config.nama,
          inherentSummary: 0,
          kpmrSummary: 0,
        });
      }
    }

    return results;
  }

  async getDashboardOjkData(year: number, quarterNum: number) {
    const results: any[] = [];
    let totalInherent = 0;
    let totalKpmr = 0;
    let countInherent = 0;
    let countKpmr = 0;

    for (const [id, config] of Object.entries(this.modules)) {
      try {
        // Fetch inherent data with parameters & nilaiList
        let inherentSummary = 0;
        const categories = { high: 0, moderateHigh: 0, moderate: 0, lowModerate: 0, low: 0 };
        let hasInherent = false;

        if (config.repo) {
          const data = await config.repo.findOne({
            where: { year, quarter: quarterNum, isActive: true },
            relations: { parameters: { nilaiList: true } },
          });

          if (data) {
            hasInherent = true;
            // 1. Inherent score
            if (data.summary?.totalWeighted != null) {
              inherentSummary = data.summary.totalWeighted;
            } else if (data.parameters?.length > 0) {
              inherentSummary = this.hitungWeightedAverage(data.parameters);
            }

            // 2. Count categories
            if (data.parameters) {
              for (const param of data.parameters) {
                for (const nilai of param.nilaiList || []) {
                  const derived = this.computeDerived(nilai, param);
                  const level = derived.peringkat;
                  if (level !== null && level > 0) {
                    if (level === 5) categories.high++;
                    else if (level === 4) categories.moderateHigh++;
                    else if (level === 3) categories.moderate++;
                    else if (level === 2) categories.lowModerate++;
                    else if (level === 1) categories.low++;
                  }
                }
              }
            }
          }
        }

        // Fetch kpmr data
        let kpmrSummary = 0;
        let hasKpmr = false;
        if (config.kpmrRepo) {
          const data = await config.kpmrRepo.findOne({
            where: { year, quarter: quarterNum, isActive: true },
            relations: { aspekList: { pertanyaanList: true } },
          });

          if (data) {
            hasKpmr = true;
            if (data.summary?.averageScore != null) {
              kpmrSummary = data.summary.averageScore;
            } else if (data.aspekList?.length > 0) {
              kpmrSummary = this.hitungRataRataSkor(data.aspekList, quarterNum);
            }
          }
        }

        if (hasInherent || hasKpmr) {
          const skorRisiko = inherentSummary; // skorRisiko = inherent
          results.push({
            type: id,
            label: config.nama,
            inherent: inherentSummary,
            kpmr: kpmrSummary,
            skorRisiko,
            categories,
          });

          if (hasInherent && inherentSummary > 0) {
            totalInherent += inherentSummary;
            countInherent++;
          }
          if (hasKpmr && kpmrSummary > 0) {
            totalKpmr += kpmrSummary;
            countKpmr++;
          }
        }
      } catch (error) {
        this.logger.error(`Error compiling dashboard OJK for ${id}: ${error.message}`);
      }
    }

    const kompositA = countInherent > 0 ? totalInherent / countInherent : 0;
    const kompositB = countKpmr > 0 ? totalKpmr / countKpmr : 0;
    const total = (kompositA + kompositB) / 2;

    return {
      kompositA,
      kompositB,
      total,
      risks: results,
    };
  }

  private skorToLevel(skor: number): number {
    if (skor < 1.5) return 1;
    if (skor < 2.5) return 2;
    if (skor < 3.5) return 3;
    if (skor < 4.5) return 4;
    return 5;
  }

  // ========== INHERENT ==========
  private async getInherentSummary(
    repo: Repository<any> | null,
    year: number,
    quarter: number,
  ): Promise<number> {
    if (!repo) return 0;

    try {
      const data = await repo.findOne({
        where: { year, quarter, isActive: true },
        relations: { parameters: { nilaiList: true } },
      });

      if (!data) return 0;
      if (data.summary?.totalWeighted != null && data.summary.totalWeighted <= 5)
        return data.summary.totalWeighted;
      if (data.parameters?.length > 0)
        return this.hitungWeightedAverage(data.parameters);

      return 0;
    } catch (error) {
      this.logger.error(`Gagal baca inherent: ${error.message}`);
      return 0;
    }
  }

  // ========== KPMR ==========
  private async getKpmrSummary(
    repo: Repository<any> | null,
    year: number,
    quarter: number,
  ): Promise<number> {
    if (!repo) return 0;

    try {
      const data = await repo.findOne({
        where: { year, quarter, isActive: true },
        relations: { aspekList: { pertanyaanList: true } },
      });

      if (!data) return 0;
      if (data.summary?.averageScore != null) return data.summary.averageScore;
      if (data.aspekList?.length > 0)
        return this.hitungRataRataSkor(data.aspekList, quarter);

      return 0;
    } catch (error) {
      this.logger.error(`Gagal baca KPMR: ${error.message}`);
      return 0;
    }
  }

  // ========== KALKULASI ==========
  private hitungWeightedAverage(parameters: any[]): number {
    let totalWeighted = 0;
    let totalParameterBobot = 0;

    for (const param of parameters) {
      const paramBobot = (Number(param.bobot) || 0) / 100;
      totalParameterBobot += paramBobot;

      for (const nilai of param.nilaiList || []) {
        const derived = this.computeDerived(nilai, param);
        totalWeighted += derived.weighted;
      }
    }

    return totalParameterBobot > 0
      ? Number((totalWeighted / totalParameterBobot).toFixed(2))
      : 0;
  }

  private computeDerived(nilai: any, param: any): { weighted: number; peringkat: number | null } {
    try {
      if (!nilai) return { weighted: 0, peringkat: null };

      const judul = nilai.judul || {};
      const paramBobotFraction = Number(param?.bobot ?? 0) / 100;
      const nilaiBobotFraction = Number(nilai?.bobot ?? 0) / 100;

      const parseNumber = (v: any): number => {
        if (v == null || v === '' || v === undefined) return NaN;
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          let cleaned = v.trim().replace(/\s/g, '');
          const isPercent = cleaned.includes('%');
          cleaned = cleaned
            .replace('%', '')
            .replace(/\./g, '')
            .replace(/,/g, '.');
          const num = Number(cleaned);
          if (!isNaN(num) && isPercent) return num / 100;
          return num;
        }
        return Number(v);
      };

      const evaluateFormula = (
        expr: string,
        subs: Record<string, number> = {},
      ): number => {
        if (!expr || typeof expr !== 'string' || expr.trim() === '') return NaN;
        let e = expr.trim();
        for (const [token, value] of Object.entries(subs)) {
          e = e.replace(new RegExp(`\\b${token}\\b`, 'gi'), String(value));
        }
        if (!/^[0-9eE\.\+\-\*\/\(\)\s]+$/.test(e)) return NaN;
        try {
          const fn = new Function(
            `"use strict"; try { return (${e}); } catch(err) { return NaN; }`,
          );
          const val = fn();
          return typeof val === 'number' && !isNaN(val) && isFinite(val)
            ? val
            : NaN;
        } catch {
          return NaN;
        }
      };

      let rawValue: number = NaN;
      const type = judul.type || 'Tanpa Faktor';

      if (type === 'Tanpa Faktor') {
        const parsed = parseNumber(judul.value);
        if (!isNaN(parsed))
          rawValue = judul.formula
            ? evaluateFormula(judul.formula, { pem: parsed })
            : parsed;
      } else if (type === 'Satu Faktor') {
        const parsed = parseNumber(judul.valuePembilang);
        if (!isNaN(parsed))
          rawValue = judul.formula
            ? evaluateFormula(judul.formula, { pem: parsed })
            : parsed;
      } else if (type === 'Dua Faktor') {
        const pem = parseNumber(judul.valuePembilang);
        const pen = parseNumber(judul.valuePenyebut);
        if (!isNaN(pem) && !isNaN(pen)) {
          rawValue = judul.formula
            ? evaluateFormula(judul.formula, { pem, pen })
            : pen !== 0
              ? pem / pen
              : NaN;
        }
      }

      let peringkat: number | null = null;
      const ri = nilai.riskindikator || {};
      const ranges = [
        { key: 'low', rank: 1 },
        { key: 'lowToModerate', rank: 2 },
        { key: 'moderate', rank: 3 },
        { key: 'moderateToHigh', rank: 4 },
        { key: 'high', rank: 5 },
      ];

      if (!isNaN(rawValue)) {
        for (const { key, rank } of ranges) {
          const rawText = String(ri[key] ?? '');
          const nums = rawText.match(/-?\d+(\.\d+)?/g);
          if (!nums || nums.length === 0) continue;

          const hasPercent = rawText.includes('%');
          let min = -Infinity;
          let max = Infinity;

          if (nums.length === 1) {
            let n = Number(nums[0]);
            if (hasPercent) n = n / 100;
            if (/≤|<=/.test(rawText)) max = n;
            else if (/≥|>=/.test(rawText)) min = n;
            else if (/^\s*(?:[xX]?\s*>|≥?>)\s*-?\d+(?:\.\d+)?/i.test(rawText)) {
              min = n;
              max = Infinity;
            } else if (/^\s*(?:[xX]?\s*<|≤?<)\s*-?\d+(?:\.\d+)?/i.test(rawText)) {
              min = -Infinity;
              max = n;
            } else {
              min = n;
              max = n;
            }
          } else {
            let n1 = Number(nums[0]);
            let n2 = Number(nums[1]);
            if (hasPercent) {
              n1 = n1 / 100;
              n2 = n2 / 100;
            }
            min = Math.min(n1, n2);
            max = Math.max(n1, n2);
          }

          if (rawValue >= min && rawValue <= max) {
            peringkat = rank;
            break;
          }
        }
      }

      if (peringkat === null && !isNaN(rawValue)) {
        if (rawValue <= 1.5) peringkat = 1;
        else if (rawValue <= 2.5) peringkat = 2;
        else if (rawValue <= 3.5) peringkat = 3;
        else if (rawValue <= 4.5) peringkat = 4;
        else peringkat = 5;
      }

      const weighted =
        peringkat !== null
          ? Math.round(
              paramBobotFraction * nilaiBobotFraction * peringkat * 10000,
            ) / 10000
          : 0;

      return { weighted, peringkat };
    } catch {
      return { weighted: 0, peringkat: null };
    }
  }

  private hitungRataRataSkor(aspekList: any[], quarter: number): number {
    let totalScore = 0;
    let count = 0;
    const quarterKey = `Q${quarter}`;

    for (const aspek of aspekList) {
      if (aspek.pertanyaanList) {
        for (const pertanyaan of aspek.pertanyaanList) {
          const score = pertanyaan.skor?.[quarterKey];
          if (
            score != null &&
            !isNaN(Number(score)) &&
            Number(score) >= 1 &&
            Number(score) <= 5
          ) {
            totalScore += Number(score);
            count++;
          }
        }
      }
    }

    return count > 0 ? totalScore / count : 0;
  }
}
