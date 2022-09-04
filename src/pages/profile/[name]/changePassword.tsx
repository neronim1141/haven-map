import React from "react";

import { SubmitButton } from "src/components/controls/buttons/SubmitButton";
import { Input } from "src/components/controls/inputs/FormInput";
import { ErrorMessage } from "src/components/errorMessage";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { Role } from "@prisma/client";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    login: z.string(),
    oldPassword: z.string().min(3),
    password: z.string().min(3),
    repeatPassword: z.string().min(3),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });
type ChangePasswordFormData = z.infer<typeof schema>;

const ChangePassword = () => {
  const router = useRouter();
  const session = useSession();
  const { mutateAsync: updatePassword } = trpc.useMutation(
    "user.changePassword"
  );

  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
  });
  if (session.status === "loading") {
    return <>loading</>;
  }

  if (
    !session.data ||
    (session.data.user.name !== router.query.name &&
      session.data.user.role !== Role.ADMIN)
  ) {
    router.push("/");
    return;
  }
  const onSubmit = async (values: any) => {
    await updatePassword(
      {
        name: values.login,
        oldPassword: values.oldPassword,
        newPassword: values.password,
      },
      {
        onError: (e) => {
          setError(e.message);
        },
        onSuccess: () => {
          setError("");
          signOut({ redirect: false }).then(() => router.push("/login"));
        },
      }
    );
  };
  return (
    <>
      <Head>
        <title>Change Password</title>
      </Head>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex items-center justify-center text-white"
      >
        <section className="flex  p-6 sm:p-0 w-[30rem] flex-col space-y-8">
          <div className="text-center text-4xl font-bold">Change Password</div>

          <Input<ChangePasswordFormData>
            id="login"
            type="hidden"
            value={router.query.name}
            register={register}
            className="hidden"
          />
          <Input<ChangePasswordFormData>
            id="oldPassword"
            type="password"
            placeholder="Type old password..."
            register={register}
            error={errors.oldPassword}
          />
          <Input<ChangePasswordFormData>
            id="password"
            type="password"
            placeholder="Type new password..."
            register={register}
            error={errors.password}
          />
          <Input<ChangePasswordFormData>
            id="repeatPassword"
            type="password"
            placeholder="Type new password again..."
            register={register}
            error={errors.repeatPassword}
          />
          <SubmitButton>Change your password</SubmitButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </section>
      </form>
    </>
  );
};

export default ChangePassword;
