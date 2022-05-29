import { Castle, createCastle } from "@ovotech/castle";
import { ConnectionConfig } from "renderer/pages/connections/Connections";

export const getCastle = async (config: ConnectionConfig): Promise<Castle> => {
  const castle = createCastle({
    schemaRegistry: {
      uri: config.schemaUri.replace(
        "https://",
        `https://${config.schemaUsername}:${config.schemaPassword}@`
      ),
    },
    kafka: {
      brokers: [config.clusterUri],
      connectionTimeout: 10000,
      ...(config.type === "ssl"
        ? {
            ssl: {
              rejectUnauthorized: false,
              ca: [config.ca],
              key: config.key,
              cert: config.cert,
            },
          }
        : {
            sasl: {
              username: config.username,
              mechanism: config.mechanism,
              password: config.password,
            },
          }),
    },
  });
  await castle.start();
  return castle;
};
