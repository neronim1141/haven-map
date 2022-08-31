import React from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";

const Page = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    alert("TBD");
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
