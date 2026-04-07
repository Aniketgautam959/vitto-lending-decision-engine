import { useState } from 'react';
import LoanForm from '../components/LoanForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultCard from '../components/ResultCard';
import { submitLoanApplication } from '../services/api';
const waitMs = 1800;
export default function Home() {
  const [view, setView] = useState('form'); // 'form' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [errs, setErrs] = useState([]);
  const handleSubmit = async (formData) => {
    setErrs([]);
    setView('loading');
    const startTime = Date.now();
    try {
      const data = await submitLoanApplication(formData);
      // Ensure loading shows for at least waitMs for UX effect
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, waitMs - elapsed);
      await new Promise((r) => setTimeout(r, delay));
      setResult(data.result);
      setView('result');
    } catch (err) {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, waitMs - elapsed);
      await new Promise((r) => setTimeout(r, delay));
      if (err.response?.data?.errors) {
        setErrs(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrs([err.response.data.message]);
      } else {
        setErrs(['Unable to connect to server. Please try again.']);
      }
      setView('form');
    }
  };
  const handleReset = () => {
    setResult(null);
    setErrs([]);
    setView('form');
  };
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="relative z-10 min-h-screen flex flex-col">

        <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            >
              V
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">Vitto</span>
              <span className="font-light text-sm ml-1.5" style={{ color: 'var(--color-muted)' }}>Lending</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#059669',
              }}
            >
              ● MSME Credit Platform
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-2xl">

            {view === 'form' && (
              <div className="text-center mb-10 fade-in">
                <div
                  className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full mb-5"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#4338ca',
                  }}
                >
                  Credit Decision Engine
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
            {view === 'result' && (
              <div className="text-center mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                  Your <span className="gradient-text">Credit Decision</span>
                </h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                  Based on your application data and our decision engine analysis
                </p>
              </div>
            )}

            <div className="glass p-7 shadow-2xl">
              {/* Server-side error messages */}
              {errs.length > 0 && view === 'form' && (
                <div
                  className="mb-6 p-4 rounded-lg text-sm fade-in"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#b91c1c',
                  }}
                  role="alert"
                >
                  <p className="font-semibold mb-2">⚠ Please fix the following issues:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {errs.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}
              {view === 'form' && (
                <LoanForm onSubmit={handleSubmit} isLoading={false} />
              )}
              {view === 'loading' && <LoadingSpinner />}
              {view === 'result' && result && (
                <ResultCard result={result} onReset={handleReset} />
              )}
            </div>

            {view === 'form' && (
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap fade-in">
                {[
                  { icon: '-', text: '256-bit Encrypted' },
                  { icon: '-', text: 'Instant Decision' },
                  { icon: '-', text: 'RBI Compliant' },
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

        <footer className="text-center py-5 text-xs" style={{ color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)' }}>
          © {new Date().getFullYear()} Vitto Lending · Built for MSME Credit Access ·{' '}
          <span style={{ color: '#6366f1' }}>Decision Engine v1.0</span>
        </footer>
      </div>
    </div>
  );
}
