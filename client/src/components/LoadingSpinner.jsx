/**
 * LoadingSpinner.jsx — Animated processing indicator
 */

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 fade-in">
      {/* Spinner rings */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 animate-ping [animation-delay:0.2s]" />
        <div
          className="spinner absolute inset-4"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-white mb-1">Evaluating Application</h3>
      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
        Running credit decision engine…
      </p>

      {/* Step indicators */}
      <div className="flex gap-2 mt-6">
        {['Validating', 'Scoring', 'Deciding'].map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#818cf8',
              animation: `fadeIn 0.4s ease ${i * 0.2}s both`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
