import React, { useCallback, useState } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";

const useFileRequest = (url: string) => {
  const [percent, setPercent] = useState<number>();
  const [loading, setLoading] = useState(false);
  const fetchExport = useCallback(async () => {
    setLoading(true);
    setPercent(0);

    const data = await axios.get("/api/map/export", {
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        let percentCompleted = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setPercent(percentCompleted);
      },
    });
    setPercent(undefined);
    setLoading(false);
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data.data);
    a.download = "export.zip";
    a.click();
  }, []);

  return {
    isLoading: loading,
    downloadProgress: percent,
    getFile: fetchExport,
  };
};

const Page = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    alert("TBD");
  };
  const { mutateAsync, isLoading } = trpc.useMutation("map.fixData");
  const {
    isLoading: fileLoading,
    downloadProgress,
    getFile,
  } = useFileRequest("/api/map/export");
  return (
    <div>
      <button onClick={() => getFile()}>
        download maps data {fileLoading && ":" + downloadProgress + "%"}
      </button>
      <br />
      <button onClick={() => mutateAsync()}>
        Fix grid data {isLoading ? "O" : ""}
      </button>
    </div>
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <div className="btn">
    //     <span>File</span>
    //     <input type="file" {...register("merge")} />
    //   </div>
    //   <button
    //     className="btn waves-effect waves-light"
    //     type="submit"
    //     name="action"
    //   >
    //     Merge
    //   </button>
    // </form>
  );
};

export default Page;
