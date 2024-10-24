import { Outlet } from "react-router-dom";
import Footer from "../components/Footer"
import SideBar from "../components/SideBar";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";

function MainLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <>
    <main className="w-full h-screen bg-mainBgColor flex relative">
      <button
        type="button"
        onClick={() => setIsSideBarOpen((prev) => !prev)}
        className={`${isSideBarOpen ? 'hidden' : 'text-primaryTextColor absolute top-5 left-3 lg:hidden'}`}
      >
        <RxHamburgerMenu fontSize={'1.5rem'}/>
      </button>
      <div className={`${isSideBarOpen ? 'block w-full absolute bg-black bg-opacity-90 z-50' : 'hidden'} lg:block h-full`}>
        <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />
      </div>
      <div className="w-full lg:w-[85vw] h-full">
        <Outlet />
      </div>
    </main>
    <Footer />
    </>
  )
}

export default MainLayout
