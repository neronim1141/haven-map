import { SubmitButton } from "components/controls/buttons/SubmitButton";
import { Input } from "components/controls/inputs/FormInput";
import { ErrorMessage } from "components/errorMessage";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { useCreateUserMutation } from "graphql/client/graphql";

const schema = yup.object({
  login: yup.string().required(),
  password: yup.string().required().min(3),
  repeatPassword: yup
    .string()
    .required()
    .min(3)
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
type RegisterFormData = yup.InferType<typeof schema>;

const Register = () => {
  const router = useRouter();
  const [mutation] = useCreateUserMutation();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (values: any) => {
    const user = await mutation({
      variables: { login: values.login, password: values.password },
      onError: (e) => {
        setError(e.message);
      },
      onCompleted: () => {
        setError("");
      },
    });
    if (!user.data?.createUser) return;
    const res = await signIn("credentials", {
      redirect: false,
      login: user.data.createUser.name,
      password: values.password,
    });
    if (res?.error) {
    }
    if (res && res.url) {
      router.push(res.url);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex items-center justify-center text-white"
    >
      <section className="flex  p-6 sm:p-0 w-[30rem] flex-col space-y-8">
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
          <Link href="/login">
            <a className="font-medium text-indigo-500 underline-offset-4 hover:underline">
              Log In.
            </a>
          </Link>
        </p>
      </section>
    </form>
  );
};

export default Register;
