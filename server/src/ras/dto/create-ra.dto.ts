// src/modules/ras/dto/create-ra.dto.ts
// import { RiskStance, UnitType } from '../entities/ras.entity';

// ⚠️ Ganti dengan string types
export class CreateRasDto {
  year: number;
  riskCategory: string;
  no?: number;
  parameter: string;
  statement?: string;
  formulasi?: string;
  riskStance: string; // Ganti RiskStance dengan string
  unitType: string;   // Ganti UnitType dengan string
  dataTypeExplanation?: string;
  notes?: string;
  rkapTarget?: string;
  rasLimit?: string;
  hasNumeratorDenominator: boolean;
  numeratorLabel?: string;
  denominatorLabel?: string;
  monthlyValues?: Record<
    number,
    {
      num?: number | null;
      den?: number | null;
      man?: number | null;
    }
  >;
  groupId?: string;
  tindakLanjut?: any;
}