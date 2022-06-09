import { TopicOffset } from "main/kafka/topics";
import { useState, useEffect } from "react";
import { useConnection } from "renderer/hooks/useConnection";
import { FetchStatus } from "renderer/types/FetchStatus";

export const useOffsets = (
  topicName: string | undefined,
  timestamp: number
): [status: FetchStatus, offsets: TopicOffset[]] => {
  const connection = useConnection();

  const [status, setStatus] = useState<FetchStatus>("fetching");
  const [offsets, setOffsets] = useState<TopicOffset[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    if (connection && topicName) {
      (async () => {
        setStatus("fetching");
        try {
          const offsets = await window.api.getTopicOffsets(
            connection,
            topicName,
            timestamp
          );
          if (isSubscribed) {
            setOffsets(offsets);
            setStatus("fetched");
          }
        } catch (error) {
          setStatus("errored");
        }
      })();
    }
    return () => {
      isSubscribed = false;
    };
  }, [timestamp]);

  return [status, offsets];
};

export const useTotals = (
  topicName: string | undefined
): [status: FetchStatus, totals: { messages: number; partitions: number }] => {
  const connection = useConnection();

  const [status, setStatus] = useState<FetchStatus>("fetching");
  const [total, setTotal] = useState<{ messages: number; partitions: number }>({
    messages: 0,
    partitions: 0,
  });

  useEffect(() => {
    if (connection && topicName) {
      (async () => {
        setStatus("fetching");
        try {
          const totalMessages = await window.api.getTopicTotals(
            connection,
            topicName
          );
          setTotal(totalMessages);
          setStatus("fetched");
        } catch (error) {
          setStatus("errored");
        }
      })();
    }
  }, []);

  return [status, total];
};
