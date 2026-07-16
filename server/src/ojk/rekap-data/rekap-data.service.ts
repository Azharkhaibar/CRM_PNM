// rekap-data.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as XLSX from 'xlsx';

import {
  GetAllRekapDto,
  UpdateNilaiValueDto,
  RekapParameterResponseDto,
  RekapNilaiResponseDto,
  RekapDataResponseDto,
  UpdateNilaiResponseDto,
  CategoryId,
  CloneOjkRekapDataDto,
  UndoCloneOjkRekapDataDto,
  CloneOjkKpmrDataDto,
  UndoCloneOjkKpmrDataDto,
} from './dto/rekap-data.dto';

// operasional-ojk
import { Operasional } from '../operasional-ojk/operasional-ojk/entities/operasional-ojk.entity';
import { OperasionalParameter } from '../operasional-ojk/operasional-ojk/entities/operasional-produk-parameter.entity';
import { OperasionalNilai } from '../operasional-ojk/operasional-ojk/entities/operasional-produk-nilai.entity';

// hukum-ojk
import { HukumOjk } from '../hukum-ojk/hukum-ojk/entities/hukum-ojk.entity';
import { HukumParameter } from '../hukum-ojk/hukum-ojk/entities/hukum-paramater.entity';
import { HukumNilai } from '../hukum-ojk/hukum-ojk/entities/hukum-nilai.entity';

// investasi-ojk
import { Investasi } from '../investasi-ojk/investasi-ojk/entities/investasi-ojk.entity';
import { InvestasiParameter } from '../investasi-ojk/investasi-ojk/entities/investasi-produk-parameter.entity';
import { InvestasiNilai } from '../investasi-ojk/investasi-ojk/entities/investasi-produk-nilai.entity';

// kepatuhan-ojk
import { KepatuhanOjk } from '../kepatuhan-ojk/kepatuhan-ojk/entities/kepatuhan-ojk.entity';
import { KepatuhanParameter } from '../kepatuhan-ojk/kepatuhan-ojk/entities/kepatuhan-paramater.entity';
import { KepatuhanNilai } from '../kepatuhan-ojk/kepatuhan-ojk/entities/kepatuhan-nilai.entity';

// konsentrasi-produk
import { KonsentrasiProdukOjk } from '../konsentrasi-produk/konsentrasi-produk-ojk/entities/konsentrasi-produk-ojk.entity';
import { KonsentrasiParameter } from '../konsentrasi-produk/konsentrasi-produk-ojk/entities/konsentrasi-produk-paramter.entity';
import { KonsentrasiNilai } from '../konsentrasi-produk/konsentrasi-produk-ojk/entities/konsentrasi-produk-nilai.entity';

// kredit-produk
import { Kredit } from '../kredit-produk/kredit-produk-ojk/entities/kredit-produk-ojk.entity';
import { KreditParameter } from '../kredit-produk/kredit-produk-ojk/entities/kredit-produk-parameter.entity';
import { KreditNilai } from '../kredit-produk/kredit-produk-ojk/entities/kredit-produk-nilai.entity';

// likuiditas-produk
import { Likuiditas } from '../likuiditas-produk/likuiditas-produk-ojk/entities/likuiditas-ojk.entity';
import { LikuiditasParameter } from '../likuiditas-produk/likuiditas-produk-ojk/entities/likuiditas-parameter.entity';
import { LikuiditasNilai } from '../likuiditas-produk/likuiditas-produk-ojk/entities/likuiditas-nilai.entity';

// pasar-produk
import { PasarProduk } from '../pasar-produk/pasar-produk-ojk/entities/pasar-produk-ojk.entity';
import { PasarProdukParameter } from '../pasar-produk/pasar-produk-ojk/entities/pasar-produk-parameter.entity';
import { PasarProdukNilai } from '../pasar-produk/pasar-produk-ojk/entities/pasar-produk-nilai.entity';

// permodalan-ojk
import { Permodalan } from '../permodalan-ojk/permodalan-ojk/entities/permodalan-ojk.entity';
import { PermodalanParameter } from '../permodalan-ojk/permodalan-ojk/entities/permodalan-produk-parameter.entity';
import { PermodalanNilai } from '../permodalan-ojk/permodalan-ojk/entities/permodalan-produk-nilai.entity';

// rentabilitas-ojk
import { Rentabilitas } from '../rentabilitas-ojk/rentabilitas-ojk/entities/rentabilitas-ojk.entity';
import { RentabilitasParameter } from '../rentabilitas-ojk/rentabilitas-ojk/entities/rentabilitas-parameter.entity';
import { RentabilitasNilai } from '../rentabilitas-ojk/rentabilitas-ojk/entities/rentabilitas-nilai.entity';

// reputasi-ojk
import { Reputasi } from '../reputasi-ojk/reputasi-ojk/entities/reputasi-ojk.entity';
import { ReputasiParameter } from '../reputasi-ojk/reputasi-ojk/entities/reputasi-parameter.entity';
import { ReputasiNilai } from '../reputasi-ojk/reputasi-ojk/entities/reputasi-nilai.entity';

// strategis-ojk
import { Strategis } from '../strategis-ojk/strategis-ojk/entities/strategis-ojk.entity';
import { StrategisParameter } from '../strategis-ojk/strategis-ojk/entities/strategis-parameter.entity';
import { StrategisNilai } from '../strategis-ojk/strategis-ojk/entities/strategis-nilai.entity';

// tatakelola-ojk
import { Tatakelola } from '../tatakelola-ojk/tatakelola-ojk/entities/tatakelola-ojk.entity';
import { TatakelolaParameter } from '../tatakelola-ojk/tatakelola-ojk/entities/tatakelola-produk-parameter.entity';
import { TatakelolaNilai } from '../tatakelola-ojk/tatakelola-ojk/entities/tatakelola-produk-nilai.entity';

// ==================== KPMR ENTITIES ====================
import { KpmrOperasionalOjk } from '../operasional-ojk/operasional-kpmr-ojk/entities/operasional-kpmr-ojk.entity';
import { KpmrAspekOperasional } from '../operasional-ojk/operasional-kpmr-ojk/entities/operasional-kpmr-aspek.entity';
import { KpmrPertanyaanOperasional } from '../operasional-ojk/operasional-kpmr-ojk/entities/operasional-kpmr-pertanyaan.entity';

import { KpmrPasarProdukOjk } from '../pasar-produk/pasar-produk-kpmr/entities/pasar-produk-ojk.entity';
import { KpmrAspekPasarProduk } from '../pasar-produk/pasar-produk-kpmr/entities/pasar-produk-kpmr-aspek.entity';
import { KpmrPertanyaanPasarProduk } from '../pasar-produk/pasar-produk-kpmr/entities/pasar-produk-kpmr-pertanyaan.entity';

import { KpmrLikuiditasProdukOjk } from '../likuiditas-produk/likuiditas-produk-kpmr/entities/likuiditas-produk-kpmr-ojk.entity';
import { KpmrAspekLikuiditasProduk } from '../likuiditas-produk/likuiditas-produk-kpmr/entities/likuiditas-kpmr-aspek.entity';
import { KpmrPertanyaanLikuiditasProduk } from '../likuiditas-produk/likuiditas-produk-kpmr/entities/likuiditas-kpmr-pertanyaan.entity';

import { KpmrKreditOjk } from '../kredit-produk/kredit-produk-kpmr/entities/kredit-produk-kpmr-ojk.entity';
import { KpmrAspekKredit } from '../kredit-produk/kredit-produk-kpmr/entities/kredit-kpmr-aspek.entity';
import { KpmrPertanyaanKredit } from '../kredit-produk/kredit-produk-kpmr/entities/kredit-kpmr-pertanyaan.entity';

