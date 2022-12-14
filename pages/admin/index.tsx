import React from "react";

import axios from "axios";
import { useForm } from "react-hook-form";

const Page = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    let formData = new FormData();
    formData.append("file", data.merge[0]);
    return axios.post("api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="btn">
        <span>File</span>
        <input type="file" {...register("merge")} />
      </div>
      <button
        className="btn waves-effect waves-light"
        type="submit"
        name="action"
      >
        Merge
      </button>
    </form>
  );
};

export default Page;
