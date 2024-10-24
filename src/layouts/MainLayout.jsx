import { Outlet } from "react-router-dom";
import Footer from "../components/Footer"
import SideBar from "../components/SideBar";

function MainLayout() {
  return (
    <>
    <main className="w-full h-screen bg-mainBgColor flex">
      <div className="w-[15vw] h-full">
        <SideBar />
      </div>
      <div className="w-[85vw] h-full">
        <Outlet />
      </div>
    </main>
    <Footer />
    </>
  )
}

export default MainLayout
