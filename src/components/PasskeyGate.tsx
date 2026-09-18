import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

interface PasskeyGateProps {
  onUnlock: () => void;
}

const CORRECT_PASSKEY = 'aseer';

export const PasskeyGate: React.FC<PasskeyGateProps> = ({ onUnlock }) => {
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setError(true);
      setErrorMessage('Please enter the passkey');
      return;
    }

    if (passkey.trim().toLowerCase() === CORRECT_PASSKEY) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setErrorMessage('Incorrect passkey. Access denied.');
    }
  };

  return (
    <div className="passkey-overlay">
      <div className="passkey-card">
        <div className="passkey-icon-wrapper">
          <div className="passkey-glow"></div>
          <div className="passkey-badge">
            <Lock size={28} className="text-emerald" />
          </div>
        </div>

        <div className="passkey-header">
          <h2 className="passkey-title">Authorized Access Only</h2>
          <p className="passkey-subtitle">
            Enter your trader passkey to unlock the Position Sizer terminal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="passkey-form">
          <div className={`passkey-input-wrapper ${error ? 'passkey-input-error' : ''}`}>
            <KeyRound size={17} className="passkey-adornment" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter passkey..."
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                if (error) setError(false);
              }}
              className="passkey-input"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              type="button"
              className="passkey-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="passkey-error-msg">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button type="submit" className="passkey-submit-btn">
            <span>Unlock Terminal</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="passkey-footer">
          <ShieldCheck size={13} className="text-emerald shrink-0" />
          <span>Device authorized permanently upon entering correct key.</span>
        </div>
      </div>
    </div>
  );
};