import { KpmrKonsentrasiOjk } from '../konsentrasi-produk/konsentrasi-produk-kpmr/entities/konsentrasi-produk-kpmr-ojk.entity';
import { KpmrAspekKonsentrasi } from '../konsentrasi-produk/konsentrasi-produk-kpmr/entities/konsentrasi-kpmr-aspek.entity';
import { KpmrPertanyaanKonsentrasi } from '../konsentrasi-produk/konsentrasi-produk-kpmr/entities/konsentrasi-kpmr-pertanyaan.entity';

import { KpmrHukumOjk } from '../hukum-ojk/hukum-kpmr-ojk/entities/hukum-kpmr-ojk.entity';
import { KpmrAspekHukum } from '../hukum-ojk/hukum-kpmr-ojk/entities/hukum-kpmr-aspek.entity';
import { KpmrPertanyaanHukum } from '../hukum-ojk/hukum-kpmr-ojk/entities/hukum-kpmr-pertanyaan.entity';

import { KpmrKepatuhanOjk } from '../kepatuhan-ojk/kepatuhan-kpmr-ojk/entities/kepatuhan-kpmr-ojk.entity';
import { KpmrAspekKepatuhan } from '../kepatuhan-ojk/kepatuhan-kpmr-ojk/entities/kepatuhan-kpmr-aspek.entity';
import { KpmrPertanyaanKepatuhan } from '../kepatuhan-ojk/kepatuhan-kpmr-ojk/entities/kepatuhan-kpmr-pertanyaan.entity';

import { KpmrReputasiOjk } from '../reputasi-ojk/reputasi-kpmr-ojk/entities/reputasi-kpmr-ojk.entity';
import { KpmrAspekReputasi } from '../reputasi-ojk/reputasi-kpmr-ojk/entities/reputasi-kpmr-aspek.entity';
import { KpmrPertanyaanReputasi } from '../reputasi-ojk/reputasi-kpmr-ojk/entities/reputasi-kpmr-pertanyaan.entity';

import { KpmrStrategisOjk } from '../strategis-ojk/strategis-kpmr-ojk/entities/strategis-kpmr-ojk.entity';
import { KpmrAspekStrategis } from '../strategis-ojk/strategis-kpmr-ojk/entities/strategis-kpmr-aspek.entity';
import { KpmrPertanyaanStrategis } from '../strategis-ojk/strategis-kpmr-ojk/entities/strategis-kpmr-pertanyaan.entity';

import { KpmrInvestasiOjk } from '../investasi-ojk/investasi-kpmr-ojk/entities/investasi-kpmr-ojk.entity';
import { KpmrAspekInvestasi } from '../investasi-ojk/investasi-kpmr-ojk/entities/investasi-kpmr-aspek.entity';
import { KpmrPertanyaanInvestasi } from '../investasi-ojk/investasi-kpmr-ojk/entities/investasi-kpmr-pertanyaan.entity';

import { KpmrRentabilitasOjk } from '../rentabilitas-ojk/rentabilitas-kpmr-ojk/entities/rentabilitas-kpmr-ojk.entity';
import { KpmrAspekRentabilitas } from '../rentabilitas-ojk/rentabilitas-kpmr-ojk/entities/rentabilitas-kpmr-aspek.entity';
import { KpmrPertanyaanRentabilitas } from '../rentabilitas-ojk/rentabilitas-kpmr-ojk/entities/rentabilitas-kpmr-pertanyaan.entity';

import { KpmrPermodalanOjk } from '../permodalan-ojk/permodalan-kpmr-ojk/entities/permodalan-kpmr-ojk.entity';
import { KpmrAspekPermodalan } from '../permodalan-ojk/permodalan-kpmr-ojk/entities/permodalan-kpmr-aspek.entity';
import { KpmrPertanyaanPermodalan } from '../permodalan-ojk/permodalan-kpmr-ojk/entities/permodalan-kpmr-pertanyaan.entity';

import { KpmrTatakelolaOjk } from '../tatakelola-ojk/tatakelola-kpmr-ojk/entities/tatakelola-kpmr-ojk.entity';
import { KpmrAspekTatakelola } from '../tatakelola-ojk/tatakelola-kpmr-ojk/entities/tatakelola-kpmr-aspek.entity';
import { KpmrPertanyaanTatakelola } from '../tatakelola-ojk/tatakelola-kpmr-ojk/entities/tatakelola-kpmr-pertanyaan.entity';

interface KpmrModuleConfig {
  name: string;
  label: string;
  headerEntity: any;
  aspekEntity: any;
  pertanyaanEntity: any;
}

// ==================== CATEGORY MAPPING ====================
const CATEGORY_LABEL_MAP: Record<string, string> = {
  'operasional': 'Operasional',
  'pasar-produk': 'Pasar Produk',
  'likuiditas-produk': 'Likuiditas Produk',
  'kredit-produk': 'Kredit Produk',
  'konsentrasi-produk': 'Konsentrasi Produk',
  'hukum-regulatory': 'Hukum',
  'kepatuhan-regulatory': 'Kepatuhan',
  'reputasi-regulatory': 'Reputasi',
  'strategis-regulatory': 'Strategis',
  'investasi-regulatory': 'Investasi',
  'rentabilitas-regulatory': 'Rentabilitas',
  'permodalan-regulatory': 'Permodalan',
  'tatakelola-regulatory': 'Tata Kelola',
};

// ==================== MODULE CONFIG ====================
interface ModuleConfig {
  name: string;
  label: string;
  headerRepo: any;
  paramRepo: any;
  nilaiRepo: any;
  parentRelationName: string;
}

@Injectable()
export class RekapService {
  private readonly logger = new Logger(RekapService.name);
  private moduleConfigs: Map<string, ModuleConfig>;
  private kpmrModuleConfigs: Map<string, KpmrModuleConfig>;

