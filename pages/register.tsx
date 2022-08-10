import { InferGetServerSidePropsType } from "next";
import { CtxOrReq } from "next-auth/client/_utils";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (values: any) => {
    const res = await signIn("credentials", {
      redirect: false,
      login: values.login,
      password: values.password,
    });
    if (res && res.url) router.push(res.url);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="uppercase text-sm text-gray-600 font-bold"
        >
          Email
          <input
            type="text"
            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
            {...register("login")}
          />
        </label>
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="uppercase text-sm text-gray-600 font-bold"
        >
          password
          <input
            aria-label="enter your password"
            aria-required="true"
            type="password"
            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
            {...register("password")}
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-green-400 text-gray-100 p-3 rounded-lg w-full"
      >
        Sign In
      </button>
    </form>
  );
};

export default Login;
