import "./Stepper.scss";
import type { FunctionComponent } from "react";

export const Stepper: FunctionComponent<{
  totalSteps: number;
  currentStep: number;
  stepName?: string;
  stepBack?: () => void;
}> = ({ totalSteps, currentStep, stepName, stepBack }) => {
  const percentage = (100 * (currentStep + 1)) / totalSteps;
  return (
    <div className="stepperContainer">
      <div className="stepper">
        <div
          style={{ width: `${percentage.toFixed(2)}%` }}
          className="stepper__completed"
        >
          <p className="stepper__completed__p">{stepName ?? currentStep + 1}</p>
        </div>
      </div>
      {currentStep > 0 && stepBack && (
        <button className="stepperBack" onClick={stepBack}>
          back
        </button>
      )}
    </div>
  );
};
