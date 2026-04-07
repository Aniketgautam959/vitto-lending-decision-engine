import { useEffect, useState } from 'react';
function getColor(score) {
  if (score >= 80) return '#10b981';       // green
  if (score >= 60) return '#f59e0b';       // amber
  return '#ef4444';                         // red
}
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
  const clr = getColor(creditScore);
  // Animate score bar width after mount
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(creditScore), 100);
    return () => clearTimeout(t);
  }, [creditScore]);
  return (
    <div className="fade-in space-y-6">

      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: isApproved ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${isApproved ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold"
          style={{
            background: isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: isApproved ? '#10b981' : '#ef4444',
          }}
        >
          {isApproved ? 'A' : 'R'}
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
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formatINR(emi)}</span>
          </p>
        )}
      </div>

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
            <p className="text-4xl font-bold" style={{ color: clr }}>
              {creditScore}
              <span className="text-lg font-normal ml-1" style={{ color: 'var(--color-muted)' }}>/ 100</span>
            </p>
          </div>
          {/* Score label */}
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: `${clr}18`,
              border: `1px solid ${clr}40`,
              color: clr,
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
              width: `${progress}%`,
              background: clr,
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
              <span className="mt-0.5 font-bold">
                {isApproved && reasons.length === 1 ? '+' : '-'}
              </span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

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
