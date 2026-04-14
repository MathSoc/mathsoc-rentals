"use client";

import { Combobox } from "@base-ui/react/combobox";
import { useRef, useState } from "react";
import "./search-select.scss";

export type SearchSelectItem = {
  label: string;
  value: string;
};

type SearchSelectProps = {
  onSearch: (query: string) => Promise<SearchSelectItem[]>;
  onSelect: (item: SearchSelectItem | null) => void;
  placeholder?: string;
  value?: string | null;
  displayValue?: string | null;
};

export const SearchSelect: React.FC<SearchSelectProps> = ({
  onSearch,
  onSelect,
  placeholder,
  value,
  displayValue,
}) => {
  const [items, setItems] = useState<SearchSelectItem[]>([]);
  const [inputValue, setInputValue] = useState(displayValue ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setItems([]);
      onSelect(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await onSearch(query);
      setItems(results);
    }, 300);
  };

  const handleValueChange = (newValue: string | null) => {
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
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};
