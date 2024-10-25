import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

function MainLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  // This effect will run whenever the sidebar is opened/closed
  useEffect(() => {
    if (isSideBarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSideBarOpen]);

  return (
    <>
      <main className="w-full h-screen bg-mainBgColor flex relative">
        <button
          type="button"
          onClick={() => setIsSideBarOpen((prev) => !prev)}
          className={`${
            isSideBarOpen
              ? "hidden"
              : "text-primaryTextColor absolute top-3 left-3 lg:hidden"
          }`}
        >
          <RxHamburgerMenu fontSize={"1.5rem"} />
        </button>
        <div
          className={`${
            isSideBarOpen
              ? "flex w-full absolute bg-black bg-opacity-60 z-50"
              : "hidden"
          } lg:block h-full`}
        >
          <button
            type="button"
            onClick={() => setIsSideBarOpen((prev) => !prev)}
            className={`${
              isSideBarOpen ? "text-primaryTextColor" : "lg:hidden"
            } bg-cardBackground p-1 absolute left-[20vw] `}
          >
            <IoMdClose fontSize={"1.5rem"} />
          </button>

          <SideBar isSideBarOpen={isSideBarOpen} />
        </div>
        <div className="w-full lg:w-[85vw] h-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
