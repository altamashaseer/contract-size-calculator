import React, { useState, useRef, useEffect } from 'react';
import { Calculator, HelpCircle, RotateCcw, Sun, Moon, Lock, Settings, Columns2 } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenInfo: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLock?: () => void;
  strictSideBySide: boolean;
  onToggleStrictSideBySide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenInfo,
  theme,
  onToggleTheme,
  onLock,
  strictSideBySide,
  onToggleStrictSideBySide,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
        <div className="settings-anchor" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`icon-btn settings-btn ${isOpen ? 'active' : ''}`}
            title="Settings & Layout"
            aria-label="Settings and layout menu"
            aria-expanded={isOpen}
          >
            <Settings size={18} />
          </button>

          {isOpen && (
            <div className="settings-popup" role="menu" aria-label="Settings menu">
              {/* Strict Side-by-Side Toggle */}
              <div
                className="popup-item popup-item-switch"
                onClick={onToggleStrictSideBySide}
                role="menuitemcheckbox"
                aria-checked={strictSideBySide}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleStrictSideBySide();
                  }
                }}
              >
                <div className="popup-item-left">
                  <Columns2 size={16} className="popup-icon" />
                  <div className="popup-item-text">
                    <span className="popup-label">Strict Side-by-Side</span>
                    <span className="popup-desc">
                      {strictSideBySide ? '2-column view (forced)' : 'Stacked vertically'}
                    </span>
                  </div>
                </div>
                <div className={`switch-toggle ${strictSideBySide ? 'checked' : ''}`}>
                  <div className="switch-thumb" />
                </div>
              </div>

              <div className="popup-divider" />

              {/* Theme Toggle */}
              <button
                type="button"
                className="popup-item"
                role="menuitem"
                onClick={onToggleTheme}
              >
                <div className="popup-item-left">
                  {theme === 'light' ? (
                    <Moon size={16} className="popup-icon text-cyan" />
                  ) : (
                    <Sun size={16} className="popup-icon text-amber" />
                  )}
                  <div className="popup-item-text">
                    <span className="popup-label">Theme</span>
                    <span className="popup-desc">
                      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                    </span>
                  </div>
                </div>
                <span className="popup-badge">{theme === 'light' ? 'Light' : 'Dark'}</span>
              </button>

              {/* Reset SL Points */}
              <button
                type="button"
                className="popup-item"
                role="menuitem"
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
              >
                <div className="popup-item-left">
                  <RotateCcw size={16} className="popup-icon" />
                  <div className="popup-item-text">
                    <span className="popup-label">Reset Points</span>
                    <span className="popup-desc">Clear SL points field</span>
                  </div>
                </div>
              </button>

              {/* Rules & Formula info */}
              <button
                type="button"
                className="popup-item"
                role="menuitem"
                onClick={() => {
                  onOpenInfo();
                  setIsOpen(false);
                }}
              >
                <div className="popup-item-left">
                  <HelpCircle size={16} className="popup-icon" />
                  <div className="popup-item-text">
                    <span className="popup-label">Rules & Formulas</span>
                    <span className="popup-desc">Math & sizing logic</span>
                  </div>
                </div>
              </button>

              {/* Lock Terminal */}
              {onLock && (
                <>
                  <div className="popup-divider" />
                  <button
                    type="button"
                    className="popup-item popup-item-danger"
                    role="menuitem"
                    onClick={() => {
                      setIsOpen(false);
                      onLock();
                    }}
                  >
                    <div className="popup-item-left">
                      <Lock size={16} className="popup-icon text-crimson" />
                      <div className="popup-item-text">
                        <span className="popup-label text-crimson">Lock Terminal</span>
                        <span className="popup-desc">Require passkey</span>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
