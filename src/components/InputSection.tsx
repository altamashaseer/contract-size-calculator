import React from 'react';
import { DollarSign, Target, X, Plus, Minus, BookmarkCheck } from 'lucide-react';

interface InputSectionProps {
  slAmountStr: string;
  setSlAmountStr: (val: string) => void;
  slPointsStr: string;
  setSlPointsStr: (val: string) => void;
}

const AMOUNT_PRESETS = [50, 100, 150, 200, 250, 500, 1000];
const POINTS_PRESETS = [5, 10, 15, 20, 25, 30];
const POINTS_TICKS = [0, 5, 10, 15, 20, 25, 30];

export const InputSection: React.FC<InputSectionProps> = ({
  slAmountStr,
  setSlAmountStr,
  slPointsStr,
  setSlPointsStr,
}) => {
  const currentPoints = parseFloat(slPointsStr) || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setSlAmountStr(val);
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setSlPointsStr(val);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSlPointsStr(isNaN(val) ? '' : val.toString());
  };

  const adjustPoints = (delta: number) => {
    const updated = Math.max(0, parseFloat((currentPoints + delta).toFixed(2)));
    setSlPointsStr(updated > 0 ? updated.toString() : '');
  };

  // Slider value clamped between 0 and 30 (0 to 30 ensures linear percentage alignment with ticks)
  const sliderValue = Math.min(30, Math.max(0, currentPoints));

  return (
    <div className="input-section">
      {/* SL Amount Card (Compact) */}
      <div className="input-card compact-card">
        <div className="input-header">
          <label htmlFor="sl-amount-input" className="input-label">
            <DollarSign size={14} className="label-icon text-emerald" />
            <span>Stop Loss Amount ($)</span>
          </label>
          <span className="saved-badge" title="Saved in browser local storage">
            <BookmarkCheck size={11} /> Saved
          </span>
        </div>

        <div className="input-wrapper input-wrapper-compact">
          <span className="input-adornment">$</span>
          <input
            id="sl-amount-input"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            placeholder="e.g. 200"
            value={slAmountStr}
            onChange={handleAmountChange}
            className="numeric-input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {slAmountStr && (
            <button
              type="button"
              className="input-clear-btn"
              onClick={() => setSlAmountStr('')}
              aria-label="Clear SL Amount"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick Amount Chips */}
        <div className="preset-chips">
          {AMOUNT_PRESETS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`chip ${slAmountStr === amt.toString() ? 'chip-active' : ''}`}
              onClick={() => setSlAmountStr(amt.toString())}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>

      {/* SL Points Card (With Input + Quick Slider + Steppers) */}
      <div className="input-card">
        <div className="input-header">
          <label htmlFor="sl-points-input" className="input-label">
            <Target size={14} className="label-icon text-cyan" />
            <span>Stop Loss Points</span>
          </label>
        </div>

        <div className="input-wrapper">
          <span className="input-adornment pts-adornment">PTS</span>
          <input
            id="sl-points-input"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            placeholder="e.g. 15.2"
            value={slPointsStr}
            onChange={handlePointsChange}
            className="numeric-input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <div className="stepper-controls">
            <button
              type="button"
              className="step-btn"
              onClick={() => adjustPoints(-1)}
              aria-label="Decrease 1 point"
              title="Minus 1 point"
            >
              <Minus size={13} />
            </button>
            <button
              type="button"
              className="step-btn"
              onClick={() => adjustPoints(1)}
              aria-label="Increase 1 point"
              title="Add 1 point"
            >
              <Plus size={13} />
            </button>
          </div>

          {slPointsStr && (
            <button
              type="button"
              className="input-clear-btn"
              onClick={() => setSlPointsStr('')}
              aria-label="Clear SL Points"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick Points Slider for Fast Selection (0-30 pts, exact tick alignment) */}
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={sliderValue}
            onChange={handleSliderChange}
            className="range-slider"
            aria-label="Quick adjust Stop Loss Points (up to 30 pts)"
          />
          <div className="slider-ticks-track">
            {POINTS_TICKS.map((tick) => {
              const p = tick / 30;
              // Compensate for 20px slider thumb width so ticks align with the exact center of the thumb
              return (
                <span
                  key={tick}
                  className={`tick-label ${Math.abs(currentPoints - tick) < 0.25 ? 'tick-active' : ''}`}
                  style={{
                    left: `calc(${p * 100}% + ${(0.5 - p) * 20}px)`,
                  }}
                  onClick={() => setSlPointsStr(tick.toString())}
                >
                  {tick}
                </span>
              );
            })}
          </div>
        </div>

        {/* Quick Points Chips */}
        <div className="preset-chips">
          {POINTS_PRESETS.map((pts) => (
            <button
              key={pts}
              type="button"
              className={`chip ${slPointsStr === pts.toString() ? 'chip-active' : ''}`}
              onClick={() => setSlPointsStr(pts.toString())}
            >
              {pts} pts
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
