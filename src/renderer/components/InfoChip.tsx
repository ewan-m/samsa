import "./InfoChip.scss";
import { FunctionComponent } from "react";
import { LoadingPulse } from "./LoadingPulse";
import { FetchStatus } from "renderer/types/FetchStatus";

export const InfoChip: FunctionComponent<{
  label: string;
  value: string | number | undefined;
  status: FetchStatus;
}> = ({ label, value, status }) => {
  return (
    <p className="infoChip">
      <strong className="infoChip__value">
        {status === "fetched" && value}
        {status === "fetching" && <LoadingPulse inverted={true} />}
        {status === "errored" && "!"}
      </strong>
      {label}
    </p>
  );
};