  constructor(
    @InjectRepository(Operasional)
    private readonly operasionalRepo: Repository<Operasional>,
    @InjectRepository(OperasionalParameter)
    private readonly operasionalParamRepo: Repository<OperasionalParameter>,
    @InjectRepository(OperasionalNilai)
    private readonly operasionalNilaiRepo: Repository<OperasionalNilai>,

    @InjectRepository(HukumOjk)
    private readonly hukumRepo: Repository<HukumOjk>,
    @InjectRepository(HukumParameter)
    private readonly hukumParamRepo: Repository<HukumParameter>,
    @InjectRepository(HukumNilai)
    private readonly hukumNilaiRepo: Repository<HukumNilai>,

    @InjectRepository(Investasi)
    private readonly investasiRepo: Repository<Investasi>,
    @InjectRepository(InvestasiParameter)
    private readonly investasiParamRepo: Repository<InvestasiParameter>,
    @InjectRepository(InvestasiNilai)
    private readonly investasiNilaiRepo: Repository<InvestasiNilai>,

    @InjectRepository(KepatuhanOjk)
    private readonly kepatuhanRepo: Repository<KepatuhanOjk>,
    @InjectRepository(KepatuhanParameter)
    private readonly kepatuhanParamRepo: Repository<KepatuhanParameter>,
    @InjectRepository(KepatuhanNilai)
    private readonly kepatuhanNilaiRepo: Repository<KepatuhanNilai>,

    @InjectRepository(KonsentrasiProdukOjk)
    private readonly konsentrasiRepo: Repository<KonsentrasiProdukOjk>,
    @InjectRepository(KonsentrasiParameter)
    private readonly konsentrasiParamRepo: Repository<KonsentrasiParameter>,
    @InjectRepository(KonsentrasiNilai)
    private readonly konsentrasiNilaiRepo: Repository<KonsentrasiNilai>,

    @InjectRepository(Kredit)
    private readonly kreditRepo: Repository<Kredit>,
    @InjectRepository(KreditParameter)
    private readonly kreditParamRepo: Repository<KreditParameter>,
    @InjectRepository(KreditNilai)
    private readonly kreditNilaiRepo: Repository<KreditNilai>,

    @InjectRepository(Likuiditas)
    private readonly likuiditasRepo: Repository<Likuiditas>,
    @InjectRepository(LikuiditasParameter)
    private readonly likuiditasParamRepo: Repository<LikuiditasParameter>,
    @InjectRepository(LikuiditasNilai)
    private readonly likuiditasNilaiRepo: Repository<LikuiditasNilai>,

    @InjectRepository(PasarProduk)
    private readonly pasarRepo: Repository<PasarProduk>,
    @InjectRepository(PasarProdukParameter)
    private readonly pasarParamRepo: Repository<PasarProdukParameter>,
    @InjectRepository(PasarProdukNilai)
    private readonly pasarNilaiRepo: Repository<PasarProdukNilai>,

    @InjectRepository(Permodalan)
    private readonly permodalanRepo: Repository<Permodalan>,
    @InjectRepository(PermodalanParameter)
    private readonly permodalanParamRepo: Repository<PermodalanParameter>,
    @InjectRepository(PermodalanNilai)
    private readonly permodalanNilaiRepo: Repository<PermodalanNilai>,

    @InjectRepository(Rentabilitas)
    private readonly rentabilitasRepo: Repository<Rentabilitas>,
    @InjectRepository(RentabilitasParameter)
    private readonly rentabilitasParamRepo: Repository<RentabilitasParameter>,
    @InjectRepository(RentabilitasNilai)
    private readonly rentabilitasNilaiRepo: Repository<RentabilitasNilai>,

    @InjectRepository(Reputasi)
    private readonly reputasiRepo: Repository<Reputasi>,
    @InjectRepository(ReputasiParameter)
    private readonly reputasiParamRepo: Repository<ReputasiParameter>,
    @InjectRepository(ReputasiNilai)
    private readonly reputasiNilaiRepo: Repository<ReputasiNilai>,

    @InjectRepository(Strategis)
    private readonly strategisRepo: Repository<Strategis>,
    @InjectRepository(StrategisParameter)
    private readonly strategisParamRepo: Repository<StrategisParameter>,
    @InjectRepository(StrategisNilai)
    private readonly strategisNilaiRepo: Repository<StrategisNilai>,

    @InjectRepository(Tatakelola)
    private readonly tatakelolaRepo: Repository<Tatakelola>,
    @InjectRepository(TatakelolaParameter)
    private readonly tatakelolaParamRepo: Repository<TatakelolaParameter>,
    @InjectRepository(TatakelolaNilai)
    private readonly tatakelolaNilaiRepo: Repository<TatakelolaNilai>,
    private readonly dataSource: DataSource,
  ) {
    this.moduleConfigs = new Map<string, ModuleConfig>();
    this.kpmrModuleConfigs = new Map<string, KpmrModuleConfig>();

    this.moduleConfigs.set('operasional', {
      name: 'operasional',
      label: CATEGORY_LABEL_MAP['operasional'],
      headerRepo: operasionalRepo,
      paramRepo: operasionalParamRepo,
      nilaiRepo: operasionalNilaiRepo,
      parentRelationName: 'operasional',
    });
    this.moduleConfigs.set('pasar-produk', {
      name: 'pasar-produk',
      label: CATEGORY_LABEL_MAP['pasar-produk'],
      headerRepo: pasarRepo,
      paramRepo: pasarParamRepo,
      nilaiRepo: pasarNilaiRepo,
      parentRelationName: 'pasarProduk',
    });
    this.moduleConfigs.set('likuiditas-produk', {
      name: 'likuiditas-produk',
      label: CATEGORY_LABEL_MAP['likuiditas-produk'],
      headerRepo: likuiditasRepo,
      paramRepo: likuiditasParamRepo,
      nilaiRepo: likuiditasNilaiRepo,
      parentRelationName: 'likuiditas',
    });
    this.moduleConfigs.set('kredit-produk', {
      name: 'kredit-produk',
      label: CATEGORY_LABEL_MAP['kredit-produk'],
      headerRepo: kreditRepo,
      paramRepo: kreditParamRepo,
      nilaiRepo: kreditNilaiRepo,
      parentRelationName: 'kredit',
    });
    this.moduleConfigs.set('konsentrasi-produk', {
      name: 'konsentrasi-produk',
      label: CATEGORY_LABEL_MAP['konsentrasi-produk'],
      headerRepo: konsentrasiRepo,
      paramRepo: konsentrasiParamRepo,
      nilaiRepo: konsentrasiNilaiRepo,
      parentRelationName: 'konsentrasi',
    });
    this.moduleConfigs.set('hukum-regulatory', {
      name: 'hukum-regulatory',
      label: CATEGORY_LABEL_MAP['hukum-regulatory'],
      headerRepo: hukumRepo,
      paramRepo: hukumParamRepo,
      nilaiRepo: hukumNilaiRepo,
      parentRelationName: 'hukum',
    });
    this.moduleConfigs.set('kepatuhan-regulatory', {
      name: 'kepatuhan-regulatory',
      label: CATEGORY_LABEL_MAP['kepatuhan-regulatory'],
      headerRepo: kepatuhanRepo,
      paramRepo: kepatuhanParamRepo,
      nilaiRepo: kepatuhanNilaiRepo,
      parentRelationName: 'kepatuhan',
    });
    this.moduleConfigs.set('reputasi-regulatory', {
      name: 'reputasi-regulatory',
      label: CATEGORY_LABEL_MAP['reputasi-regulatory'],
      headerRepo: reputasiRepo,
      paramRepo: reputasiParamRepo,
      nilaiRepo: reputasiNilaiRepo,
      parentRelationName: 'reputasi',
    });
    this.moduleConfigs.set('strategis-regulatory', {
      name: 'strategis-regulatory',
      label: CATEGORY_LABEL_MAP['strategis-regulatory'],
      headerRepo: strategisRepo,
      paramRepo: strategisParamRepo,
      nilaiRepo: strategisNilaiRepo,
      parentRelationName: 'strategis',
    });
    this.moduleConfigs.set('investasi-regulatory', {
      name: 'investasi-regulatory',
      label: CATEGORY_LABEL_MAP['investasi-regulatory'],
      headerRepo: investasiRepo,
      paramRepo: investasiParamRepo,
      nilaiRepo: investasiNilaiRepo,
      parentRelationName: 'investasi',
    });
    this.moduleConfigs.set('rentabilitas-regulatory', {
      name: 'rentabilitas-regulatory',
      label: CATEGORY_LABEL_MAP['rentabilitas-regulatory'],
      headerRepo: rentabilitasRepo,
      paramRepo: rentabilitasParamRepo,
      nilaiRepo: rentabilitasNilaiRepo,
      parentRelationName: 'rentabilitas',
    });
    this.moduleConfigs.set('permodalan-regulatory', {
      name: 'permodalan-regulatory',
      label: CATEGORY_LABEL_MAP['permodalan-regulatory'],
      headerRepo: permodalanRepo,
      paramRepo: permodalanParamRepo,
      nilaiRepo: permodalanNilaiRepo,
      parentRelationName: 'permodalan',
    });
    this.moduleConfigs.set('tatakelola-regulatory', {
      name: 'tatakelola-regulatory',
      label: CATEGORY_LABEL_MAP['tatakelola-regulatory'],
      headerRepo: tatakelolaRepo,
      paramRepo: tatakelolaParamRepo,
      nilaiRepo: tatakelolaNilaiRepo,
      parentRelationName: 'tatakelola',
    });

    // Populate KPMR module configs
    this.kpmrModuleConfigs.set('operasional', {
      name: 'operasional',
      label: CATEGORY_LABEL_MAP['operasional'],
      headerEntity: KpmrOperasionalOjk,
      aspekEntity: KpmrAspekOperasional,
      pertanyaanEntity: KpmrPertanyaanOperasional,
    });
    this.kpmrModuleConfigs.set('pasar-produk', {
      name: 'pasar-produk',
      label: CATEGORY_LABEL_MAP['pasar-produk'],
      headerEntity: KpmrPasarProdukOjk,
      aspekEntity: KpmrAspekPasarProduk,
      pertanyaanEntity: KpmrPertanyaanPasarProduk,
    });
    this.kpmrModuleConfigs.set('likuiditas-produk', {
      name: 'likuiditas-produk',
      label: CATEGORY_LABEL_MAP['likuiditas-produk'],
      headerEntity: KpmrLikuiditasProdukOjk,
      aspekEntity: KpmrAspekLikuiditasProduk,
      pertanyaanEntity: KpmrPertanyaanLikuiditasProduk,
    });
    this.kpmrModuleConfigs.set('kredit-produk', {
      name: 'kredit-produk',
      label: CATEGORY_LABEL_MAP['kredit-produk'],
      headerEntity: KpmrKreditOjk,
      aspekEntity: KpmrAspekKredit,
      pertanyaanEntity: KpmrPertanyaanKredit,
    });
    this.kpmrModuleConfigs.set('konsentrasi-produk', {
      name: 'konsentrasi-produk',
      label: CATEGORY_LABEL_MAP['konsentrasi-produk'],
      headerEntity: KpmrKonsentrasiOjk,
      aspekEntity: KpmrAspekKonsentrasi,
      pertanyaanEntity: KpmrPertanyaanKonsentrasi,
    });
    this.kpmrModuleConfigs.set('hukum-regulatory', {
      name: 'hukum-regulatory',
      label: CATEGORY_LABEL_MAP['hukum-regulatory'],
      headerEntity: KpmrHukumOjk,
      aspekEntity: KpmrAspekHukum,
      pertanyaanEntity: KpmrPertanyaanHukum,
    });
    this.kpmrModuleConfigs.set('kepatuhan-regulatory', {
      name: 'kepatuhan-regulatory',
      label: CATEGORY_LABEL_MAP['kepatuhan-regulatory'],
      headerEntity: KpmrKepatuhanOjk,
      aspekEntity: KpmrAspekKepatuhan,
      pertanyaanEntity: KpmrPertanyaanKepatuhan,
    });
    this.kpmrModuleConfigs.set('reputasi-regulatory', {
      name: 'reputasi-regulatory',
      label: CATEGORY_LABEL_MAP['reputasi-regulatory'],
      headerEntity: KpmrReputasiOjk,
      aspekEntity: KpmrAspekReputasi,
      pertanyaanEntity: KpmrPertanyaanReputasi,
    });
    this.kpmrModuleConfigs.set('strategis-regulatory', {
      name: 'strategis-regulatory',
      label: CATEGORY_LABEL_MAP['strategis-regulatory'],
      headerEntity: KpmrStrategisOjk,
      aspekEntity: KpmrAspekStrategis,
      pertanyaanEntity: KpmrPertanyaanStrategis,
    });
    this.kpmrModuleConfigs.set('investasi-regulatory', {
      name: 'investasi-regulatory',
      label: CATEGORY_LABEL_MAP['investasi-regulatory'],
      headerEntity: KpmrInvestasiOjk,
      aspekEntity: KpmrAspekInvestasi,
      pertanyaanEntity: KpmrPertanyaanInvestasi,
    });
    this.kpmrModuleConfigs.set('rentabilitas-regulatory', {
      name: 'rentabilitas-regulatory',
      label: CATEGORY_LABEL_MAP['rentabilitas-regulatory'],
      headerEntity: KpmrRentabilitasOjk,
      aspekEntity: KpmrAspekRentabilitas,
      pertanyaanEntity: KpmrPertanyaanRentabilitas,
    });
    this.kpmrModuleConfigs.set('permodalan-regulatory', {
      name: 'permodalan-regulatory',
      label: CATEGORY_LABEL_MAP['permodalan-regulatory'],
      headerEntity: KpmrPermodalanOjk,
      aspekEntity: KpmrAspekPermodalan,
      pertanyaanEntity: KpmrPertanyaanPermodalan,
    });
    this.kpmrModuleConfigs.set('tatakelola-regulatory', {
      name: 'tatakelola-regulatory',
      label: CATEGORY_LABEL_MAP['tatakelola-regulatory'],
      headerEntity: KpmrTatakelolaOjk,
      aspekEntity: KpmrAspekTatakelola,
      pertanyaanEntity: KpmrPertanyaanTatakelola,
    });
  }

