import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useContext } from "react";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Input";
import schema from "../../../../validation/user/login.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/UserContext.jsx";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { updateUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        username: data.username,
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
      else setServerError("Something went wrong. Please try again");
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-black">Welcome Back</h3>
          <p className="text-sm text-state-700 mt-1.25 mb-6">
            Please enter your details to log in
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              {...register("username")}
              label="Username"
              placeholder="Username"
            />
            <Input
              type="password"
              {...register("password")}
              label="Password"
              placeholder="Password"
            />

            {serverError && (
              <div className=" text-error py-3 text-sm">{serverError}</div>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={`${!isValid ? "btn-disabled" : "btn-primary"}`}
            >
              LOGIN
            </button>
            <p className="text-[13px] text-slate-800 mt-3">
              Don't have an account?{" "}
              <Link
                className="font-semibold text-primary-light hover:text-primary-dark"
                to="/register"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
