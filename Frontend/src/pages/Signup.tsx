import { useForm, SubmitHandler } from "react-hook-form";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
type Inputs = {
  username: string;
  password: string;
};

export default function SignUp() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const { handleSubmit, register, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("data", data);
    setApiError(null);
    try {
      await axios.post(`${BACKEND_URL}/signup`, data);
      toast.success("Sign up successful. Please sign in.");
      navigate("/signin");
    } catch (error: any) {
      console.log("error", error);
      toast.error("Sign up failed");
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message); 
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Sign Up</h1>

        {apiError && ( 
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {apiError}
          </div>
        )}

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username" className="text-sm text-gray-600 mb-2">Username</label>
          <input
            className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <span className="text-red-500 text-sm mb-2">{errors.username.message}</span>}

          <label htmlFor="password" className="text-sm text-gray-600 mb-2">Password</label>
          <input
            className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <span className="text-red-500 text-sm mb-2">{errors.password.message}</span>}

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
