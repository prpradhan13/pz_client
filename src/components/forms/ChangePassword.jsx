import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MainButton } from "../buttons/Buttons";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

function ChangePassword({ setChangePasswordOpen }) {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/user/user-password`, passwordData, { withCredentials: true });

        setUser(null);
        navigate("/register");
        toast.success("Password change successfully")
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[350px] bg-cardBackground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden font-montserrat"
    >
        <div onClick={() => setChangePasswordOpen(prev => !prev)} className="absolute top-1 right-1 bg-mainBgColor rounded-lg p-1 hover:text-borderColor ease-linear duration-150 cursor-pointer">
            <IoMdClose fontSize={"1.5rem"} />
        </div>
      <form className="w-full h-full flex flex-col gap-2 px-5 py-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="oldPassword"
            className="text-lg font-medium text-primaryTextColor"
          >
            Old Password:
          </label>
            <input
              type="text"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handleChange}
              className="w-full p-2 bg-mainBgColor outline-none focus:outline-borderColor rounded-md  text-base text-primaryTextColor"
              required
            />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="newPassword"
            className="text-lg font-medium text-primaryTextColor"
          >
            New Password:
          </label>
          <div className="flex justify-between items-center relative">
            <input
              type={`${!isPasswordShow ? "password" : "text"}`}
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              className="w-full p-2 bg-mainBgColor outline-none focus:outline-borderColor rounded-md  text-base text-primaryTextColor"
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

        <div className="mt-4 flex flex-col gap-3">
          <MainButton type="submit" btnName={"Change"} />
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
