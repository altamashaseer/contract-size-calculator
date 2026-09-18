import React from 'react';
import type { ContractResult } from '../types/calculator';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface ContractCardProps {
  result: ContractResult;
  targetSL: number;
}

export const ContractCard: React.FC<ContractCardProps> = ({ result, targetSL }) => {
  const isUnderOne = result.rawContracts > 0 && result.flooredContracts < 1;
  const isZeroInput = targetSL <= 0 || result.rawContracts === 0;

  let cardStatusClass = '';
  if (isUnderOne) {
    cardStatusClass = 'card-warning-boundary';
  } else if (result.isRecommended) {
    cardStatusClass = 'card-recommended';
  }

  // Short names for compact card view
  const shortName = result.instrument === 'NQ' ? 'E-mini' : 'Micro';

  // Commission rate display string ($5 or $1.50)
  const commRateStr =
    result.commissionPerContract % 1 === 0
      ? result.commissionPerContract.toString()
      : result.commissionPerContract.toFixed(2);

  return (
    <div className={`contract-card ${cardStatusClass}`}>
      {/* Compact Header */}
      <div className="card-header">
        <div className="instrument-title-group">
          <div
            className="ticker-badge"
            style={{ borderColor: result.instrument === 'NQ' ? 'var(--color-nq)' : 'var(--color-mnq)' }}
          >
            <span className="ticker-symbol">{result.ticker}</span>
          </div>
          <div className="instrument-meta">
            <div className="instrument-name">{shortName}</div>
            <div className="point-spec">${result.pointValue}/pt</div>
          </div>
        </div>

        {result.isRecommended && (
          <div className="recommend-badge">
            <Sparkles size={10} />
            <span>TAKE</span>
          </div>
        )}

        {isUnderOne && (
          <div className="under-one-badge">
            <AlertTriangle size={10} />
            <span>&lt;1</span>
          </div>
        )}
      </div>

      {/* Main Contract Size — THE BIG NUMBER */}
      <div className="contract-size-block">
        <div className="size-number-wrapper">
          <div className={`size-big-number ${isUnderOne ? 'number-warning' : ''}`}>
            {isZeroInput ? '—' : result.flooredContracts}
          </div>
          <div className="size-units-row">
            <span className="units-text">con</span>
            {!isZeroInput && (
              <span
                className="raw-hint-badge"
                title={`Exact calculated raw contracts: ${formatNumber(result.rawContracts, 2)}`}
              >
                ≈ {formatNumber(result.rawContracts, 1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Warning if Under 1 */}
      {isUnderOne && (
        <div className="under-one-alert-compact">
          ⚠ Too small ({formatNumber(result.rawContracts, 2)})
        </div>
      )}

      {/* Commission (Red with calculation in brackets) */}
      <div className="commission-row">
        <span className="commission-label">Commission</span>
        <div className="commission-val-group">
          <span className="commission-val font-mono">
            {isZeroInput ? '$0.00' : formatCurrency(result.totalCommission)}
          </span>
          <span className="commission-calc font-mono">
            ({result.flooredContracts} × ${commRateStr})
          </span>
        </div>
      </div>

      {/* Risk & Buffer */}
      <div className="risk-row">
        <div className="risk-item">
          <span className="risk-label">Risk</span>
          <span className="risk-val font-mono">
            {isZeroInput ? '$0' : formatCurrency(result.totalRisk)}
          </span>
        </div>
        <div className="risk-item">
          <span className="risk-label">Buffer</span>
          <span className="risk-val font-mono">
            {isZeroInput ? '$0' : formatCurrency(Math.max(0, targetSL - result.totalRisk))}
          </span>
        </div>
      </div>
    </div>
  );
};