  // ==================== GET ALL DATA ====================
  async getAllRekapData(query: GetAllRekapDto): Promise<RekapDataResponseDto> {
    this.logger.log(`📊 Get rekap data with query: ${JSON.stringify(query)}`);

    const {
      year,
      quarter,
      categories,
      search,
      model,
      prinsip,
      jenis,
      underlying,
    } = query;

    // Tentukan categories yang akan di-fetch
    const targetCategories =
      categories && categories.length > 0
        ? categories.filter((c) => this.moduleConfigs.has(c))
        : Array.from(this.moduleConfigs.keys());

    const result: Record<string, RekapParameterResponseDto[]> = {};
    let totalParams = 0;

    for (const catId of targetCategories) {
      const config = this.moduleConfigs.get(catId);
      if (!config) continue;

      try {
        const data = await this.fetchCategoryData(
          config,
          year,
          quarter,
          search,
          model,
          prinsip,
          jenis,
          underlying,
        );
        result[catId] = data;
        totalParams += data.length;
      } catch (error) {
        this.logger.error(
          `Error fetching data for category ${catId}: ${error.message}`,
        );
        result[catId] = [];
      }
    }

    return {
      success: true,
      data: result,
      totalCategories: targetCategories.length,
      totalParameters: totalParams,
      message: `Data berhasil dimuat untuk ${targetCategories.length} kategori`,
    };
  }

  // ==================== FETCH PER CATEGORY ====================
  private async fetchCategoryData(
    config: ModuleConfig,
    year?: number,
    quarter?: number,
    search?: string,
    model?: string,
    prinsip?: string,
    jenis?: string,
    underlying?: string[],
  ): Promise<RekapParameterResponseDto[]> {
    // Build query untuk header
    const headerQuery = config.headerRepo
      .createQueryBuilder('header')
      .leftJoinAndSelect('header.parameters', 'params')
      .leftJoinAndSelect('params.nilaiList', 'nilai')
      .orderBy('params.orderIndex', 'ASC')
      .addOrderBy('nilai.orderIndex', 'ASC');

    if (year) {
      headerQuery.andWhere('header.year = :year', { year });
    }
    if (quarter) {
      headerQuery.andWhere('header.quarter = :quarter', { quarter });
    }

    const headers = await headerQuery.getMany();
    const allParams: RekapParameterResponseDto[] = [];

    for (const header of headers) {
      const params = header.parameters || [];

      for (const param of params) {
        // Filter by search
        if (search) {
          const s = search.toLowerCase();
          const hitParam =
            (param.judul || '').toLowerCase().includes(s) ||
            String(param.nomor || '').includes(s);

          const hitNilai = (param.nilaiList || []).some((nilai) =>
            (nilai.judul?.text || '').toLowerCase().includes(s),
          );

          if (!hitParam && !hitNilai) continue;
        }

        // Filter by kategori
        const kategori = param.kategori || {};
        let shouldInclude = true;

        if (model && kategori.model !== model) {
          shouldInclude = false;
        }
        if (
          prinsip &&
          kategori.model !== 'tanpa_model' &&
          kategori.prinsip !== prinsip
        ) {
          shouldInclude = false;
        }
        if (
          jenis &&
          kategori.model === 'open_end' &&
          kategori.jenis !== jenis
        ) {
          shouldInclude = false;
        }
        if (
          underlying &&
          underlying.length > 0 &&
          kategori.model === 'terstruktur'
        ) {
          const paramUnderlying = Array.isArray(kategori.underlying)
            ? kategori.underlying
            : [];
          const hasOverlap = underlying.some((v) =>
            paramUnderlying.includes(v),
          );
          if (!hasOverlap) shouldInclude = false;
        }

        if (!shouldInclude) continue;

        const paramDto: RekapParameterResponseDto = {
          categoryId: config.name,
          categoryLabel: config.label,
          id: param.id,
          year: header.year,
          quarter: header.quarter,
          nomor: param.nomor || '',
          judul: param.judul,
          bobot: Number(param.bobot),
          kategori: kategori,
          orderIndex: param.orderIndex,
          nilaiList: (param.nilaiList || []).map((nilai) => ({
            id: nilai.id,
            nomor: nilai.nomor || '',
            bobot: Number(nilai.bobot),
            portofolio: nilai.portofolio || '',
            keterangan: nilai.keterangan || '',
            judul: nilai.judul || {},
            riskindikator: nilai.riskindikator || {},
            orderIndex: nilai.orderIndex,
          })),
        };

        allParams.push(paramDto);
      }
    }

    return allParams;
  }

