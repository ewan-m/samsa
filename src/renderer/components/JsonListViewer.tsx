import "./JsonListViewer.scss";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { CodeInput } from "./CodeInput";
import { Icon } from "./Icon";

const deleteFields = (item: string, fields: string[]) => {
  if (item) {
    try {
      const object: Record<any, any> = JSON.parse(item);

      const recursivelyTraverse = (input: Record<any, any>): any => {
        if (input && typeof input === "object") {
          if (Array.isArray(input)) {
            return input.map((yi) => recursivelyTraverse(yi));
          }
          console.log(input);

          const filteredEntries = Object.entries(input)
            .map(([key, value]) => {
              if (!fields.includes(key)) {
                if (typeof value === "object") {
                  return [key, recursivelyTraverse(value)];
                } else if (Array.isArray(value)) {
                  return [key, value.map((yo) => recursivelyTraverse(yo))];
                } else {
                  return [key, value];
                }
              }
              return [];
            })
            .filter((entry) => entry.length > 0);

          return Object.fromEntries(filteredEntries);
        }
        return input;
      };
      const result = recursivelyTraverse(object);
      console.log(result);
      return JSON.stringify(result, null, 1);
    } catch (e) {
      return "";
    }
  }
  return "";
};

const JsonComponent: FunctionComponent<{ item: string }> = ({ item }) => {
  if (item) {
    try {
      const object: Record<any, any> = JSON.parse(item);

      const recursivelyTraverse = (input: Record<any, any>) => {
        if (input && typeof input === "object") {
          const filteredEntries = Object.entries(input).map(([k, v]) => {
            if (typeof v === "object" && v !== null) {
              if (Array.isArray(v)) {
                return (
                  <span style={{ display: "block", paddingLeft: "10px" }}>
                    {k} {"["}{" "}
                    <span style={{ display: "block", paddingLeft: "10px" }}>
                      {v.map((yo) => recursivelyTraverse(yo))}
                    </span>{" "}
                    {"]"}
                  </span>
                );
              } else {
                return (
                  <span style={{ display: "block", paddingLeft: "10px" }}>
                    {k}{" "}
                    <span style={{ display: "block", paddingLeft: "10px" }}>
                      {recursivelyTraverse(v)}
                    </span>
                  </span>
                );
              }
            } else {
              return (
                <span style={{ display: "block", paddingLeft: "10px" }}>
                  <>
                    <strong>{k}</strong>: {v}
                  </>
                </span>
              );
            }
          });

          return (
            <span style={{ display: "block" }}>
              {"{"}
              {filteredEntries.map((el) => el)}
              {"}"}
            </span>
          );
        }
        return <span style={{ color: "red" }}>{input + ", "}</span>;
      };

      return recursivelyTraverse(object);
    } catch (e) {
      return <p>JSON parsing error</p>;
    }
  }
  return <p>JSON parsing error</p>;
};

const getUniqueKeys = (item: string) => {
  const uniqueKeys: Record<string, boolean> = {};
  item
    .split('":')
    .slice(0, -1)
    .forEach((bit) => {
      const key = bit.substring(bit.lastIndexOf('"') + 1);
      uniqueKeys[key] = true;
    });
  return Object.keys(uniqueKeys);
};

export const __JsonListViewer: FunctionComponent<{
  items: string[];
}> = ({ items = [] }) => {
  const fields = useCallback(() => getUniqueKeys(items[0]), [items])();

  const [filteredItems, setFilteredItems] = useState<string[]>(items);

  const [hiddenFields, setHiddenFields] = useState<string[]>([]);

  useEffect(() => {
    setFilteredItems(items.map((item) => deleteFields(item, hiddenFields)));
  }, [items, hiddenFields]);

  return (
    <>
      <div className="nonshrinkContent">
        <form>
          {fields.map((field) => (
            <button
              className={`jsonListViewer__hider ${
                hiddenFields.includes(field)
                  ? "jsonListViewer__hider--hidden"
                  : ""
              }`}
              key={field}
              onClick={(e) => {
                e.preventDefault();
                if (hiddenFields.includes(field)) {
                  setHiddenFields(
                    hiddenFields.filter((hidden) => hidden !== field)
                  );
                } else {
                  setHiddenFields([...hiddenFields, field]);
                }
              }}
            >
              <Icon>
                {hiddenFields.includes(field) ? "visibility_off" : "visibility"}
              </Icon>
              &nbsp;{field}
            </button>
          ))}
        </form>
      </div>
      <div className="shrinkContent">
        {filteredItems.map((item) => (
          <CodeInput language="json" value={item} onChange={null} />
        ))}
      </div>
    </>
  );
};

export const JsonListViewer: FunctionComponent<{
  items: string[];
}> = ({ items = [] }) => {
  const renderedItems = useCallback(() => {
    return items.map((jsonString) => {
      return <JsonComponent item={jsonString} />;
    });
  }, items);

  return (
    <div className="nonshrinkContent">{renderedItems().map((el) => el)}</div>
  );
};
