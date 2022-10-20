import { ConnectionConfig } from "renderer/pages/connections/Connections";
import { getCastle } from "./getCastle";
import { TopicOffset } from "./topics";

export const setOffset = async (
  config: ConnectionConfig,
  topic: string,
  groupId: string,
  offsets: TopicOffset[]
): Promise<void> => {
  const castle = await getCastle(config);

  return await castle.kafka
    .admin()
    .setOffsets({ groupId, topic, partitions: offsets });
};

export const getConsumerOffset = async (
  config: ConnectionConfig,
  groupId: string
): Promise<{ topic: string; partitions: TopicOffset[] }[]> => {
  const castle = await getCastle(config);

  return await castle.kafka.admin().fetchOffsets({
    groupId,
  });
};

export const getConsumerStatus = async (
  config: ConnectionConfig,
  groupId: string
) => {
  const castle = await getCastle(config);

  return await castle.kafka.admin().describeGroups([groupId]);
};
