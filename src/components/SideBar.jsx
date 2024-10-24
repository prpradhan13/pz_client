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
import { IoMdClose } from "react-icons/io";

function SideBar({ isSideBarOpen, setIsSideBarOpen }) {
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
    }
  };

  const clickProfile = () => {
    navigate("/user-profile");
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
    <div className="w-[45vw] md:w-[15vw] bg-cardBackground h-full p-5 font-montserrat fixed top-0 left-0 md:relative">
      <div className="flex justify-between pb-2">
        <h1 className="logoAnim text-borderColor font-pacifico font-extrabold text-2xl">PZ</h1>
        <button
          type="button"
          onClick={() => setIsSideBarOpen((prev) => !prev)}
          className={`${isSideBarOpen ? 'text-primaryTextColor' : 'lg:hidden'} `}
        >
          <IoMdClose fontSize={'1.8rem'}/>
        </button>
      </div>
      <div className="w-full min-h-[85%] flex flex-col gap-2 pt-4">
        <div className="logoAnim">
          <SecondaryButton btnName={"Expenses"} onClick={clickExpense} btnIcon={<SiExpensify />}/>
        </div>
        <div className="logoAnim">
          <SecondaryButton btnName={"Training"} onClick={clickTraining} btnIcon={<IoFitness />}/>
        </div>
        <div className="logoAnim">
          <SecondaryButton btnName={"Profile"} onClick={clickProfile} btnIcon={<FaRegCircleUser />} />
        </div>
      </div>

      <div className="logoAnim text-primaryTextColor w-full">
        <SecondaryButton btnName={"Logout"} onClick={handleLogout} btnIcon={<IoLogOutOutline />} btnColor="text-red-500" />
      </div>
    </div>
  );
}

export default SideBar;
