/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { MainButton } from "../buttons/Buttons";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function Signup({ setIsSignupActive, setIsLoginActive }) {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/signup`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        // Switch to the login form after successful sign-up
        setIsSignupActive(false);
        setIsLoginActive(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pt-6">
      <form
        className="flex flex-col items-center gap-8"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="fullname"
              className="font-semibold text-base lg:text-lg text-primaryTextColor"
            >
              Full Name:
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="p-2 outline-none bg-mainBgColor focus:outline-borderColor rounded-md text-base text-primaryTextColor"
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="font-semibold text-base lg:text-lg text-primaryTextColor"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 outline-none bg-mainBgColor focus:outline-borderColor rounded-md text-base text-primaryTextColor"
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="font-semibold text-base lg:text-lg text-primaryTextColor"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 outline-none bg-mainBgColor focus:outline-borderColor rounded-md text-base text-primaryTextColor"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="font-semibold text-base lg:text-lg text-primaryTextColor"
            >
              Password:
            </label>
            <div className="flex justify-between items-center relative">
              <input
                type={`${!isPasswordShow ? "password" : "text"}`}
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
                {isPasswordShow ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>
        </div>

        <MainButton type="submit" isLoading={isLoading} btnName={"sign up"} />
      </form>
    </div>
  );
}

export default Signup;
