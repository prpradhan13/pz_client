/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loaders from "../components/loaders/Loaders";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkAuth = async () => {
      if(!user){
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user/auth-check`,
            {
              withCredentials: true,
            }
          );
  
          // console.log(data);
          if (data.success) {
            setUser(data.data);
          } else {
            setUser(null);
            navigate("/register")
          }
  
        } catch (error) {
          console.log(error);
          setUser(null);
          navigate("/register");
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="w-full"> <Loaders /> </div>; // Show loading while checking auth status
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
