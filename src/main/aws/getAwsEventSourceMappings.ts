import {
  LambdaClient,
  ListEventSourceMappingsCommand,
  UpdateEventSourceMappingCommand,
} from "@aws-sdk/client-lambda";

type AwsConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

export const getAwsEventSourceMappings = async ({
  awsConfig,
  functionName,
}: {
  awsConfig: AwsConfig;
  functionName: string;
}) => {
  const { region, accessKeyId, secretAccessKey, sessionToken } = awsConfig;
  const client = new LambdaClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken,
    },
  });
  const command = new ListEventSourceMappingsCommand({
    FunctionName: functionName,
  });
  const response = await client.send(command);
  return response.EventSourceMappings;
};

export const toggleAwsEventSourceMapping = async ({
  awsConfig,
  consumerGroupId,
  enabled,
}: {
  awsConfig: AwsConfig;
  consumerGroupId: string;
  enabled: boolean;
}) => {
  const { region, accessKeyId, secretAccessKey, sessionToken } = awsConfig;

  const client = new LambdaClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken,
    },
  });
  const command = new UpdateEventSourceMappingCommand({
    UUID: consumerGroupId,
    Enabled: enabled,
  });
  const response = await client.send(command);
  return response;
};
