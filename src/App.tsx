import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateAll, formatNumber } from './utils/calculator';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ContractCard } from './components/ContractCard';
import { FormulaModal } from './components/FormulaModal';
import { PasskeyGate } from './components/PasskeyGate';
import { Sparkles, ShieldCheck } from 'lucide-react';
import './App.css';

export function App() {
  // Theme state: default to 'light'
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('futures_calc_theme', 'light');

  // Passkey authorization: required on first visit, saved in localStorage
  const [isAuthorized, setIsAuthorized] = useLocalStorage<boolean>('futures_calc_authorized', false);

  // Stored in localStorage so user doesn't have to fill it each time they open the app
  const [slAmountStr, setSlAmountStr] = useLocalStorage<string>('futures_sl_amount_usd', '200');
  // Dynamic trade-by-trade SL points
  const [slPointsStr, setSlPointsStr] = useState<string>('15.2');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Strict side-by-side preference (default: true)
  const [strictSideBySide, setStrictSideBySide] = useLocalStorage<boolean>(
    'futures_calc_strict_side_by_side',
    true
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const slAmount = useMemo(() => {
    const parsed = parseFloat(slAmountStr);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [slAmountStr]);

  const slPoints = useMemo(() => {
    const parsed = parseFloat(slPointsStr);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [slPointsStr]);

  const results = useMemo(() => {
    return calculateAll(slAmount, slPoints);
  }, [slAmount, slPoints]);

  const handleReset = () => {
    setSlPointsStr('');
  };

  if (!isAuthorized) {
    return <PasskeyGate onUnlock={() => setIsAuthorized(true)} />;
  }

  return (
    <div className="app-container">
      <div className="mobile-shell">
        <Header
          onReset={handleReset}
          onOpenInfo={() => setIsModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLock={() => setIsAuthorized(false)}
          strictSideBySide={strictSideBySide}
          onToggleStrictSideBySide={() => setStrictSideBySide((prev) => !prev)}
        />

        <main className="main-content">
          {/* User Inputs: SL Amount ($) & SL Points (with Slider & Stepper) */}
          <InputSection
            slAmountStr={slAmountStr}
            setSlAmountStr={setSlAmountStr}
            slPointsStr={slPointsStr}
            setSlPointsStr={setSlPointsStr}
          />

          {/* Sleek Compact Recommendation Strip */}
          {slAmount > 0 && slPoints > 0 && results.recommendedInstrument && (
            <div className="compact-recommend-strip">
              <div className="strip-left">
                <Sparkles size={14} className="strip-sparkle" />
                <span className="strip-text">
                  Take <strong>{results.recommendedInstrument}</strong>
                </span>
              </div>
              <div className="strip-logic">
                <span>
                  SL÷20 ({formatNumber(results.ruleEvaluation.ratio, 1)}){' '}
                  {results.ruleEvaluation.isRatioGreaterThanPoints ? '>' : '≤'} {slPoints} pts
                </span>
              </div>
            </div>
          )}

          {/* Position Sizing Cards (Side-by-Side on Mobile, or Stacked when Strict Side-by-Side is toggled off) */}
          <section className="results-section">
            <div className={`cards-grid ${strictSideBySide ? '' : 'cards-grid-stacked'}`}>
              {/* NQ Card */}
              <ContractCard result={results.nq} targetSL={slAmount} />

              {/* MNQ Card */}
              <ContractCard result={results.mnq} targetSL={slAmount} />
            </div>
          </section>

          {/* Minimal Footer */}
          <footer className="app-footer">
            <div className="footer-notice">
              <ShieldCheck size={13} className="text-emerald shrink-0" />
              <span>Double check sizing before executing on broker.</span>
            </div>
          </footer>
        </main>

        {/* Informational Modal */}
        <FormulaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}

export default App;
