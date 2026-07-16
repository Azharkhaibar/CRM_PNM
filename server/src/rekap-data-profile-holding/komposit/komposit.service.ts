import { Injectable } from '@nestjs/common';
import { RekapData1Service } from '../rekap-data-1/rekap-data-1.service';

@Injectable()
export class KompositService {
  constructor(private readonly rekapData1Service: RekapData1Service) {}

  async getKompositSummary(year: number, quarter: string) {
    const allData = await this.rekapData1Service.getAllRekapData(year, quarter);
    const bhzConfig = allData.bhzConfig;
    const bvtConfig = allData.bvtConfig;

    const defaultBhz = {
      investasi: 10,
      pasar: 10,
      likuiditas: 10,
      operasional: 20,
      hukum: 10,
      strategis: 20,
      kepatuhan: 10,
      reputasi: 10,
    };

    const activeBhzConfig = bhzConfig || defaultBhz;

    const modules = [
      { key: 'investasi', label: 'Investasi', summaryKey: 'investasiSummary', kpmrKey: 'loadKPMRInvestasi' },
      { key: 'pasar', label: 'Pasar', summaryKey: 'pasarSummary', kpmrKey: 'loadKPMRPasar' },
      { key: 'likuiditas', label: 'Likuiditas', summaryKey: 'likuiditasSummary', kpmrKey: 'loadKPMRLikuiditas' },
      { key: 'operasional', label: 'Operasional', summaryKey: 'operasionalSummary', kpmrKey: 'loadKPMROperasional' },
      { key: 'hukum', label: 'Hukum', summaryKey: 'hukumSummary', kpmrKey: 'loadKPMRHukum' },
      { key: 'strategis', label: 'Strategis', summaryKey: 'strategisSummary', kpmrKey: 'loadKPMRStrategis' },
      { key: 'kepatuhan', label: 'Kepatuhan', summaryKey: 'kepatuhanSummary', kpmrKey: 'loadKPMRKepatuhan' },
      { key: 'reputasi', label: 'Reputasi', summaryKey: 'reputasiSummary', kpmrKey: 'loadKPMRReputasi' },
    ];

    const round1 = (n: number) => Math.round(n * 10) / 10;

    let totalNilaiInheren = 0;
    let totalNilaiKpmr = 0;

    const risks = modules.map((mod) => {
      const bvtValue = bvtConfig ? Number(bvtConfig[mod.key as keyof typeof bvtConfig] ?? 100) : 100;
      const summaryValue = this.rekapData1Service.calculateSummary((allData[mod.summaryKey as keyof typeof allData] || []) as any[]);
      const skorKPMR = this.rekapData1Service.calculateSkorKPMR((allData[mod.kpmrKey as keyof typeof allData] || []) as any[]);
      const skorInheren = summaryValue * (bvtValue / 100);

      const bhz = Number(activeBhzConfig[mod.key as keyof typeof activeBhzConfig] ?? defaultBhz[mod.key as keyof typeof defaultBhz]);

      totalNilaiInheren += round1(skorInheren) * (bhz / 100);
      totalNilaiKpmr += round1(skorKPMR) * (bhz / 100);

      return {
        label: mod.label,
        inherent: skorInheren,
        kpmr: skorKPMR,
      };
    });

    return {
      kompositA: totalNilaiInheren,
      kompositB: totalNilaiKpmr,
      bhzConfig: activeBhzConfig,
      risks,
    };
  }
}

