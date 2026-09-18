import type { CalculationSummary, ContractResult, InstrumentConfig } from '../types/calculator';

export const INSTRUMENTS: Record<'NQ' | 'MNQ', InstrumentConfig> = {
  NQ: {
    type: 'NQ',
    name: 'E-mini Nasdaq-100',
    ticker: 'NQ',
    pointValue: 20, // $20 per point
    commissionPerContract: 5.0, // $5.00 roundtrip
    minTick: 0.25,
    accentColor: '#F59E0B', // Amber
  },
  MNQ: {
    type: 'MNQ',
    name: 'Micro E-mini Nasdaq-100',
    ticker: 'MNQ',
    pointValue: 2, // $2 per point
    commissionPerContract: 1.5, // $1.50 roundtrip
    minTick: 0.25,
    accentColor: '#06B6D4', // Cyan
  },
};

export function calculateContractResult(
  instrument: InstrumentConfig,
  slAmount: number,
  slPoints: number
): ContractResult {
  if (slAmount <= 0 || slPoints <= 0 || isNaN(slAmount) || isNaN(slPoints)) {
    return {
      instrument: instrument.type,
      name: instrument.name,
      ticker: instrument.ticker,
      pointValue: instrument.pointValue,
      commissionPerContract: instrument.commissionPerContract,
      rawContracts: 0,
      flooredContracts: 0,
      totalCommission: 0,
      totalRisk: 0,
      isViable: false,
      isRecommended: false,
      riskEfficiency: 0,
    };
  }

  // Formula: Contracts = SL Amount / ($/point * SL points)
  const dollarRiskPerContract = instrument.pointValue * slPoints;
  const rawContracts = slAmount / dollarRiskPerContract;

  // Always floor to whole number for futures contracts
  const flooredContracts = Math.floor(rawContracts);

  // Expected roundtrip commission = Contracts * commissionPerContract
  const totalCommission = flooredContracts * instrument.commissionPerContract;

  // Actual dollar risk = Contracts * PointValue * SL Points
  const totalRisk = flooredContracts * dollarRiskPerContract;

  const isViable = flooredContracts >= 1;
  const riskEfficiency = slAmount > 0 ? (totalRisk / slAmount) * 100 : 0;

  return {
    instrument: instrument.type,
    name: instrument.name,
    ticker: instrument.ticker,
    pointValue: instrument.pointValue,
    commissionPerContract: instrument.commissionPerContract,
    rawContracts,
    flooredContracts,
    totalCommission,
    totalRisk,
    isViable,
    isRecommended: false,
    riskEfficiency,
  };
}

export function calculateAll(slAmount: number, slPoints: number): CalculationSummary {
  const nqResult = calculateContractResult(INSTRUMENTS.NQ, slAmount, slPoints);
  const mnqResult = calculateContractResult(INSTRUMENTS.MNQ, slAmount, slPoints);

  const ratio = slAmount > 0 ? slAmount / 20 : 0;
  const isRatioGreaterThanPoints = slPoints > 0 && ratio > slPoints;

  // Handwritten note rule:
  // "If SL Amount / 20 > SL points -> take NQ else take MNQ"
  let recommended: 'NQ' | 'MNQ' | null = null;
  if (nqResult.isViable && isRatioGreaterThanPoints) {
    recommended = 'NQ';
    nqResult.isRecommended = true;
  } else if (mnqResult.isViable) {
    recommended = 'MNQ';
    mnqResult.isRecommended = true;
  }

  return {
    slAmount,
    slPoints,
    nq: nqResult,
    mnq: mnqResult,
    recommendedInstrument: recommended,
    ruleEvaluation: {
      ratio,
      isRatioGreaterThanPoints,
    },
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(val: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(val);
}
