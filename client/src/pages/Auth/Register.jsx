import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Input";
import schema from "../../../../validation/user/register.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });
  const [serverError, setServerError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username: data.username,
        fullname: data.fullname,
        password: data.password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message)
        setServerError(error.response.data.message);
      else setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center mt-10 md:mt-0">
          <h3 className="text-2xl font-semibold text-black">
            Create an Account
          </h3>
          <p className="text-sm text-base mt-1.25 mb-6">
            Join us today by entering your details below
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              {...register("username")}
              label="Username"
              placeholder="Username"
            />
            <div className="text-error text-xs mb-2 px-1">
              {errors.username && <p>{errors.username.message}</p>}
            </div>
            <Input
              type="text"
              {...register("fullname")}
              label="Full Name"
              placeholder="Full Name"
            />
            <div className="text-error text-xs mb-2 px-1">
              {errors.fullname && <p>{errors.fullname.message}</p>}
            </div>
            <Input
              type="password"
              {...register("password")}
              label="Password"
              placeholder="Password"
            />
            <div className="text-error text-xs mb-4 px-1">
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className=" text-error py-3 text-sm">{serverError}</div>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={!isValid ? "btn-disabled" : "btn-primary"}
            >
              SIGN UP
            </button>
            <p className="text-[13px] text-slate-800 mt-3">
              You already have an account?{" "}
              <Link
                className="font-semibold text-primary-light hover:text-primary-dark "
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default Register;
