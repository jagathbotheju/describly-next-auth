"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().required("Email is required").email(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Must have at least 6 characters")
    .max(12, "Could not exceed 12 characters"),
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const handleFormSubmit = (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: String;
  }) => {
    const user = {
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      password: data.password,
    };

    if (user) {
      console.log(user);
      axios
        .post("/api/register", user)
        .then((res) => {
          console.log(res.data);
          toast.success("User registered successfully");
          reset();
        })
        .catch(({ response }) => {
          toast.error(response.data);
          console.log(response.data);
        });
    }
  };

  return (
    <div className="flex justify-center max-w-7xl">
      <form
        className="mt-20 form-control w-full max-w-xl gap-y-2"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* first name */}
        <label className="label -mb-3">
          <span className="label-text">First Name</span>
        </label>
        <input
          type="text"
          placeholder="first name"
          className={`input input-bordered w-full ${
            errors["first_name"] && "input-error"
          }`}
          {...register("first_name")}
        />
        {errors["first_name"] && (
          <p className="text-red-300 text-sm">{errors["first_name"].message}</p>
        )}

        {/* last name */}
        <label className="label -mb-3">
          <span className="label-text">Last Name</span>
        </label>
        <input
          type="text"
          placeholder="last name"
          className={`input input-bordered w-full ${
            errors["last_name"] && "input-error"
          }`}
          {...register("last_name")}
        />
        {errors["last_name"] && (
          <p className="text-red-300 text-sm">{errors["last_name"].message}</p>
        )}

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
        <button className="btn btn-primary mt-5 w-fit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
