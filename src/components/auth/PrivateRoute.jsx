import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Loaders from "../loaders/Loaders";

function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-full"> <Loaders /> </div>; // Show loading state while checking authentication
  }

  // If user is logged in, return the Outlet for the route
  if (user) {
    return <Outlet />;
  }

  // If not logged in, redirect to the register page
  return <Navigate to="/register" />;
}

export default PrivateRoute;
