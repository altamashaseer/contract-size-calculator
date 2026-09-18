export type InstrumentType = 'NQ' | 'MNQ';

export interface InstrumentConfig {
  type: InstrumentType;
  name: string;
  ticker: string;
  pointValue: number; // $20 for NQ, $2 for MNQ
  commissionPerContract: number; // $5.00 for NQ, $1.50 for MNQ
  minTick: number; // 0.25
  accentColor: string;
}

export interface ContractResult {
  instrument: InstrumentType;
  name: string;
  ticker: string;
  pointValue: number;
  commissionPerContract: number;
  rawContracts: number;
  flooredContracts: number;
  totalCommission: number;
  totalRisk: number;
  isViable: boolean; // flooredContracts >= 1
  isRecommended: boolean; // Based on handwritten note rule
  riskEfficiency: number; // (totalRisk / targetSL) * 100
}

export interface CalculationSummary {
  slAmount: number;
  slPoints: number;
  nq: ContractResult;
  mnq: ContractResult;
  recommendedInstrument: InstrumentType | null;
  ruleEvaluation: {
    ratio: number; // slAmount / 20
    isRatioGreaterThanPoints: boolean; // slAmount / 20 > slPoints
  };
}
