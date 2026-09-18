import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { formatNumber } from '../utils/calculator';

interface RuleCardProps {
  slAmount: number;
  slPoints: number;
  ratio: number;
  isRatioGreaterThanPoints: boolean;
  recommendedInstrument: 'NQ' | 'MNQ' | null;
}

export const RuleCard: React.FC<RuleCardProps> = ({
  slAmount,
  slPoints,
  ratio,
  isRatioGreaterThanPoints,
  recommendedInstrument,
}) => {
  if (slAmount <= 0 || slPoints <= 0) return null;

  return (
    <div className="rule-card">
      <div className="rule-header">
        <div className="rule-icon-pill">
          <Lightbulb size={16} />
          <span>Handwritten Rule Check</span>
        </div>
        <span className="rule-badge">
          Take {recommendedInstrument || 'MNQ'}
        </span>
      </div>

      <div className="rule-formula-box">
        <div className="formula-step">
          <span className="formula-desc">1. Divide SL by 20:</span>
          <span className="formula-math font-mono">
            ${slAmount} ÷ 20 = <strong>{formatNumber(ratio, 2)}</strong>
          </span>
        </div>

        <div className="formula-compare">
          <div className="compare-item">
            <span className="compare-label">SL / 20</span>
            <span className="compare-val font-mono">{formatNumber(ratio, 2)}</span>
          </div>

          <div className="compare-operator">
            {isRatioGreaterThanPoints ? '>' : '≤'}
          </div>

          <div className="compare-item">
            <span className="compare-label">SL Points</span>
            <span className="compare-val font-mono">{slPoints}</span>
          </div>

          <ArrowRight size={16} className="compare-arrow" />

          <div className={`compare-result ${isRatioGreaterThanPoints ? 'result-nq' : 'result-mnq'}`}>
            {isRatioGreaterThanPoints ? 'Take NQ' : 'Take MNQ'}
          </div>
        </div>
      </div>
      
      <p className="rule-note">
        ⭐ <em>Rule from Notes:</em> If SL Amount ÷ 20 &gt; SL points, take <strong>NQ</strong>; otherwise take <strong>MNQ</strong> to avoid undersized risk exposure.
      </p>
    </div>
  );
};
