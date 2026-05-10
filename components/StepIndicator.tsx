'use client'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS = ['Select Product', 'Verify Order', 'Your Feedback']

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Desktop: labels + connector */}
      <div className="hidden sm:flex items-start">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-300
                  ${
                    step < currentStep
                      ? 'bg-gold text-dark'
                      : step === currentStep
                      ? 'bg-dark text-white shadow-md'
                      : 'bg-border text-muted'
                  }
                `}
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {step < currentStep ? '✓' : step}
              </div>
              <span
                className={`mt-2 text-xs whitespace-nowrap transition-colors duration-300 ${
                  step === currentStep
                    ? 'text-dark font-medium'
                    : step < currentStep
                    ? 'text-gold'
                    : 'text-muted'
                }`}
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {STEP_LABELS[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-px mt-4 mx-3 transition-all duration-500 ${
                  step < currentStep ? 'bg-gold' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: simple text */}
      <div className="sm:hidden flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`h-1 rounded-full transition-all duration-300 ${
                step <= currentStep ? 'w-6 bg-gold' : 'w-3 bg-border'
              }`}
            />
          ))}
        </div>
        <span
          className="text-xs text-muted"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          Step {currentStep} of {totalSteps} — {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
    </div>
  )
}
