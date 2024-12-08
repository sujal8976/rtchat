"use client";

import { useState, useEffect } from "react";

export function useDebounce(value: string, timeout: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutNumber = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => {
      clearTimeout(timeoutNumber);
    };
  }, [value]);

  return debouncedValue;
}
