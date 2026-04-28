import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export function useDebounced<T>(value: T, timeout: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebounced(value);
    }, timeout);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, timeout]);

  return debounced;
}

export function useDebouncedState<T>(
  initialValue: T,
  timeout: number,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const debounced = useDebounced(value, timeout);

  return [debounced, setValue];
}
