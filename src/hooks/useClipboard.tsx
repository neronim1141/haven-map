import { useCallback } from "react";

export const useClipboard = () => {
  return useCallback((value: string) => {
    return navigator.clipboard.writeText(value);
  }, []);
};
