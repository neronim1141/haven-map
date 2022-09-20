import React, { useCallback, useState } from "react";

import axios from "axios";

export const useFileRequest = (
  url: string,
  onUploadProgress?: (percent: number) => void
) => {
  const [loading, setLoading] = useState<boolean>();
  const fetchExport = useCallback(async () => {
    setLoading(true);
    const data = await axios.get(url, {
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        let percentCompleted = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        onUploadProgress?.(percentCompleted);
      },
    });
    setLoading(false);

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data.data);
    a.download = "export.zip";
    a.click();
  }, [url, onUploadProgress]);

  return {
    loading: loading,
    getFile: fetchExport,
  };
};
