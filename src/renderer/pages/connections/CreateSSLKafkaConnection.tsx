import { CreateConnection } from "./CreateConnection";

export const CreateSSLKafkaConnection = () => (
  <CreateConnection
    connectionType="ssl"
    parameters={[
      {
        label: "Cluster URI",
        key: "clusterUri",
        inputType: "text",
        awsDefault: "/cluster_uri",
      },
      {
        label: "CA Certificate",
        key: "ca",
        inputType: "text",
        awsDefault: "/ca_cert",
      },
      {
        label: "Service Key",
        key: "key",
        inputType: "text",
        awsDefault: "/service_key",
      },
      {
        label: "Service Certificate",
        key: "cert",
        inputType: "text",
        awsDefault: "/service_key",
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
