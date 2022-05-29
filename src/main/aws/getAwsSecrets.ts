import { SecretsManager } from "@aws-sdk/client-secrets-manager";

export const getAwsSecrets = async (
  connectionConfig: Record<string, string>,
  region: string
): Promise<Record<string, string> | undefined> => {
  const secretsManager = new SecretsManager({ region: region });
  const secretNames = Object.values(connectionConfig);

  const secretList = (
    await secretsManager.listSecrets({
      Filters: [{ Key: "name", Values: secretNames }],
    })
  ).SecretList;

  if (!secretList || secretList.length !== secretNames.length) {
    throw Error("Couldn't find any secrets with those keys");
  }

  const enrichedSecrets = secretList.map(async (secretDescription) => {
    const matchingKey = Object.entries(connectionConfig).find(
      ([_, value]) => value === secretDescription.Name
    )?.[0];

    const secretValue = (
      await secretsManager.getSecretValue({ SecretId: secretDescription.ARN })
    ).SecretString;
    if (!matchingKey || !secretValue) {
      throw Error("Couldn't find a matching key or get secret value");
    }
    return [matchingKey, secretValue];
  });

  return Object.fromEntries(await Promise.all(enrichedSecrets));
};
