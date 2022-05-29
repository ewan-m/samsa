import { randomUUID } from "crypto";
import { contextBridge } from "electron";
import { getAwsSecrets } from "./aws/getAwsSecrets";
import { getAwsSsmParams } from "./aws/getAwsSsmParams";
import { getSubjects } from "./kafka/getSubjects";

const exposedApi = {
  randomUUID,
  getSubjects: getSubjects,
  getAwsSsmParams: getAwsSsmParams,
  getAwsSecrets: getAwsSecrets,
};

export type ContextBridgeApi = typeof exposedApi;

contextBridge.exposeInMainWorld("api", exposedApi);
