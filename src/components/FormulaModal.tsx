import React from 'react';
import { X, BookOpen, CheckCircle, Info } from 'lucide-react';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <BookOpen size={20} className="text-emerald" />
            <h2 className="modal-title">Calculation & Logic Guide</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <section className="guide-section">
            <h3 className="section-heading">1. Core Formulas</h3>
            <div className="formula-callout">
              <p><strong>SL Points × $/Point × Contracts = Expected SL Risk</strong></p>
              <p className="mt-2 text-muted">Rearranging for contracts:</p>
              <p className="highlight-math font-mono">
                Contracts = SL Amount ÷ ($/Point × SL Points)
              </p>
            </div>
          </section>

          <section className="guide-section">
            <h3 className="section-heading">2. Instrument Specifications</h3>
            <div className="specs-table-container">
              <table className="specs-table">
                <thead>
                  <tr>
                    <th>Contract</th>
                    <th>Point Value</th>
                    <th>RT Commission</th>
                    <th>Quick Divider</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>NQ</strong> (E-mini)</td>
                    <td>$20.00 / pt</td>
                    <td>$5.00 / con</td>
                    <td>SL ÷ 20</td>
                  </tr>
                  <tr>
                    <td><strong>MNQ</strong> (Micro)</td>
                    <td>$2.00 / pt</td>
                    <td>$1.50 / con</td>
                    <td>SL ÷ 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="guide-section">
            <h3 className="section-heading">3. Whole Number Floor Rule</h3>
            <div className="info-box">
              <CheckCircle size={18} className="text-emerald shrink-0" />
              <div>
                <strong>Whole Contracts Only:</strong>
                <p className="text-sm mt-1">
                  In futures trading, you cannot trade fractional contracts (e.g. 6.4, 6.7, or 6.9).
                  Our calculator always rounds <em>down</em> (floors) to the nearest integer (e.g. 6.9 → <strong>6</strong>) so you never exceed your maximum intended stop loss risk.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h3 className="section-heading">4. Under 1 Contract Red Alert</h3>
            <div className="alert-box-static">
              <Info size={18} className="text-crimson shrink-0" />
              <div>
                <strong>Contract &lt; 1 Warning:</strong>
                <p className="text-sm mt-1">
                  If the calculated contract size comes out to 0.x (under 1), the card highlights with a red glowing boundary. This warns that either your dollar risk is too small or your stop loss in points is too wide for that contract.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h3 className="section-heading">5. Selection Rule from Notes</h3>
            <div className="formula-callout rule-callout">
              <p><strong>Rule:</strong> If (SL Amount ÷ 20) &gt; SL Points, choose <strong>NQ</strong>; otherwise choose <strong>MNQ</strong>.</p>
              <p className="text-sm mt-1 text-muted">
                Tip: Divide your SL amount by 20 first. If that number exceeds your SL points, you have room for at least 1 full NQ contract!
              </p>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Got it, Back to Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
