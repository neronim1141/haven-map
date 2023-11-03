import React from "react";

import { SubmitButton } from "src/components/controls/buttons/SubmitButton";
import { Input } from "src/components/controls/inputs/FormInput";
import { ErrorMessage } from "src/components/errorMessage";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Head from "next/head";
import { trpc } from "utils/trpc";
import { toast } from "react-toastify";
import { useAuth } from "~/contexts/auth";
import { signIn } from "next-auth/react";

const schema = z
  .object({
    login: z.string(),
    password: z.string().min(3),
    repeatPassword: z.string().min(3),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });
type RegisterFormData = z.infer<typeof schema>;

const Register = () => {
  const auth = useAuth();
  const router = useRouter();
  const { mutateAsync: createUser } = trpc.useMutation("user.create");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (values: any) => {
    const id = toast("Please wait...");
    const user = await createUser(
      { name: values.login, password: values.password },
      {
        onError: (e) => {
          setError(e.message);
        },
        onSuccess: () => {
          setError("");
        },
      }
    );
    if (!user) return;
    toast.update(id, {
      render: "User Created Sucessfully!",
      type: toast.TYPE.SUCCESS,
      isLoading: false,
      autoClose: 2500,
    });
    toast("You need to wait for one of the admins to set your role", {
      autoClose: false,
    });
    const res = await signIn("credentials", {
      redirect: false,
      login: values.login,
      password: values.password,
    });
    if (res?.error) {
      toast.error(res.error, {
        toastId: id,
      });
      return;
    }
    if (res && res.url) {
      toast.dismiss(id);
      const user = await auth.reload?.();
      router.push("/profile");
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full items-center justify-center text-white"
      >
        <section className="flex  w-[30rem] flex-col space-y-8 p-6 sm:p-0">
          <div className="text-center text-4xl font-bold">Sign In</div>

          <Input<RegisterFormData>
            id="login"
            placeholder="Type login..."
            register={register}
            error={errors.login}
          />
          <Input<RegisterFormData>
            id="password"
            type="password"
            placeholder="Type password..."
            register={register}
            error={errors.password}
          />
          <Input<RegisterFormData>
            id="repeatPassword"
            type="password"
            placeholder="Type password again..."
            register={register}
            error={errors.repeatPassword}
          />
          <SubmitButton>Sign In</SubmitButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <p className="text-center text-lg">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-500 underline-offset-4 hover:underline"
            >
              Log In.
            </Link>
          </p>
        </section>
      </form>
    </>
  );
};

export default Register;
