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
      <main className="w-full bg-mainBgColor min-h-screen flex relative">
        <button
          type="button"
          onClick={() => setIsSideBarOpen(true)}
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
            onClick={() => setIsSideBarOpen(false)}
            className={`${
              isSideBarOpen ? "text-primaryTextColor" : "lg:hidden"
            } bg-cardBackground p-1 absolute left-[20vw] `}
          >
            <IoMdClose fontSize={"1.5rem"} />
          </button>

          <div className="w-[20vw] h-full md:w-[15vw] fixed top-0 left-0 z-40">
            <SideBar
              isSideBarOpen={isSideBarOpen}
              setIsSideBarOpen={setIsSideBarOpen}
            />
          </div>
        </div>
        <div className="w-full md:w-[83vw] min-h-full md:relative md:left-[15vw]">
          <Outlet />
        </div>
      </main>

      <footer className="w-full bg-mainBgColor">
        <Footer />
      </footer>
    </>
  );
}

export default MainLayout;
