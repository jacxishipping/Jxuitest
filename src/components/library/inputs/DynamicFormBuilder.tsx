// @jxui/react v3.0.0 — DynamicFormBuilder (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, Check, Send } from 'lucide-react';

interface SchemaField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'checkbox';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const DEFAULT_SCHEMA: SchemaField[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', required: true },
  { id: 'workEmail', label: 'Work Email', type: 'email', placeholder: 'jane@company.com', required: true },
  { id: 'tier', label: 'Role Tier', type: 'select', options: ['Engineering', 'Design', 'Product', 'Executive'] },
  { id: 'agreed', label: 'Opt in to design system releases', type: 'checkbox' },
];

export const DynamicFormBuilder: React.FC = () => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: '',
    workEmail: '',
    tier: 'Engineering',
    agreed: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    pushToast({
      title: 'Schema Form Validated',
      description: `Payload: ${JSON.stringify(formData)}`,
      variant: 'success',
    });
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5 text-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-1">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Dynamic Schema Engine</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">4 fields</span>
      </div>

      {DEFAULT_SCHEMA.map((field) => {
        if (field.type === 'checkbox') {
          return (
            <label key={field.id} className="flex items-center gap-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={Boolean(formData[field.id])}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
                className="w-3.5 h-3.5 accent-indigo-600 rounded"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400">{field.label}</span>
            </label>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.id} className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{field.label}</label>
              <select
                value={formData[field.id]}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                className={`px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white ${getRadiusClass('control')} text-xs focus:outline-none focus:border-indigo-500`}
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={field.id} className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{field.label}</label>
            <input
              type={field.type}
              value={formData[field.id]}
              placeholder={field.placeholder}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              className={`px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white ${getRadiusClass('control')} text-xs focus:outline-none focus:border-indigo-500`}
            />
          </div>
        );
      })}

      <button
        type="submit"
        className={`mt-1 py-1.5 px-3 rounded-lg text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
          submitted ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {submitted ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
        <span>{submitted ? 'Validated' : 'Submit Schema'}</span>
      </button>
    </form>
  );
};
