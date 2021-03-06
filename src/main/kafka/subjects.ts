import { SchemaRegistry } from "@ovotech/avro-kafkajs";
import { ConnectionConfig } from "renderer/pages/connections/Connections";

export const getSubjects = (config: ConnectionConfig): Promise<string[]> => {
  const uri = config.schemaUri.replace(
    "https://",
    `https://${config.schemaUsername}:${config.schemaPassword}@`
  );
  const schemaRegistry = new SchemaRegistry({ uri });
  return schemaRegistry.getSubjects();
};

export const getSubjectValue = async (
  config: ConnectionConfig,
  subjectName: string
): Promise<string> => {
  const uri = config.schemaUri.replace(
    "https://",
    `https://${config.schemaUsername}:${config.schemaPassword}@`
  );
  const schemaRegistry = new SchemaRegistry({ uri });

  const schema = await schemaRegistry.getSubjectLastVersionSchema(subjectName);
  return JSON.stringify(schema, null, 1);
};
