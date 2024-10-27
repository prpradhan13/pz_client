/* eslint-disable react/prop-types */
import { SecondaryButton } from "./buttons/Buttons";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SiExpensify } from "react-icons/si";
import { IoFitness } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaRegCircleUser } from "react-icons/fa6";
import { useState } from "react";
import { LuListTodo } from "react-icons/lu";

function SideBar({ setIsSideBarOpen }) {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const clickExpense = async () => {
    navigate("/user-expense");
    setIsSideBarOpen(false)
  };

  const clickTraining = () => {
    navigate("/user-training")
    setIsSideBarOpen(false)
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfull");
      navigate("/register");
      setIsSideBarOpen(false)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLogoutLoading(false)
    }
  };

  const clickProfile = () => {
    navigate("/user-profile");
    setIsSideBarOpen(false)
  }

  const clickTodo = () => {
    navigate("/user-todo");
    setIsSideBarOpen(false)
  }

  useGSAP(() => {
    gsap.from(".logoAnim", {
      x: -50,
      duration: 0.5,
      opacity: 0,
      stagger: 0.15,
    })
  });

  return (
    <div className="w-full flex flex-col items-center md:block bg-cardBackground h-full p-6 font-montserrat">
      
      <div className="flex justify-between pb-2">
        <h1 className="logoAnim text-borderColor font-pacifico font-extrabold text-2xl">PZ</h1>
      </div>
      <div className="w-[10vw] flex flex-col justify-between h-full md:h-screen">
        <div className="flex flex-col gap-2 pt-4">
          <div className="logoAnim">
            <SecondaryButton btnName={"Expenses"} onClick={clickExpense} btnIcon={<SiExpensify />}/>
          </div>
          <div className="logoAnim">
            <SecondaryButton btnName={"Training"} onClick={clickTraining} btnIcon={<IoFitness />}/>
          </div>
          <div className="logoAnim">
            <SecondaryButton btnName={"Todos"} onClick={clickTodo} btnIcon={<LuListTodo />} />
          </div>
          <div className="logoAnim">
            <SecondaryButton btnName={"Profile"} onClick={clickProfile} btnIcon={<FaRegCircleUser />} />
          </div>
          <div className="hidden md:block logoAnim md:mt-2">
            <SecondaryButton btnName={"Logout"} onClick={handleLogout} btnIcon={<IoLogOutOutline />} btnColor="text-red-500" isLoading={isLogoutLoading} />
          </div>
        </div>
        <div className="logoAnim md:hidden md:mt-2">
          <SecondaryButton btnName={"Logout"} onClick={handleLogout} btnIcon={<IoLogOutOutline />} btnColor="text-red-500" isLoading={isLogoutLoading} />
        </div>
      </div>

    </div>
  );
}

export default SideBar;
