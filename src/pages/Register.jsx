import { useState } from "react";
import Signup from "../components/register/Signup";
import Login from "../components/register/Login";
import {useAuth} from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function Register() {
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);
  const { user } = useAuth(); // Get user status from context

  // Redirect to home page if the user is logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  const clickOnSignupBtn = () => {
    setIsSignupActive(true);
    setIsLoginActive(false);
  };

  const clickOnLoginBtn = () => {
    setIsSignupActive(false);
    setIsLoginActive(true);
  };

  return (
    <section className="h-screen w-full flex justify-center items-center">
      <div className="bg-cardBackground rounded-lg overflow-hidden py-6 px-10 flex flex-col items-center">
        <h1 className="font-pacifico text-borderColor text-3xl font-semibold pb-8">PZ</h1>
        <div className="w-[60vw] lg:w-[20vw] bg-mainBgColor uppercase font-bold text-sm rounded-3xl flex p-1">
          <button
            onClick={clickOnLoginBtn}
            className={`w-1/2 uppercase cursor-pointer px-5 py-3 lg:p-2 rounded-3xl ease-linear duration-150 ${
              isLoginActive
                ? "bg-cardBackground text-borderColor"
                : "text-secondaryText hover:text-borderColor"
            }`}
          >
            Log in
          </button>
          <button
            onClick={clickOnSignupBtn}
            className={`w-1/2 uppercase cursor-pointer px-5 py-3 lg:p-2 rounded-3xl ease-linear duration-150 ${
              isSignupActive
                ? "bg-cardBackground text-borderColor"
                : "text-secondaryText hover:text-borderColor"
            }`}
          >
            sign up
          </button>
        </div>

        {isSignupActive ? (
          <Signup
            setIsSignupActive={setIsSignupActive}
            setIsLoginActive={setIsLoginActive}
          />
        ) : (
          <Login />
        )}
      </div>
    </section>
  );
}

export default Register;
