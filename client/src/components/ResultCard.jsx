/**
 * ResultCard.jsx — Displays the credit decision returned by the backend
 *
 * Props:
 *  - result: { decision, creditScore, reasonCodes, emi }
 *  - onReset: () => void
 */

import { useEffect, useState } from 'react';

// ─── Helper: score color ───────────────────────────────────────────────────────
function getScoreColor(score) {
  if (score >= 80) return '#10b981';       // green
  if (score >= 60) return '#f59e0b';       // amber
  return '#ef4444';                         // red
}

// ─── Helper: format currency ───────────────────────────────────────────────────
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResultCard({ result, onReset }) {
  const { decision, creditScore, reasons, emi } = result;
  const isApproved = decision === 'Approved';
  const scoreColor = getScoreColor(creditScore);

  // Animate score bar width after mount
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(creditScore), 100);
    return () => clearTimeout(t);
  }, [creditScore]);

  return (
    <div className="fade-in space-y-6">
      {/* ── Decision Banner ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: isApproved
            ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(251,113,133,0.08))',
          border: `1px solid ${isApproved ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl"
          style={{
            background: isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          }}
        >
          {isApproved ? '✅' : '❌'}
        </div>

        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-muted)' }}>
          Credit Decision
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: isApproved ? '#10b981' : '#ef4444' }}
        >
          {decision}
        </h2>
        {emi && (
          <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
            Estimated Monthly EMI:{' '}
            <span className="font-semibold text-white">{formatINR(emi)}</span>
          </p>
        )}
      </div>

      {/* ── Credit Score ─────────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-muted)' }}>
              Credit Score
            </p>
            <p className="text-4xl font-bold" style={{ color: scoreColor }}>
              {creditScore}
              <span className="text-lg font-normal ml-1" style={{ color: 'var(--color-muted)' }}>/ 100</span>
            </p>
          </div>

          {/* Score label */}
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: `${scoreColor}18`,
              border: `1px solid ${scoreColor}40`,
              color: scoreColor,
            }}
          >
            {creditScore >= 80 ? 'Excellent' : creditScore >= 60 ? 'Fair' : 'Poor'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="score-bar-track">
          <div
            className="score-bar-fill"
            style={{
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
            }}
          />
        </div>

        {/* Scale */}
        <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
          <span>0</span>
          <span>Approval threshold: 60</span>
          <span>100</span>
        </div>
      </div>

      {/* ── Reason Codes ─────────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted)' }}>
          Analysis &amp; Reason Codes
        </p>
        <div className="space-y-2">
          {reasons && reasons.map((reason, i) => (
            <div
              key={i}
              className={isApproved && reasons.length === 1 ? 'badge-success' : 'badge-warning'}
            >
              <span className="mt-0.5">
                {isApproved && reasons.length === 1 ? '✓' : '⚠'}
              </span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Apply Again Button ───────────────────────────────────────────── */}
      <button
        onClick={onReset}
        className="btn-primary"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
        id="apply-again-btn"
      >
        ← Apply for Another Loan
      </button>
    </div>
  );
}
