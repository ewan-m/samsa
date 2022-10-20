import { randomUUID } from "crypto";
import { contextBridge } from "electron";
import {
  getAwsEventSourceMappings,
  toggleAwsEventSourceMapping,
} from "./aws/getAwsEventSourceMappings";
import { getAwsSecrets } from "./aws/getAwsSecrets";
import { getAwsSsmParams } from "./aws/getAwsSsmParams";
import { setOffset } from "./kafka/consumers";
import { getSubjects, getSubjectValue } from "./kafka/subjects";
import {
  getTopicConfig,
  getTopicOffsets,
  getTopics,
  getTopicTotals,
} from "./kafka/topics";
import { prettify } from "./prettify/prettify";

const exposedApi = {
  randomUUID,
  getSubjects,
  getSubjectValue,
  getTopics,
  getTopicConfig,
  getTopicOffsets,
  getTopicTotals,
  getAwsSsmParams: getAwsSsmParams,
  getAwsSecrets: getAwsSecrets,
  getAwsEventSourceMappings: getAwsEventSourceMappings,
  toggleAwsEventSourceMapping: toggleAwsEventSourceMapping,
  setOffset: setOffset,
  prettify,
};

export type ContextBridgeApi = typeof exposedApi;

contextBridge.exposeInMainWorld("api", exposedApi);
