// @jxui/react v3.0.0 — JXStepper (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Check } from 'lucide-react';

export interface JXStepItem {
  id: string;
  label: string;
  description?: string;
  optional?: boolean;
}

export interface JXStepperProps {
  steps?: JXStepItem[];
  activeStep?: number;
  defaultActiveStep?: number;
  onStepChange?: (stepIndex: number) => void;
  nonLinear?: boolean;
  className?: string;
}

const DEFAULT_STEPS: JXStepItem[] = [
  { id: 'schema', label: 'Schema', description: 'Define database blueprint and indices' },
  { id: 'tokens', label: 'Tokens', description: 'Configure semantic CSS design tokens' },
  { id: 'deploy', label: 'Deploy', description: 'Publish edge bundle to global CDN' },
];

export const JXStepper: React.FC<JXStepperProps> = ({
  steps = DEFAULT_STEPS,
  activeStep: controlledStep,
  defaultActiveStep = 1,
  onStepChange,
  nonLinear = true,
  className = '',
}) => {
  const [internalStep, setInternalStep] = useState(defaultActiveStep);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  const setStep = (idx: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    if (controlledStep === undefined) setInternalStep(clamped);
    onStepChange?.(clamped);
  };

  const activeStepObj = steps[currentStep] || steps[0];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                disabled={!nonLinear && i > currentStep}
                onClick={() => setStep(i)}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex items-center gap-2 text-left cursor-pointer group disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={`text-xs font-semibold transition-colors ${
                    isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-emerald-500 transition-all duration-300 ${
                      i < currentStep ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {activeStepObj?.description && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span>
            <strong className="font-semibold text-slate-800 dark:text-slate-100">
              Step {currentStep + 1}:
            </strong>{' '}
            {activeStepObj.description}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => setStep(currentStep - 1)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
        >
          Previous Step
        </button>
        <button
          type="button"
          disabled={currentStep === steps.length - 1}
          onClick={() => setStep(currentStep + 1)}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40 cursor-pointer"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
