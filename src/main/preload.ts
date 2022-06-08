import { randomUUID } from "crypto";
import { contextBridge } from "electron";
import { getAwsSecrets } from "./aws/getAwsSecrets";
import { getAwsSsmParams } from "./aws/getAwsSsmParams";
import { getSubjects, getSubjectValue } from "./kafka/subjects";
import { getTopicConfig, getTopicOffsets, getTopics } from "./kafka/topics";
import { prettify } from "./prettify/prettify";

const exposedApi = {
  randomUUID,
  getSubjects,
  getSubjectValue,
  getTopics,
  getTopicConfig,
  getTopicOffsets,
  getAwsSsmParams: getAwsSsmParams,
  getAwsSecrets: getAwsSecrets,
  prettify,
};

export type ContextBridgeApi = typeof exposedApi;

contextBridge.exposeInMainWorld("api", exposedApi);
