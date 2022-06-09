import { atomWithStorage } from "jotai/utils";

export const setupModes = {
  Manual: "Specify the parameters manually",
  "AWS SSM": "Pull the parameters from AWS SSM",
  "AWS Secrets Manager": "Pull the parameters from AWS Secrets Manager",
};
export type SetupMode = keyof typeof setupModes;

export type PersistedConnection = {
  inputParameters: Record<string, string>;
  resolvedParameters: Record<string, string>;
  connectionType: "ssl" | "sasl";
  awsRegion?: string;
  setupMode: SetupMode;
};

export const connectionsAtom = atomWithStorage<{
  [connectionName: string]: PersistedConnection;
}>("connections", {});
