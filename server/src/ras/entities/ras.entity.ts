// src/modules/ras/entities/ras.entity.ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// ⚠️ HAPUS ENUM atau ganti dengan string types
// export enum RiskStance {
//   TIDAK_TOLERAN = 'Tidak Toleran',
//   KONSERVATIF = 'Konservatif',
//   MODERAT = 'Moderat',
//   STRATEGIS = 'Strategis',
// }

// export enum UnitType {
//   PERCENTAGE = 'PERCENTAGE',
//   RUPIAH = 'RUPIAH',
//   X = 'X',
//   REAL = 'REAL',
//   HOUR = 'HOUR',
// }

// ⚠️ GANTI DENGAN TIPE STRING BIASA
export type RiskStance =
  | 'Tidak Toleran'
  | 'Konservatif'
  | 'Moderat'
  | 'Strategis';
export type UnitType = 'PERCENTAGE' | 'RUPIAH' | 'X' | 'REAL' | 'HOUR';

// Tetap pertahankan untuk reference (optional)
export const RiskStanceOptions = [
  'Tidak Toleran',
  'Konservatif',
  'Moderat',
  'Strategis',
] as const;
export const UnitTypeOptions = [
  'PERCENTAGE',
  'RUPIAH',
  'X',
  'REAL',
  'HOUR',
] as const;

export enum TindakLanjutStatus {
  ON_PROGRESS = 'On Progress',
  DONE = 'Done',
}

export type MonthlyValue = {
  num?: number | null;
  den?: number | null;
  man?: number | null;
  calculatedValue?: number | null;
};

export type TindakLanjut = {
  korektifOwner?: string;
  antisipasiOwner?: string;
  korektifSupport?: string;
  antisipasiSupport?: string;
  statusKorektifOwner?: TindakLanjutStatus;
  targetKorektifOwner?: string;
  statusAntisipasiOwner?: TindakLanjutStatus;
  targetAntisipasiOwner?: string;
  statusKorektifSupport?: TindakLanjutStatus;
  targetKorektifSupport?: string;
  statusAntisipasiSupport?: TindakLanjutStatus;
  targetAntisipasiSupport?: string;
};

@Entity('risk_appetite_statement')
@Index('idx_year', ['year'])
@Index('idx_riskCategory', ['riskCategory'])
@Index('idx_groupId', ['groupId'])
@Index('idx_year_risk', ['year', 'riskCategory'])
export class RasData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column({ nullable: true })
  groupId: string;

  @Column()
  riskCategory: string;

  @Column({ nullable: true })
  no: number;

  @Column({ type: 'text' })
  parameter: string;

  @Column({ type: 'text', nullable: true })
  statement: string;

  @Column({ type: 'text', nullable: true })
  formulasi: string;

  // ⚠️ GANTI dari enum ke varchar
  // @Column({
  //   type: 'enum',
  //   enum: RiskStance,
  //   default: RiskStance.MODERAT,
  // })
  @Column({
    type: 'varchar',
    length: 50,
    default: 'Moderat',
  })
  riskStance: string; // Ganti RiskStance dengan string

  // @Column({
  //   type: 'enum',
  //   enum: UnitType,
  //   default: UnitType.PERCENTAGE,
  // })
  @Column({
    type: 'varchar',
    length: 20,
    default: 'PERCENTAGE',
  })
  unitType: string; // Ganti UnitType dengan string

  @Column({ type: 'text', nullable: true })
  dataTypeExplanation: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  rkapTarget: string;

  @Column({ type: 'text', nullable: true })
  rasLimit: string;

  @Column({ default: false })
  hasNumeratorDenominator: boolean;

  @Column({ type: 'text', nullable: true })
  numeratorLabel: string;

  @Column({ type: 'text', nullable: true })
  denominatorLabel: string;

  @Column({ type: 'json', nullable: true })
  monthlyValues: Record<number, MonthlyValue>;

  @Column({ type: 'json', nullable: true })
  tindakLanjut: TindakLanjut;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
