import React from 'react';
import { Calculator, HelpCircle, RotateCcw, Sun, Moon, Lock } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenInfo: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLock?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenInfo, theme, onToggleTheme, onLock }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <Calculator className="brand-icon" size={20} />
        </div>
        <div>
          <h1 className="brand-title">Position Sizer</h1>
          <p className="brand-subtitle">NQ & MNQ</p>
        </div>
      </div>
      <div className="header-actions">
        {onLock && (
          <button
            type="button"
            onClick={onLock}
            className="icon-btn"
            title="Lock terminal"
            aria-label="Lock terminal"
          >
            <Lock size={17} />
          </button>
        )}
        <button
          type="button"
          onClick={onToggleTheme}
          className="icon-btn theme-toggle-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>
        <button
          type="button"
          onClick={onOpenInfo}
          className="icon-btn"
          title="Trading rules & formula info"
          aria-label="Trading rules and formula information"
        >
          <HelpCircle size={19} />
        </button>
        <button
          type="button"
          onClick={onReset}
          className="icon-btn"
          title="Reset points"
          aria-label="Reset SL points"
        >
          <RotateCcw size={19} />
        </button>
      </div>
    </header>
  );
};
