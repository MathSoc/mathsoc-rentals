import "./stepper.scss";

export function Stepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="stepper" aria-label="Progress">
      {steps.map((label, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="stepper-item-group">
            <div
              className={`stepper-item ${isCompleted ? "completed" : isActive ? "active" : "pending"}`}
            >
              <div className="stepper-circle">
                {isCompleted ? (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span className="stepper-label">{label}</span>
            </div>
            {i < steps.length - 1 ? (
              <div className={`stepper-connector ${isCompleted ? "completed" : ""}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