  // ==================== UPDATE NILAI VALUE ====================
  async updateNilaiValue(
    dto: UpdateNilaiValueDto,
  ): Promise<UpdateNilaiResponseDto> {
    this.logger.log(`📝 Update nilai value: ${JSON.stringify(dto)}`);

    const config = this.moduleConfigs.get(dto.categoryId);
    if (!config) {
      throw new BadRequestException(
        `Kategori '${dto.categoryId}' tidak ditemukan`,
      );
    }

    // Cari nilai berdasarkan ID
    const nilai = await config.nilaiRepo.findOne({
      where: { id: dto.itemId },
      relations: ['parameter'],
    });

    if (!nilai) {
      throw new NotFoundException(
        `Nilai dengan ID ${dto.itemId} tidak ditemukan`,
      );
    }

    // Update value berdasarkan field yang dikirim
    if (dto.value !== undefined) {
      nilai.judul = nilai.judul || {};
      nilai.judul.value = dto.value;
      // PERBAIKAN: Jangan set valuePembilang otomatis
    }

    if (dto.valuePembilang !== undefined) {
      nilai.judul = nilai.judul || {};
      nilai.judul.valuePembilang = dto.valuePembilang;
    }

    if (dto.valuePenyebut !== undefined) {
      nilai.judul = nilai.judul || {};
      nilai.judul.valuePenyebut = dto.valuePenyebut;
    }

    const saved = await config.nilaiRepo.save(nilai);

    try {
      const parameter = await config.paramRepo.findOne({
        where: { id: saved.parameterId },
        relations: [config.parentRelationName],
      });
      if (parameter && parameter[config.parentRelationName]) {
        const headerId = parameter[config.parentRelationName].id;
        await this.recalculateHeaderSummary(config, headerId);
      }
    } catch (err) {
      this.logger.error(`Error triggering recalculation in updateNilaiValue: ${err.message}`);
    }

    return {
      success: true,
      message: 'Nilai berhasil diupdate',
      data: {
        id: saved.id,
        nomor: saved.nomor || '',
        bobot: Number(saved.bobot),
        portofolio: saved.portofolio || '',
        keterangan: saved.keterangan || '',
        judul: saved.judul || {},
        riskindikator: saved.riskindikator || {},
        orderIndex: saved.orderIndex,
      },
    };
  }

  // ==================== GET SINGLE CATEGORY DATA ====================
  async getCategoryData(
    categoryId: string,
    year?: number,
    quarter?: number,
  ): Promise<RekapParameterResponseDto[]> {
    const config = this.moduleConfigs.get(categoryId);
    if (!config) {
      throw new NotFoundException(`Kategori '${categoryId}' tidak ditemukan`);
    }

    return this.fetchCategoryData(config, year, quarter);
  }

  // ==================== GET AVAILABLE CATEGORIES ====================
  getAvailableCategories() {
    return Array.from(this.moduleConfigs.entries()).map(([id, config]) => ({
      id,
      label: config.label,
    }));
  }

  // ==================== GET ALL MODULE CONFIGS (untuk debugging) ====================
  getModuleConfigs() {
    return this.moduleConfigs;
  }

  async clonePeriodData(
    dto: CloneOjkRekapDataDto,
    createdBy?: string,
  ): Promise<{
    success: boolean;
    modulesCloned: number;
    parametersCloned: number;
    valuesCloned: number;
    clonedCategories?: string[];
    skippedCategories?: string[];
  }> {
    const { sourceYear, sourceQuarter, targetYear, targetQuarter, overrideExisting = false, categories } = dto;

    if (sourceYear === targetYear && sourceQuarter === targetQuarter) {
      throw new BadRequestException('Periode asal dan periode tujuan tidak boleh sama.');
    }

    // Tentukan kategori/modul yang akan dikloning
    const targetCategories =
      categories && categories.length > 0
        ? categories.filter((c) => this.moduleConfigs.has(c))
        : Array.from(this.moduleConfigs.keys());

    if (targetCategories.length === 0) {
      throw new BadRequestException('Kategori yang valid wajib dipilih untuk kloning.');
    }

    // 1. Cek apakah ada data di periode target (hanya jika target memiliki parameter)
    if (!overrideExisting) {
      for (const catId of targetCategories) {
        const config = this.moduleConfigs.get(catId);
        if (!config) continue;

        const header = await config.headerRepo.findOne({
          where: { year: targetYear, quarter: targetQuarter },
          relations: ['parameters'],
        });

        if (header && header.parameters && header.parameters.length > 0) {
          throw new BadRequestException(
            `Data target untuk '${config.label}' pada periode ${targetYear} Q${targetQuarter} sudah ada. Gunakan opsi 'overrideExisting' untuk menimpa data.`,
          );
        }
      }
    }

    let modulesCloned = 0;
    let parametersCloned = 0;
    let valuesCloned = 0;
    const clonedCategories: string[] = [];
    const skippedCategories: string[] = [];

    for (const catId of targetCategories) {
      const config = this.moduleConfigs.get(catId);
      if (!config) continue;

      // Cari source header dengan parameter dan nilai
      const sourceHeader = await config.headerRepo.findOne({
        where: { year: sourceYear, quarter: sourceQuarter },
        relations: ['parameters', 'parameters.nilaiList'],
      });

      if (!sourceHeader) {
        this.logger.warn(`Source data not found for category '${catId}' at ${sourceYear} Q${sourceQuarter}. Skipping.`);
        skippedCategories.push(config.label || catId);
        continue;
      }

      // Cari apakah ada target header yang sudah ada
      const existingTarget = await config.headerRepo.findOne({
        where: { year: targetYear, quarter: targetQuarter },
        relations: ['parameters'],
      });

      // Jika target header ada, hapus jika overrideExisting = true atau jika target header tersebut kosong (no parameters)
      if (existingTarget) {
        if (overrideExisting || !existingTarget.parameters || existingTarget.parameters.length === 0) {
          this.logger.log(`🗑️ Deleting empty or override target header for '${config.label}' at ${targetYear} Q${targetQuarter}`);
          await config.headerRepo.remove(existingTarget);
        }
      }

      // Buat target header baru
      const targetHeader = config.headerRepo.create({
        year: targetYear,
        quarter: targetQuarter,
        isActive: sourceHeader.isActive,
        createdBy: createdBy || 'system',
        version: sourceHeader.version || '1.0.0',
        summary: sourceHeader.summary ? { ...sourceHeader.summary } : undefined,
      });

      const savedHeader = await config.headerRepo.save(targetHeader);
      modulesCloned++;
      clonedCategories.push(config.label || catId);

      // Kloning parameter dan nilainya
      const sourceParams = sourceHeader.parameters || [];
      for (const param of sourceParams) {
        const targetParam = config.paramRepo.create({
          nomor: param.nomor,
          judul: param.judul,
          bobot: param.bobot,
          kategori: param.kategori ? { ...param.kategori } : undefined,
          orderIndex: param.orderIndex,
          [config.parentRelationName]: savedHeader,
        });

        const savedParam = await config.paramRepo.save(targetParam);
        parametersCloned++;

        const sourceNilaiList = param.nilaiList || [];
        for (const nilai of sourceNilaiList) {
          const targetNilai = config.nilaiRepo.create({
            nomor: nilai.nomor,
            judul: nilai.judul ? { ...nilai.judul } : undefined,
            bobot: nilai.bobot,
            portofolio: nilai.portofolio,
            keterangan: nilai.keterangan,
            sumberRisiko: nilai.sumberRisiko,
            dampak: nilai.dampak,
            riskindikator: nilai.riskindikator ? { ...nilai.riskindikator } : undefined,
            orderIndex: nilai.orderIndex,
            parameter: savedParam,
          });

          await config.nilaiRepo.save(targetNilai);
          valuesCloned++;
        }
      }
      
      await this.recalculateHeaderSummary(config, savedHeader.id);
    }

    return {
      success: true,
      modulesCloned,
      parametersCloned,
      valuesCloned,
      clonedCategories,
      skippedCategories,
    };
  }

