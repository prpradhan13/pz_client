import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { MainButton } from "../buttons/Buttons";
import { IoEyeOutline, IoEyeOffOutline  } from "react-icons/io5";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({
      ...preValue,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, formData, {
        withCredentials: true
      });

      // console.log(data);
      
      if(data.success) {
        setUser(data.user);
        toast.success(data.message);
        navigate("/")
      }
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pt-6">
      <form className="flex flex-col items-center gap-6" onSubmit={handleLogin}>
        <div className="w-full">
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold text-base lg:text-lg text-primaryTextColor">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 outline-none bg-mainBgColor focus:outline-borderColor rounded-md text-base text-primaryTextColor"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="flex flex-col mt-[1rem]">
            <label htmlFor="password" className="font-semibold text-base lg:text-lg text-primaryTextColor">
              Password:
            </label>
            <div className="flex justify-between items-center relative">
              <input
                type={`${!isPasswordShow ? 'password' : 'text'}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-mainBgColor outline-none focus:outline-borderColor rounded-md  text-base text-primaryTextColor"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordShow((prev) => !prev)}
                className="bg-cardBackground p-2 rounded-md text-primaryTextColor absolute right-1 cursor-pointer hover:text-borderColor"
              >
                {isPasswordShow ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </button>
            </div>
          </div>
        </div>

        <MainButton type="submit" isLoading={isLoading} btnName={"log in"} />
      </form>
    </div>
  );
}

export default Login;
