"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const validationSchema = yup.object({
  email: yup.string().required("Email is required").email(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Must have at least 6 characters")
    .max(12, "Could not exceed 12 characters"),
});

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const handleFormSubmit = (data: { email: string; password: string }) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    }).then((res) => {
      if (res?.error) {
        toast.error(`${res.error}`);
      } else {
        //console.log(res);
        toast.success("You are Logged In");
        router.push("/");
      }
    });
  };

  return (
    <div className="flex justify-center max-w-7xl">
      <form
        className="mt-20 form-control w-full max-w-xl gap-y-2"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* email */}
        <label className="label -mb-3">
          <span className="label-text">Email Address</span>
        </label>
        <input
          type="email"
          placeholder="email"
          className={`input input-bordered w-full ${
            errors["email"] && "input-error"
          }`}
          {...register("email")}
        />
        {errors["email"] && (
          <p className="text-red-300 text-sm">{errors["email"].message}</p>
        )}

        {/* password */}
        <label className="label -mb-3">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="password"
          className={`input input-bordered w-full ${
            errors["password"] && "input-error"
          }`}
          {...register("password")}
        />
        {errors["password"] && (
          <p className="text-red-300 text-sm">{errors["password"].message}</p>
        )}

        {/* submit button */}
        <button className="btn btn-primary mt-5 w-fit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