  // ==================== UNDO CLONE PERIOD DATA ====================
  async undoClonePeriodData(
    dto: UndoCloneOjkRekapDataDto,
  ): Promise<{ success: boolean; modulesDeleted: number }> {
    const { targetYear, targetQuarter, categories } = dto;
    let modulesDeleted = 0;
    this.logger.log(`🔄 Undo clone for OJK data: targetYear=${targetYear}, targetQuarter=Q${targetQuarter}`);

    // Tentukan kategori/modul yang akan di-undo
    const targetCategories =
      categories && categories.length > 0
        ? categories.filter((c) => this.moduleConfigs.has(c))
        : Array.from(this.moduleConfigs.keys());

    for (const catId of targetCategories) {
      const config = this.moduleConfigs.get(catId);
      if (!config) continue;

      // Cari target header dan hapus (cascade delete ke parameter dan nilai)
      const existingTarget = await config.headerRepo.findOne({
        where: { year: targetYear, quarter: targetQuarter },
      });
      if (existingTarget) {
        this.logger.log(`🗑️ Deleting target header for OJK category '${catId}' at ${targetYear} Q${targetQuarter}`);
        await config.headerRepo.remove(existingTarget);
        modulesDeleted++;
      }
    }

    return {
      success: true,
      modulesDeleted,
    };
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
    quarter: number,
  ): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    if (jsonData.length < 2) {
      throw new BadRequestException('File Excel tidak valid: tidak ada data');
    }

    const headers = jsonData[0];
    const qLabel = { 1: 'MAR', 2: 'JUN', 3: 'SEP', 4: 'DES' }[quarter];
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

    // Build reverse category map
    const REVERSE_CATEGORY_MAP: Record<string, string> = {};
    Object.entries(CATEGORY_LABEL_MAP).forEach(([key, val]) => {
      REVERSE_CATEGORY_MAP[val.toLowerCase().trim()] = key;
    });

    let currentCategoryLabel = '';
    let currentParameter = '';
    let totalUpdated = 0;

    const updatedHeadersMap = new Map<string, { config: any; headerId: number }>();

    let i = 1;
    while (i < jsonData.length) {
      const row = jsonData[i];
      if (!row || row.length === 0) {
        i++;
        continue;
      }

      const col0 = row[0]; // Jenis Risiko
      const col1 = row[1]; // Parameter
      const col2 = row[2]; // Nilai atau Indicator
      const col3 = row[3]; // Type

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
        currentCategoryLabel = String(col0).trim();
      }
      if (!isCol1Empty) {
        currentParameter = String(col1).trim();
      }

      const indicatorLabel = String(col2 || '').trim();
      const type = String(col3 || '').trim();

      if (!currentCategoryLabel || !currentParameter || !indicatorLabel) {
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

      // Find the category config
      const categoryId = REVERSE_CATEGORY_MAP[currentCategoryLabel.toLowerCase()];
      const config = this.moduleConfigs.get(categoryId);

      if (!config) {
        i += rowsToSkip;
        continue;
      }

      // Find the Parameter in DB
      const param = await config.paramRepo.findOne({
        where: {
          judul: currentParameter,
          [config.parentRelationName]: { year, quarter },
        },
        relations: [config.parentRelationName],
      });

      if (param) {
        // Find the Nilai record by matching the judul.text in memory
        const nilaiList = await config.nilaiRepo.find({
          where: { parameterId: param.id },
        });

        const existingNilai = nilaiList.find(
          (n) => String(n.judul?.text || '').trim() === indicatorLabel,
        );

        if (existingNilai) {
          const itemType = existingNilai.judul?.type || 'Tanpa Faktor';

          if (itemType === 'Tanpa Faktor') {
            const val = this.parseExcelNumber(row[valueColIdx]);
            existingNilai.judul.value = val;
            existingNilai.judul.valuePembilang = val;
          } else if (itemType === 'Satu Faktor') {
            if (detailRows.length >= 1) {
              const val = this.parseExcelNumber(detailRows[0][valueColIdx]);
              existingNilai.judul.valuePembilang = val;
            }
          } else if (itemType === 'Dua Faktor') {
            if (detailRows.length >= 2) {
              existingNilai.judul.valuePembilang = this.parseExcelNumber(detailRows[0][valueColIdx]);
              existingNilai.judul.valuePenyebut = this.parseExcelNumber(detailRows[1][valueColIdx]);
            } else if (detailRows.length === 1) {
              const label = String(detailRows[0][2] || '').toLowerCase();
              const val = this.parseExcelNumber(detailRows[0][valueColIdx]);
              if (label.includes('pembilang') || label.includes('numerator')) {
                existingNilai.judul.valuePembilang = val;
              } else {
                existingNilai.judul.valuePenyebut = val;
              }
            }
          }

          // Save the Nilai record to DB
          await config.nilaiRepo.save(existingNilai);
          totalUpdated++;
          
          if (param[config.parentRelationName]) {
            const headerId = param[config.parentRelationName].id;
            updatedHeadersMap.set(`${categoryId}|${headerId}`, { config, headerId });
          }
        }
      }

      i += rowsToSkip;
    }

    for (const { config: cfg, headerId } of updatedHeadersMap.values()) {
      await this.recalculateHeaderSummary(cfg, headerId);
    }

