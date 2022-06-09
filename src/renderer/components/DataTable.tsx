import "./DataTable.scss";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useAutoAnimate } from "renderer/hooks/useAutoAnimate";
import { CodeInput } from "./CodeInput";

export const DataTable: FunctionComponent<{
  items: string[];
  onItemClick: (item: string) => void;
  actions: ReactElement;
}> = ({ items, actions, onItemClick }) => {
  const [search, setSearch] = useState("");
  const [advancedFilter, setAdvancedFilter] =
    useState(`(item, index, items) => {
  const term = "";
  return item.includes(term);
}`);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const tableContainer = useAutoAnimate<HTMLDivElement>();
  const searchContainer = useAutoAnimate<HTMLFormElement>();

  useEffect(() => {
    setSliceCap(30);
    if (isAdvanced) {
      try {
        setFilteredItems(items.filter(eval(advancedFilter)));
      } catch (e) {}
    } else {
      setFilteredItems(
        items.filter((item) => (search !== "" ? item.includes(search) : true))
      );
    }
  }, [items, isAdvanced, search, advancedFilter]);

  const [sliceCap, setSliceCap] = useState(30);

  return (
    <>
      <form
        ref={searchContainer}
        className="dataTable__search nonshrinkContent"
      >
        {isAdvanced ? (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsAdvanced(!isAdvanced);
              }}
              className="dataTable__filterToggle"
            >
              Simple filter
            </button>
            <CodeInput
              value={advancedFilter}
              onChange={(e) => setAdvancedFilter(e.target.value)}
              language="javascript"
            />
          </>
        ) : (
          <>
            <Icon className="dataTable__search__icon">search</Icon>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="dataTable__search__input"
              placeholder="Search"
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsAdvanced(!isAdvanced);
              }}
              style={{ marginLeft: "0.5rem" }}
              className="dataTable__filterToggle"
            >
              Advanced filter
            </button>
          </>
        )}
      </form>
      <div
        ref={filteredItems.length < 20 ? tableContainer : null}
        className="dataTable shrinkContent"
      >
        {filteredItems.slice(0, sliceCap).map((item) => (
          <button
            onClick={(e) => {
              e.preventDefault();
              onItemClick(item);
            }}
            key={item}
            className="dataTable__item"
            title={item}
          >
            {item}
          </button>
        ))}
        {items && filteredItems.length > sliceCap && (
          <button
            onClick={() => {
              setSliceCap(sliceCap + 5);
            }}
            style={{ margin: "0.75rem" }}
            className="button button--secondary"
          >
            Load more
          </button>
        )}
      </div>
      <div className="nonshrinkContent">
        <div className="dataTable__actions">{actions}</div>
      </div>
    </>
  );
};
