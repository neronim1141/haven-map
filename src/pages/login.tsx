import React from "react";

import { SubmitButton } from "src/components/controls/buttons/SubmitButton";
import { Input } from "src/components/controls/inputs/FormInput";
import { ErrorMessage } from "src/components/errorMessage";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Head from "next/head";

const schema = z.object({
  login: z.string(),
  password: z.string().min(3),
});

type LoginFormData = z.infer<typeof schema>;

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (values: any) => {
    const res = await signIn("credentials", {
      redirect: false,
      login: values.login,
      password: values.password,
    });
    if (res?.error) {
      setError(res.error);
      return;
    }
    if (res && res.url) {
      setError(undefined);
      router.push(`/profile/${values.login.toLowerCase()}`);
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex items-center justify-center text-white"
      >
        <section className="flex  p-6 sm:p-0 w-[30rem] flex-col space-y-8">
          <div className="text-center text-4xl font-bold">Log In</div>

          <Input<LoginFormData>
            id="login"
            placeholder="Type login..."
            register={register}
            error={errors.login}
          />
          <Input<LoginFormData>
            id="password"
            type="password"
            placeholder="Type password..."
            register={register}
            error={errors.password}
          />
          <SubmitButton>Log In</SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          <p className="text-center text-lg">
            No account?{" "}
            <Link href="/register">
              <a className="font-medium text-indigo-500 underline-offset-4 hover:underline">
                Create One
              </a>
            </Link>
          </p>
        </section>
      </form>
    </>
  );
};

export default Login;
