import { useEffect, useState } from "react";

function useDebounce<T>(
  value: T,
  delay?: number
): { value: T; debouncing: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    if (value) setDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setDebouncing(false);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { value: debouncedValue, debouncing };
}

export default useDebounce;
