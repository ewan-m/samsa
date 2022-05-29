import { SSM } from "@aws-sdk/client-ssm";

export const getAwsSsmParams = async (
  params: Record<string, string>,
  region: string
): Promise<Record<string, string> | undefined> => {
  const paramNames = Object.values(params);

  const parameters = (
    await new SSM({ region: region }).getParameters({
      Names: Object.values(paramNames),
      WithDecryption: true,
    })
  ).Parameters;

  if (!parameters || parameters.length !== paramNames.length) {
    throw Error("Couldn't find any parameters with those keys");
  }

  return parameters?.reduce((accumulation, { Name, Value }) => {
    const paramName = Object.entries(params).find(
      ([_, value]) => value === Name
    )?.[0];

    if (!paramName || !Value) {
      throw Error(`Couldn't find value ${Name} ${paramName} ${Value}`);
    }
    return { ...accumulation, [paramName]: Value };
  }, {} as Record<string, string>);
};
