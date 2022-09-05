import React, { useCallback, useState } from "react";

import axios from "axios";

export const useFileRequest = (url: string) => {
  const [percent, setPercent] = useState<number>();
  const fetchExport = useCallback(async () => {
    setPercent(0);

    const data = await axios.get(url, {
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        let percentCompleted = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setPercent(percentCompleted);
      },
    });
    setPercent(undefined);
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data.data);
    a.download = "export.zip";
    a.click();
  }, [url]);

  return {
    downloadProgress: percent,
    getFile: fetchExport,
  };
};
