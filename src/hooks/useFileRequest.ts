import React, { useCallback, useState } from "react";

import axios from "axios";

export const useFileRequest = (url: string) => {
  const [percent, setPercent] = useState<number>();
  const [loading, setLoading] = useState<boolean>();
  const fetchExport = useCallback(async () => {
    setLoading(true);
    const data = await axios.get(url, {
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        setPercent(0);
        setLoading(false);
        let percentCompleted = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setPercent(percentCompleted);
      },
    });
    setPercent(undefined);
    setPercent(undefined);
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data.data);
    a.download = "export.zip";
    a.click();
  }, [url]);

  return {
    loading: loading,
    downloadProgress: percent,
    getFile: fetchExport,
  };
};
