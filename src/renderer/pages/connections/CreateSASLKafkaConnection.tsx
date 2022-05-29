import { CreateConnection } from "./CreateConnection";

const mechanisms = ["plain", "scram-sha-256", "scram-sha-512"] as const;
export type Mechanism = typeof mechanisms[number];

export const CreateSASLKafkaConnection = () => (
  <CreateConnection
    connectionType="sasl"
    parameters={[
      {
        label: "Cluster URI",
        key: "clusterUri",
        awsDefault: "/cluster_uri",
        inputType: "text",
      },
      {
        label: "Kafka username",
        key: "username",
        awsDefault: "/username",
        inputType: "text",
      },
      {
        label: "Kafka password",
        key: "password",
        awsDefault: "/password",
        inputType: "text",
      },
      {
        label: "Mechanism",
        key: "mechanism",
        options: mechanisms,
        inputType: "select",
        default: "plain",
      },
      {
        label: "Schema URI",
        key: "schemaUri",
        awsDefault: "/schema_uri",
        inputType: "text",
      },
      {
        label: "Schema username",
        key: "schemaUsername",
        awsDefault: "/registry_username",
        inputType: "text",
      },
      {
        label: "Schema password",
        key: "schemaPassword",
        awsDefault: "/registry_password",
        inputType: "text",
      },
    ]}
  />
);
