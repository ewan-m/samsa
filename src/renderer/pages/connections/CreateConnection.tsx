import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { BreadCrumbs } from "renderer/components/BreadCrumbs";
import { ErrorMessage } from "renderer/components/ErrorMessage";
import { Stepper } from "renderer/components/Stepper";
import {
  connectionsAtom,
  SetupMode,
  setupModes,
} from "renderer/state/connections";
import { useAutoAnimate } from "renderer/hooks/useAutoAnimate";

type ParameterInput = { label: string; awsDefault?: string; key: string } & (
  | { inputType: "text" }
  | {
      inputType: "select";
      options: Readonly<string[]>;
      default: string;
    }
);

export const CreateConnection: FunctionComponent<{
  parameters: ParameterInput[];
  connectionType: "ssl" | "sasl";
}> = ({ parameters, connectionType }) => {
  const [step, setStep] = useState(0);
  const [setupMode, setSetupMode] = useState<SetupMode>("Manual");

  const [awsRegion, setAwsRegion] = useState("eu-west-1");

  const [connectionName, setConnectionName] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [resolvedParams, setResolvedParams] = useState<Record<string, string>>(
    {}
  );

  const isAws = setupMode !== "Manual";

  useEffect(() => {
    const newParams = {} as Record<string, string>;
    parameters.forEach((param) => {
      if (param.inputType === "select") {
        newParams[param.key] = param.default;
      } else {
        if (isAws && param.awsDefault) {
          newParams[param.key] = param.awsDefault;
        } else {
          newParams[param.key] = "";
        }
      }
    });
    setParams(newParams);
  }, [isAws]);

  const [fetchStatus, setFetchStatus] = useState<
    "fetching" | "fetched" | "errored"
  >("fetching");
  const [errorMessage, setErrorMessage] = useState("" as any);

  const progressToConfirmation: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    setStep(2);
    setFetchStatus("fetching");

    try {
      if (setupMode === "Manual") {
        setResolvedParams(params);
      } else {
        const fetchedParams = await (setupMode === "AWS SSM"
          ? window.api.getAwsSsmParams
          : window.api.getAwsSecrets)(params, awsRegion);
        if (!fetchedParams) {
          throw Error();
        } else {
          setResolvedParams(fetchedParams);
        }
      }
      setFetchStatus("fetched");
    } catch (error) {
      setFetchStatus("errored");
      setErrorMessage((error as Error).message);
    }
  };

  const [connections, setConnections] = useAtom(connectionsAtom);
  const navigate = useNavigate();
  const saveConnection: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setConnections({
      ...connections,
      [connectionName]: {
        connectionType,
        setupMode,
        awsRegion,
        inputParameters: params,
        resolvedParameters: resolvedParams,
      },
    });
    navigate("/connections");
  };
  const animationContainer = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={animationContainer} className="page">
      <BreadCrumbs
        extraCrumbs={[{ link: "/connections", text: "Connections" }]}
      />

      <h2 className="title nonshrinkContent" style={{ padding: 0 }}>
        {connectionType.toLocaleUpperCase()} Kafka
      </h2>
      <Stepper
        totalSteps={3}
        currentStep={step}
        stepBack={() => {
          setStep(step - 1);
        }}
      />

      {step === 0 && (
        <>
          <p className="paragraph nonshrinkContent">
            Choose a name for your connection and how you would like to specify
            the connection parameters.
          </p>
          <form className="form shrinkContent">
            <label className="form__label">
              Connection name
              <input
                className="form__input"
                type="text"
                spellCheck={false}
                value={connectionName}
                onChange={(e) => {
                  setConnectionName(e.target.value);
                }}
              />
            </label>
            <label className="form__label">
              How would you like to configure the connection?
              <select
                className="form__input"
                value={setupMode}
                onChange={(e) => {
                  setSetupMode(e.target.value as SetupMode);
                }}
              >
                {Object.entries(setupModes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="form__submit"
              onClick={(e) => {
                e.preventDefault();
                connectionName && setStep(1);
              }}
            >
              Proceed to configure parameters
            </button>
          </form>
        </>
      )}

      {step === 1 && (
        <form className="form shrinkContent">
          {isAws && (
            <label className="form__label">
              AWS Region
              <input
                className="form__input"
                type="text"
                spellCheck={false}
                value={awsRegion}
                onChange={(e) => {
                  setAwsRegion(e.target.value);
                }}
              />
            </label>
          )}

          {parameters.map((parameter) => (
            <label key={parameter.label} className="form__label">
              {parameter.label}{" "}
              {isAws && parameter.awsDefault && `(${setupMode} parameter key)`}
              {parameter.inputType === "text" && (
                <input
                  className="form__input"
                  type="text"
                  spellCheck={false}
                  value={params[parameter.key]}
                  onChange={(e) => {
                    setParams({
                      ...params,
                      [parameter.key]: e.target.value,
                    });
                  }}
                />
              )}
              {parameter.inputType === "select" && (
                <select className="form__input">
                  {parameter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              )}
            </label>
          ))}
          <button onClick={progressToConfirmation} className="form__submit">
            {isAws ? "Fetch parameters" : "Confirm connection"}
          </button>
        </form>
      )}
      {step === 2 && (
        <>
          {fetchStatus === "fetched" && (
            <div>
              <code className="readonlyCode">
                {JSON.stringify(resolvedParams, null, 2)}
              </code>
              <p className="paragraph">
                Double check the configuration above appears correct then hit
                save to start interacting with the cluster.
              </p>
              <button onClick={saveConnection} className="form__submit">
                Save connection configuration
              </button>
            </div>
          )}
          {fetchStatus === "fetching" && <p>Fetching...</p>}
          {fetchStatus === "errored" && <ErrorMessage message={errorMessage} />}
        </>
      )}
    </div>
  );
};
