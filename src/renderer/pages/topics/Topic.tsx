import "./Topic.scss";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TopicOffset } from "main/kafka/topics";
import { BreadCrumbs } from "renderer/components/BreadCrumbs";
import { InfoChip } from "renderer/components/InfoChip";
import { LoadingPulse } from "renderer/components/LoadingPulse";
import { useAutoAnimate } from "renderer/hooks/useAutoAnimate";
import { Icon } from "renderer/components/Icon";
import { useOffsets, useTotals } from "./hooks/useTopicData";

const ONE_HOUR_MS = 60 * 60 * 1000;

const sumMessages = (offsets: TopicOffset[]) =>
  offsets.reduce((sum, { offset }) => sum + parseInt(offset), 0);

export const Topic = () => {
  const { topicName } = useParams();

  const [endTimestamp, setEndtimestamp] = useState(new Date().getTime());
  const [startTimestamp, setStartTimestamp] = useState(
    endTimestamp - ONE_HOUR_MS
  );

  const [totalsStatus, { messages, partitions }] = useTotals(topicName);
  const [endOffsetsStatus, endOffsets] = useOffsets(topicName, endTimestamp);
  const [startOffsetsStatus, startOffsets] = useOffsets(
    topicName,
    startTimestamp
  );

  const messagesToConsume = sumMessages(endOffsets) - sumMessages(startOffsets);

  const actionContainer = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="page">
      <BreadCrumbs
        extraCrumbs={[{ link: "/topics", text: "Topics" }]}
        current={topicName}
      />
      <div className="nonshrinkContent">
        <InfoChip label="Messages" value={messages} status={totalsStatus} />
        <InfoChip label="Partitions" value={partitions} status={totalsStatus} />

        <form className="dateTimeRangeForm">
          <input
            className="form__input"
            defaultValue={new Date(startTimestamp).toISOString().slice(0, -8)}
            onChange={(e) => {
              setStartTimestamp(Date.parse(e.target.value));
            }}
            max={new Date(endTimestamp).toISOString().slice(0, -8)}
            type="datetime-local"
          />
          <span> to </span>
          <input
            className="form__input"
            onChange={(e) => {
              setEndtimestamp(Date.parse(e.target.value));
            }}
            max={new Date().toISOString().slice(0, -8)}
            defaultValue={new Date(endTimestamp).toISOString().slice(0, -8)}
            type="datetime-local"
          />
        </form>

        <div className="consumingInfo" ref={actionContainer}>
          {endOffsetsStatus === "fetched" && startOffsetsStatus === "fetched" && (
            <>
              {messagesToConsume > 0 ? (
                <button className="button">
                  Consume {messagesToConsume} messages
                </button>
              ) : (
                <p className="consumingInfo__message" key="noMessages">
                  <Icon>error_outline</Icon>&nbsp;No messages in date range.
                </p>
              )}
            </>
          )}

          {(endOffsetsStatus === "fetching" ||
            startOffsetsStatus === "fetching") && (
            <p className="consumingInfo__message" key="fetchingOffsets">
              <LoadingPulse />
              &nbsp;Fetching offsets...
            </p>
          )}
          {endOffsetsStatus === "errored" ||
            (startOffsetsStatus === "errored" && (
              <p className="consumingInfo__message" key="errorFetching">
                <Icon>error_outline</Icon>&nbsp;Failed to fetch offsets.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};
