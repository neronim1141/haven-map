import React from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useImportMapMutation } from "graphql/client/graphql";

const Page = () => {
  const { register, handleSubmit } = useForm();
  const [mutation] = useImportMapMutation();
  const onSubmit = (data: any) => {
    console.log(data.merge[0]);
    mutation({ variables: { zipFile: data.merge[0] } });
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
