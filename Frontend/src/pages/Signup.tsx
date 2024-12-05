import { useForm, SubmitHandler } from "react-hook-form";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Inputs = {
  username: string;
  password: string;
};
export default  function SignUp() {
  const navigate=useNavigate();
  const { handleSubmit, register, watch, formState: { errors } } = useForm<Inputs>();
  const  onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("data",data);
    try {
      await axios.post(`${BACKEND_URL}/signup`,data);
      navigate("/signin")
    } catch (error) {
      console.log("error",error)
    }
  }
 

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Sign Up</h1>
        
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
