import { FunctionComponent } from "react";
import "./LoadingPulse.scss";

export const LoadingPulse: FunctionComponent<{ inverted?: boolean }> = ({
  inverted = false,
}) => {
  const circleClass = `loadingPulse__circle ${
    inverted ? "loadingPulse__circle--inverted" : ""
  }`;

  return (
    <span className={`loadingPulse`}>
      <span className={circleClass} />
      <span className={`${circleClass} loadingPulse__circle--2`} />
    </span>
  );
};
