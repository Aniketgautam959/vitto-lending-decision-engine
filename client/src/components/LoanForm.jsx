import { useState } from 'react';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const INITIAL_FORM = {
  name: '',
  pan: '',
  monthlyRevenue: '',
  loanAmount: '',
  tenure: ''
};

export default function LoanForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.pan.trim() || !PAN_REGEX.test(form.pan.trim().toUpperCase())) newErrors.pan = 'Valid PAN is required.';
    if (!form.monthlyRevenue || isNaN(form.monthlyRevenue) || Number(form.monthlyRevenue) <= 0) newErrors.monthlyRevenue = 'Valid positive revenue required.';
    if (!form.loanAmount || isNaN(form.loanAmount) || Number(form.loanAmount) <= 0) newErrors.loanAmount = 'Valid loan amount required.';
    if (!form.tenure || isNaN(form.tenure) || Number(form.tenure) <= 0) newErrors.tenure = 'Valid positive tenure required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      pan: form.pan.trim().toUpperCase(),
      monthlyRevenue: parseFloat(form.monthlyRevenue),
      loanAmount: parseFloat(form.loanAmount),
      tenure: parseInt(form.tenure, 10)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input id="name" value={form.name} onChange={handleChange} className="form-input" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">PAN</label>
        <input id="pan" value={form.pan} onChange={handleChange} className="form-input" maxLength={10} />
        {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monthly Revenue (₹)</label>
        <input id="monthlyRevenue" type="number" value={form.monthlyRevenue} onChange={handleChange} className="form-input" />
        {errors.monthlyRevenue && <p className="text-red-500 text-xs mt-1">{errors.monthlyRevenue}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Loan Amount (₹)</label>
        <input id="loanAmount" type="number" value={form.loanAmount} onChange={handleChange} className="form-input" />
        {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tenure (months)</label>
        <input id="tenure" type="number" value={form.tenure} onChange={handleChange} className="form-input" />
        {errors.tenure && <p className="text-red-500 text-xs mt-1">{errors.tenure}</p>}
      </div>
      <button type="submit" disabled={isLoading} className="btn-primary mt-4">
        {isLoading ? 'Processing...' : 'Submit Application'}
      </button>
    </form>
  );
}
