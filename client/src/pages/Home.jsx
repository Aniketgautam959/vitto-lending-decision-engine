/**
 * Home.jsx — Main application page
 *
 * Manages the three UI states:
 *  1. "form"    — Loan input form
 *  2. "loading" — Decision processing animation
 *  3. "result"  — Credit decision result
 */

import { useState } from 'react';
import LoanForm from '../components/LoanForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultCard from '../components/ResultCard';
import { submitLoanApplication } from '../services/api';

// ─── Simulated minimum display duration for loading (better UX) ────────────────
const MIN_LOADING_MS = 1800;

export default function Home() {
  const [uiState, setUiState] = useState('form'); // 'form' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);

  // ── Handle form submission ──────────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    setServerErrors([]);
    setUiState('loading');

    const startTime = Date.now();

    try {
      const data = await submitLoanApplication(formData);

      // Ensure loading shows for at least MIN_LOADING_MS for UX effect
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_LOADING_MS - elapsed);

      await new Promise((r) => setTimeout(r, delay));

      setResult(data.result);
      setUiState('result');
    } catch (err) {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_LOADING_MS - elapsed);
      await new Promise((r) => setTimeout(r, delay));

      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setServerErrors([err.response.data.message]);
      } else {
        setServerErrors(['Unable to connect to server. Please try again.']);
      }
      setUiState('form');
    }
  };

  // ── Reset to form ───────────────────────────────────────────────────────────
  const handleReset = () => {
    setResult(null);
    setServerErrors([]);
    setUiState('form');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* ── Decorative background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
            >
              🏦
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">Vitto</span>
              <span className="font-light text-sm ml-1.5" style={{ color: 'var(--color-muted)' }}>Lending</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#34d399',
              }}
            >
              ● MSME Credit Platform
            </span>
          </div>
        </header>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <main className="flex-1 flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-2xl">
            {/* ── Hero section ─────────────────────────────────────────────── */}
            {uiState === 'form' && (
              <div className="text-center mb-10 fade-in">
                <div
                  className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full mb-5"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#818cf8',
                  }}
                >
                  ⚡ AI-Powered Credit Decisioning
                </div>
                <h1 className="text-4xl font-bold mb-3 leading-tight">
                  Apply for an <span className="gradient-text">MSME Loan</span>
                </h1>
                <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--color-muted)' }}>
                  Get an instant credit decision powered by our intelligent risk engine.
                  Fill in your details below to receive a real-time assessment.
                </p>
              </div>
            )}

            {uiState === 'result' && (
              <div className="text-center mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                  Your <span className="gradient-text">Credit Decision</span>
                </h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                  Based on your application data and our decision engine analysis
                </p>
              </div>
            )}

            {/* ── Card ─────────────────────────────────────────────────────── */}
            <div className="glass p-7 shadow-2xl">
              {/* Server-side error messages */}
              {serverErrors.length > 0 && uiState === 'form' && (
                <div
                  className="mb-6 p-4 rounded-lg text-sm fade-in"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#fca5a5',
                  }}
                  role="alert"
                >
                  <p className="font-semibold mb-2">⚠ Please fix the following issues:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {serverErrors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}

              {uiState === 'form' && (
                <LoanForm onSubmit={handleSubmit} isLoading={false} />
              )}

              {uiState === 'loading' && <LoadingSpinner />}

              {uiState === 'result' && result && (
                <ResultCard result={result} onReset={handleReset} />
              )}
            </div>

            {/* ── Trust badges ─────────────────────────────────────────────── */}
            {uiState === 'form' && (
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap fade-in">
                {[
                  { icon: '🔒', text: '256-bit Encrypted' },
                  { icon: '⚡', text: 'Instant Decision' },
                  { icon: '📜', text: 'RBI Compliant' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="text-center py-5 text-xs" style={{ color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)' }}>
          © {new Date().getFullYear()} Vitto Lending · Built for MSME Credit Access ·{' '}
          <span style={{ color: '#6366f1' }}>Decision Engine v1.0</span>
        </footer>
      </div>
    </div>
  );
}
