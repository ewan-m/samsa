import { ConnectionConfig } from "../../renderer/pages/connections/Connections";
import { getCastle } from "./getCastle";

export const getTopics = async (
  config: ConnectionConfig
): Promise<string[]> => {
  const castle = await getCastle(config);

  return await castle.kafka.admin().listTopics();
};
