"use client";

import { Combobox } from "@base-ui/react/combobox";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./search-select.scss";
import { useDebounced } from "@/app/util/hooks";

export type SearchSelectItem = {
  label: string;
  value: string;
};

const ADD_NEW_VALUE = "__add_new__";

export function SearchSelect({
  name,
  onSearch,
  onSelect,
  onAddNew,
  placeholder,
  addNewLabel,
  value,
  displayValue,
}: {
  name: string;
  onSearch: (query: string) => Promise<SearchSelectItem[]>;
  onSelect: (item: SearchSelectItem | null) => void;
  onAddNew?: () => void;
  placeholder?: string;
  addNewLabel?: string;
  value?: string | null;
  displayValue?: string | null;
}) {
  const [inputValue, setInputValue] = useState(displayValue ?? "");
  const debouncedQuery = useDebounced(inputValue.trim(), 300);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(displayValue ?? "");
  }, [displayValue]);

  const { data: items = [] } = useQuery({
    queryKey: ["search-select", name, debouncedQuery],
    queryFn: () => onSearch(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    if (!query.trim()) {
      onSelect(null);
    }
  };

  const handleValueChange = (newValue: string | null) => {
    if (newValue === ADD_NEW_VALUE) {
      onAddNew?.();
      return;
    }
    const selected = items.find((item) => item.value === newValue) ?? null;
    if (selected) {
      setInputValue(selected.label);
    }
    onSelect(selected);
  };

  return (
    <div className="search-select">
      <Combobox.Root value={value ?? null} onValueChange={handleValueChange}>
        <Combobox.InputGroup className="search-select-input-group">
          <Combobox.Input
            className="search-select-input"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            // onFocus={handleInputChange}
          />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner className="search-select-positioner">
            <Combobox.Popup className="search-select-popup">
              <Combobox.List className="search-select-list">
                {items.map((item) => (
                  <Combobox.Item
                    key={item.value}
                    value={item.value}
                    className="search-select-item"
                  >
                    {item.label}
                  </Combobox.Item>
                ))}
                {items.length === 0 ? (
                  <Combobox.Empty className="search-select-empty">
                    {inputValue ? "No results" : "Type to search..."}
                  </Combobox.Empty>
                ) : null}
                {onAddNew ? (
                  <Combobox.Item
                    value={ADD_NEW_VALUE}
                    className="search-select-item search-select-add-new"
                  >
                    {addNewLabel ?? "+ Add new"}
                  </Combobox.Item>
                ) : null}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}
