import { ConnectionConfig } from "../../renderer/pages/connections/Connections";
import { getCastle } from "./getCastle";

export const getTopics = async (
  config: ConnectionConfig
): Promise<string[]> => {
  const castle = await getCastle(config);

  return await castle.kafka.admin().listTopics();
};

export const getTopicConfig = async (
  config: ConnectionConfig,
  topicName: string
): Promise<any> => {
  const castle = await getCastle(config);

  return (
    await castle.kafka.admin().describeConfigs({
      resources: [{ type: 2, name: topicName }],
      includeSynonyms: true,
    })
  ).resources[0].configEntries;
};

export type TopicOffset = {
  partition: number;
  offset: string;
};

export const getTopicOffsets = async (
  config: ConnectionConfig,
  topicName: string,
  timestamp: number = new Date().getTime()
): Promise<TopicOffset[]> => {
  const castle = await getCastle(config);

  return await castle.kafka
    .admin()
    .fetchTopicOffsetsByTimestamp(topicName, timestamp);
};
