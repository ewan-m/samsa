import { useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const Topics = () => {
  const [allTopics, setAllTopics] = useState<string[]>([]);

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div className="page">
      <BreadCrumbs />
      <h2 className="title">Topics</h2>
      {allTopics.map((topic) => (
        <p className="paragraph" key={topic}>
          {topic}
        </p>
      ))}
    </div>
  );
};
