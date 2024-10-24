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

function SideBar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const clickExpense = async () => {
    navigate("/user-expense");
  };

  const clickTraining = () => {
    navigate("/user-training")
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
    } catch (error) {
      console.log(error);
    }
  };

  const clickProfile = () => {
    navigate("/user-profile");
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
    <div className="w-full bg-cardBackground h-full p-5 font-montserrat">
      <div className="logoAnim text-borderColor font-pacifico font-extrabold text-2xl pb-2">
        PZ
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
        <SecondaryButton btnName={"Logout"} onClick={handleLogout} btnIcon={<IoLogOutOutline />}/>
      </div>
    </div>
  );
}

export default SideBar;
