/* eslint-disable react/prop-types */
import BtnLoading from "../loaders/BtnLoading";
import { FaPlus } from "react-icons/fa6";

const emptyOnClick = () => {};

export const MainButton = ({ type = "button", btnName, isLoading = false }) => {
  return (
    <button
      type={type}
      className={`${
        isLoading ? "bg-[#000000ea] cursor-not-allowed" : "bg-mainBgColor"
      } text-primaryTextColor hover:text-borderColor ease-linear duration-150 font-semibold w-full h-[48px] py-3 rounded-3xl uppercase flex justify-center items-center`}
      disabled={isLoading}
    >
      {isLoading ? <BtnLoading /> : btnName}
    </button>
  );
};

export const SecondaryButton = ({
  type = "button",
  btnName,
  onClick = emptyOnClick,
  btnIcon = "",
  isLoading = false,
  btnColor = "text-primaryTextColor",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btnAnim ${isLoading ? "bg-[#000000ea] cursor-not-allowed justify-center" : "bg-mainBgColor"} ${btnColor} w-full flex items-center gap-2 rounded-lg font-medium tracking-wide p-3 leading-6 ${
        btnName === "Logout" ? "hover:text-red-500" : "hover:text-borderColor"
      } ease-linear duration-150 capitalize`}
      disabled={isLoading}
    >
      {isLoading ? (<BtnLoading />) : (
        <>
        <span className="text-[1.1rem]"> {btnIcon} </span>
        {btnName}
      </>)}
    </button>
  );
};

export const ThirdButton = ({
  btnName = "",
  type = "button",
  onClick = emptyOnClick,
  textSize = "text-lg",
  textColor = "text-primaryTextColor",
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${isLoading ? "bg-[#000000ea] cursor-not-allowed" : "bg-borderColor"} ${textSize} w-full capitalize ${textColor} flex justify-center items-center gap-2 font-semibold rounded-lg px-5 py-2 shadow-[1px_3px_35px_-9px_rgba(255,138,101,1)]`}
      disabled={isLoading}
    >
      {isLoading ? (<BtnLoading />) : (
        <>
          <FaPlus />
          {btnName}
        </>
      )}
    </button>
  );
};