    return {
      success: true,
      totalImported: totalUpdated,
      message: `Berhasil mengimpor ${totalUpdated} data nilai OJK`,
    };
  }

  // ==================== CLONE KPMR PERIOD DATA ====================
  async cloneKpmrPeriodData(
    dto: CloneOjkKpmrDataDto,
    createdBy?: string,
  ): Promise<{
    success: boolean;
    modulesCloned: number;
    aspectsCloned: number;
    questionsCloned: number;
    clonedCategories?: string[];
    skippedCategories?: string[];
  }> {
    const { sourceYear, targetYear, overrideExisting = false, categories } = dto;

    if (sourceYear === targetYear) {
      throw new BadRequestException('Tahun asal dan tahun tujuan tidak boleh sama.');
    }

    // Tentukan kategori/modul yang akan dikloning
    const targetCategories =
      categories && categories.length > 0
        ? categories.filter((c) => this.kpmrModuleConfigs.has(c))
        : Array.from(this.kpmrModuleConfigs.keys());

    if (targetCategories.length === 0) {
      throw new BadRequestException('Kategori yang valid wajib dipilih untuk kloning.');
    }

    // 1. Cek apakah ada data di periode target (cek semua quarter di targetYear dan pastikan memiliki aspek)
    if (!overrideExisting) {
      for (const catId of targetCategories) {
        const config = this.kpmrModuleConfigs.get(catId);
        if (!config) continue;

        const headerRepo = this.dataSource.getRepository(config.headerEntity);
        const headers = await headerRepo.find({
          where: { year: targetYear },
          relations: ['aspekList'],
        });

        const hasData = headers.some((h: any) => h.aspekList && h.aspekList.length > 0);

        if (hasData) {
          throw new BadRequestException(
            `Data KPMR target untuk '${config.label}' pada tahun ${targetYear} sudah ada. Gunakan opsi 'overrideExisting' untuk menimpa data.`,
          );
        }
      }
    }

    let modulesCloned = 0;
    let aspectsCloned = 0;
    let questionsCloned = 0;
    const clonedCategories: string[] = [];
    const skippedCategories: string[] = [];

    for (const catId of targetCategories) {
      const config = this.kpmrModuleConfigs.get(catId);
      if (!config) continue;

      const headerRepo = this.dataSource.getRepository(config.headerEntity);
      const aspekRepo = this.dataSource.getRepository(config.aspekEntity);
      const pertanyaanRepo = this.dataSource.getRepository(config.pertanyaanEntity);

      // Cari source header dengan aspek dan pertanyaan (cek Q1-Q4 untuk menemukan data template)
      let sourceHeader: any = null;
      for (let q = 1; q <= 4; q++) {
        sourceHeader = await headerRepo.findOne({
          where: { year: sourceYear, quarter: q },
          relations: ['aspekList', 'aspekList.pertanyaanList'],
        });
        if (sourceHeader && sourceHeader.aspekList && sourceHeader.aspekList.length > 0) {
          break;
        }
      }

      let usedFallback = false;
      // FALLBACK: Cek jika sourceHeader kosong atau tidak memiliki aspek
      if (!sourceHeader || !sourceHeader.aspekList || sourceHeader.aspekList.length === 0) {
        this.logger.log(
          `⚠️ Source data not found for KPMR category '${catId}' at year ${sourceYear}. Trying fallback from other categories.`,
        );

        // Coba cari dari category hukum-regulatory first, lalu yang lain
        const fallbackOrder = [
          'hukum-regulatory',
          ...Array.from(this.kpmrModuleConfigs.keys()).filter((k) => k !== catId),
        ];

        for (const fbCatId of fallbackOrder) {
          const fbConfig = this.kpmrModuleConfigs.get(fbCatId);
          if (!fbConfig) continue;

          const fbHeaderRepo = this.dataSource.getRepository(fbConfig.headerEntity);
          let fbHeader: any = null;

          for (let q = 1; q <= 4; q++) {
            fbHeader = await fbHeaderRepo.findOne({
              where: { year: sourceYear, quarter: q },
              relations: ['aspekList', 'aspekList.pertanyaanList'],
            });
            if (fbHeader && fbHeader.aspekList && fbHeader.aspekList.length > 0) {
              break;
            }
          }

          if (fbHeader && fbHeader.aspekList && fbHeader.aspekList.length > 0) {
            sourceHeader = fbHeader;
            usedFallback = true;
            this.logger.log(
              `✅ Found fallback template from category '${fbCatId}' for target category '${catId}'`,
            );
            break;
          }
        }
      }

      if (!sourceHeader || !sourceHeader.aspekList || sourceHeader.aspekList.length === 0) {
        this.logger.warn(`Source data not found for KPMR category '${catId}' at year ${sourceYear} (including fallback). Skipping.`);
        skippedCategories.push(config.label || catId);
        continue;
      }

      // Hapus target header terlebih dahulu jika overrideExisting = true atau jika target header tersebut kosong (no aspek)
      const existingTargets = await headerRepo.find({
        where: { year: targetYear },
        relations: ['aspekList'],
      });

      for (const target of existingTargets) {
        if (overrideExisting || !target.aspekList || target.aspekList.length === 0) {
          this.logger.log(`🗑️ Deleting empty or override KPMR target header for '${config.label}' at year ${targetYear} Q${target.quarter}`);
          await headerRepo.remove(target);
        }
      }

      // Kloning aspek dan pertanyaan ke keempat quarter
      for (let targetQuarter = 1; targetQuarter <= 4; targetQuarter++) {
        // Buat target header baru untuk quarter ini
        const targetHeader = headerRepo.create({
          year: targetYear,
          quarter: targetQuarter,
          isActive: sourceHeader.isActive,
          isLocked: false,
          createdBy: createdBy || 'system',
          version: sourceHeader.version || '1.0.0',
          summary: sourceHeader.summary ? { ...sourceHeader.summary } : undefined,
          notes: `KPMR ${config.label} ${targetYear} Q${targetQuarter}`,
        });

        const savedHeader = await headerRepo.save(targetHeader);

        // Cari source header spesifik untuk quarter ini
        const currentSourceHeader = await headerRepo.findOne({
          where: { year: sourceYear, quarter: targetQuarter },
          relations: ['aspekList', 'aspekList.pertanyaanList'],
        });

        const sourceHeaderToUse = (!usedFallback && currentSourceHeader && currentSourceHeader.aspekList?.length > 0)
          ? currentSourceHeader
          : sourceHeader;

        // Kloning aspek dan pertanyaan
        const sourceAspeks = sourceHeaderToUse.aspekList || [];
        for (const aspek of sourceAspeks) {
          const targetAspek = aspekRepo.create({
            nomor: aspek.nomor,
            judul: aspek.judul,
            bobot: aspek.bobot,
            deskripsi: aspek.deskripsi,
            kpmrOjkId: savedHeader.id,
            kpmrId: savedHeader.id,
            orderIndex: aspek.orderIndex,
            averageScore: aspek.averageScore,
            rating: aspek.rating,
            notes: aspek.notes,
            updatedBy: createdBy || 'system',
          });

          const savedAspek = await aspekRepo.save(targetAspek);
          aspectsCloned++;

          const sourcePertanyaans = aspek.pertanyaanList || [];
          for (const pertanyaan of sourcePertanyaans) {
            const targetPertanyaan = pertanyaanRepo.create({
              nomor: pertanyaan.nomor,
              pertanyaan: pertanyaan.pertanyaan,
              skor: pertanyaan.skor ? { ...pertanyaan.skor } : {},
              indicator: pertanyaan.indicator ? { ...pertanyaan.indicator } : undefined,
              evidence: pertanyaan.evidence,
              catatan: pertanyaan.catatan,
              aspekId: savedAspek.id,
              orderIndex: pertanyaan.orderIndex,
            });

            await pertanyaanRepo.save(targetPertanyaan);
            questionsCloned++;
          }
        }

        await this.recalculateKpmrSummary(config, savedHeader.id);
      }
      modulesCloned++;
      clonedCategories.push(config.label || catId);
    }

    return {
      success: true,
      modulesCloned,
      aspectsCloned,
      questionsCloned,
      clonedCategories,
      skippedCategories,
    };
  }

  // ==================== UNDO CLONE KPMR PERIOD DATA ====================
  async undoCloneKpmrPeriodData(
    dto: UndoCloneOjkKpmrDataDto,
  ): Promise<{ success: boolean; modulesDeleted: number }> {
    const { targetYear, categories } = dto;
    let modulesDeleted = 0;

    const targetCategories =
      categories && categories.length > 0
        ? categories.filter((c) => this.kpmrModuleConfigs.has(c))
        : Array.from(this.kpmrModuleConfigs.keys());

    for (const catId of targetCategories) {
      const config = this.kpmrModuleConfigs.get(catId);
      if (!config) continue;

      const headerRepo = this.dataSource.getRepository(config.headerEntity);
      const existingTargets = await headerRepo.find({
        where: { year: targetYear },
      });

      if (existingTargets.length > 0) {
        await headerRepo.remove(existingTargets);
        modulesDeleted++;
      }
    }

    return {
      success: true,
      modulesDeleted,
    };
  }

  // ==================== RESET KPMR PERIOD DATA (OJK) ====================
  async resetKpmrPeriodData(
    year: number,
    category: string,
  ): Promise<{ success: boolean; message: string }> {
    const config = this.kpmrModuleConfigs.get(category.toLowerCase());
    if (!config) {
      throw new BadRequestException(`Kategori KPMR '${category}' tidak dikenali.`);
    }

    const headerRepo = this.dataSource.getRepository(config.headerEntity);
    const existing = await headerRepo.findOne({
      where: { year, quarter: 1 },
    });

    if (existing) {
      await headerRepo.remove(existing);
    }

    return {
      success: true,
      message: `Data KPMR ${config.label} untuk tahun ${year} berhasil di-reset.`,
    };
  }

  private evaluateFormula(expr: string, subs: Record<string, number>): number {
    if (!expr || typeof expr !== 'string' || expr.trim() === '') return NaN;
    let e = expr.trim();
    for (const [token, value] of Object.entries(subs)) {
      const re = new RegExp(`\\b${token}\\b`, 'gi');
      e = e.replace(re, String(value));
    }
    const safeRe = /^[0-9eE\.\+\-\*\/\(\)\s]+$/;
    if (!safeRe.test(e)) {
      return NaN;
    }
    try {
      const fn = new Function(`"use strict"; return (${e});`);
      const val = fn();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        return val;
      }
      return NaN;
    } catch {
      return NaN;
    }
  }

  async recalculateHeaderSummary(config: ModuleConfig, headerId: number): Promise<void> {
    try {
      const header = await config.headerRepo.findOne({
        where: { id: headerId },
        relations: ['parameters', 'parameters.nilaiList'],
      });
      if (!header) return;

      let totalWeighted = 0;
      let totalParameterBobot = 0;
      if (header.parameters && header.parameters.length > 0) {
        for (const param of header.parameters) {
          const paramBobot = (Number(param.bobot) || 0) / 100;
          totalParameterBobot += paramBobot;

          if (param.nilaiList && param.nilaiList.length > 0) {
            for (const nilai of param.nilaiList) {
              const paramBobotFraction = paramBobot;
              const nilaiBobotFraction = (Number(nilai.bobot) || 0) / 100;

              // 1. Dapatkan Raw Value dari Judul Nilai
              let rawValue = NaN;
              let rawString: string | null = null;
              const judul = nilai.judul || {};

              if (judul.type === 'Tanpa Faktor') {
                const v = judul.value;
                const formula = (judul.formula || '').trim();
                const parsed = this.parseExcelNumber(v);
                if (parsed !== null && !isNaN(parsed)) {
                  rawValue = formula ? this.evaluateFormula(formula, { pem: parsed }) : parsed;
                } else if (typeof v === 'string' && v.trim() !== '') {
                  rawString = v.trim().toLowerCase();
                }
              } else if (judul.type === 'Satu Faktor') {
                const v = judul.valuePembilang;
                const formula = (judul.formula || '').trim();
                const parsed = this.parseExcelNumber(v);
                if (parsed !== null && !isNaN(parsed)) {
                  rawValue = formula ? this.evaluateFormula(formula, { pem: parsed }) : parsed;
                } else if (typeof v === 'string' && v.trim() !== '') {
                  rawString = v.trim().toLowerCase();
                }
              } else if (judul.type === 'Dua Faktor') {
                const vPem = judul.valuePembilang;
                const vPen = judul.valuePenyebut;
                const formula = (judul.formula || '').trim();
                const pem = this.parseExcelNumber(vPem);
                const pen = this.parseExcelNumber(vPen);
                if (pem !== null && pen !== null && !isNaN(pem) && !isNaN(pen)) {
                  rawValue = formula ? this.evaluateFormula(formula, { pem, pen }) : pen !== 0 ? pem / pen : NaN;
                } else if (typeof vPem === 'string' && vPem.trim() !== '') {
                  rawString = vPem.trim().toLowerCase();
                }
              }

              // 2. Tentukan Peringkat (1 - 5) berdasarkan rentang Risk Indicator
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

              if (isNaN(rawValue) && rawString) {
                for (const { key, rank } of ranges) {
                  const riValue = String(ri[key] ?? '').trim().toLowerCase();
                  if (!riValue) continue;
                  if (riValue === rawString) {
                    peringkat = rank;
                    break;
                  }
                }
              }

              if (peringkat !== null) {
                totalWeighted += paramBobotFraction * nilaiBobotFraction * peringkat;
              }
            }
          }
        }
      }

      let finalWeighted = totalParameterBobot > 0 ? totalWeighted / totalParameterBobot : totalWeighted;
      finalWeighted = Math.min(5, Math.max(0, finalWeighted));
      const roundedTotal = Number(finalWeighted.toFixed(2));

      let summaryBg: string;
      if (roundedTotal <= 1.67) summaryBg = 'bg-green-400 text-black';
      else if (roundedTotal <= 2.33) summaryBg = 'bg-lime-300 text-black';
      else if (roundedTotal <= 3.00) summaryBg = 'bg-yellow-400 text-black';
      else if (roundedTotal <= 3.67) summaryBg = 'bg-orange-400 text-black';
      else summaryBg = 'bg-red-500 text-white';

      header.summary = {
        totalWeighted: roundedTotal,
        summaryBg,
        computedAt: new Date(),
      };
      await config.headerRepo.save(header);
      this.logger.log(
        `✅ Recalculated summary for header ID ${headerId}: totalWeighted=${roundedTotal}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Error recalculating summary for header ${headerId}: ${error.message}`,
        error.stack,
      );
    }
  }

  async recalculateKpmrSummary(config: KpmrModuleConfig, kpmrId: number): Promise<void> {
    this.logger.log(`📊 Recalculating summary for KPMR ID: ${kpmrId}`);

    try {
      const headerRepo = this.dataSource.getRepository(config.headerEntity);
      const aspekRepo = this.dataSource.getRepository(config.aspekEntity);

      const kpmr = await headerRepo.findOne({
        where: { id: kpmrId },
        relations: ['aspekList', 'aspekList.pertanyaanList'],
      });

      if (!kpmr) {
        this.logger.warn(
          `⚠️ KPMR with ID ${kpmrId} not found for summary recalculation`,
        );
        return;
      }

      const activeQuarterKey = `Q${kpmr.quarter}`;

      let totalScore = 0;
      let totalQuestions = 0;

      if (kpmr.aspekList && kpmr.aspekList.length > 0) {
        for (const aspek of kpmr.aspekList) {
          let aspekTotalScore = 0;
          let aspekQuestionCount = 0;

          if (aspek.pertanyaanList && aspek.pertanyaanList.length > 0) {
            for (const pertanyaan of aspek.pertanyaanList) {
              const score = pertanyaan.skor?.[activeQuarterKey];
              if (typeof score === 'number' && score >= 1 && score <= 5) {
                aspekTotalScore += score;
                aspekQuestionCount++;
              }
            }
          }

          const aspekAverageScore =
            aspekQuestionCount > 0
              ? aspekTotalScore / aspekQuestionCount
              : undefined;

          let rating: string | undefined;
          if (aspekAverageScore !== undefined) {
            if (aspekAverageScore >= 4.5) rating = 'Strong';
            else if (aspekAverageScore >= 3.5) rating = 'Satisfactory';
            else if (aspekAverageScore >= 2.5) rating = 'Fair';
            else if (aspekAverageScore >= 1.5) rating = 'Marginal';
            else rating = 'Unsatisfactory';
          }

          await aspekRepo.update(aspek.id, {
            averageScore: aspekAverageScore ?? undefined,
            rating: rating ?? undefined,
          });

          totalScore += aspekTotalScore;
          totalQuestions += aspekQuestionCount;
        }
      }

      const averageScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

      let overallRating: string | undefined;
      if (totalQuestions > 0) {
        if (averageScore >= 4.5) overallRating = 'Strong';
        else if (averageScore >= 3.5) overallRating = 'Satisfactory';
        else if (averageScore >= 2.5) overallRating = 'Fair';
        else if (averageScore >= 1.5) overallRating = 'Marginal';
        else overallRating = 'Unsatisfactory';
      }

      kpmr.summary = {
        totalScore: Number(totalScore.toFixed(2)),
        averageScore: Number(averageScore.toFixed(2)),
        rating: overallRating,
        computedAt: new Date(),
      };

      await headerRepo.save(kpmr);

      this.logger.log(
        `✅ Summary recalculated for KPMR ID ${kpmrId}: totalScore=${totalScore.toFixed(2)}, averageScore=${averageScore.toFixed(2)}, rating=${overallRating || 'N/A'}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Error recalculating summary for KPMR ${kpmrId}: ${error.message}`,
        error.stack,
      );
    }
  }
}