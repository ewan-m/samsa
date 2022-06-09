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
  timestamp: number
): Promise<TopicOffset[]> => {
  const castle = await getCastle(config);

  const offsets = await castle.kafka
    .admin()
    .fetchTopicOffsetsByTimestamp(topicName, timestamp);

  return offsets;
};

export const getTopicTotals = async (
  config: ConnectionConfig,
  topicName: string
): Promise<{ messages: number; partitions: number }> => {
  const castle = await getCastle(config);

  const topicOffsets = await castle.kafka.admin().fetchTopicOffsets(topicName);

  const messages = topicOffsets.reduce(
    (sum, { high, low }) => sum + parseInt(high) - parseInt(low),
    0
  );

  return { messages, partitions: topicOffsets.length };
};
