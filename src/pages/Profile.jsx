import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SecondaryButton } from "../components/buttons/Buttons";
import { MdOutlineChangeCircle, MdDeleteOutline  } from "react-icons/md";
import DeleteConfirmation from "../components/DeleteConfirmation";
import ChangePassword from "../components/forms/ChangePassword";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Profile() {
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  // Function to get initials from the full name
  const getInitials = (fullname) => {
    if (!fullname) return "";
    const nameParts = fullname.split(" ");
    return nameParts.length === 1
      ? fullname.slice(0, 2).toUpperCase()
      : nameParts
            .map((name) => name[0])
            .join("")
            .toUpperCase();
  };

  const userNameInitials = useMemo(() => getInitials(user?.fullname), [user?.fullname]);

  const clickOnDelete = () => {
    setIsDeleteCardOpen(true);
  }

  const deleteUser = async () => {
    setDeletingAccount(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/user/user-delete`, {withCredentials: true});

      setUser(null);
      navigate("/register");
      toast.success("Your account successfully deleted");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleteCardOpen(false);
    }
  };

  const clickOnChangePassword = () => {
    setChangePasswordOpen(true);
  }

  return (
    <>
        <div className="pt-20 font-montserrat flex justify-center">
            <div className="flex flex-col items-center bg-cardBackground rounded-lg p-10">
                <div className="bg-mainBgColor text-primaryTextColor rounded-full w-[80px] h-[80px] flex justify-center items-center font-bold text-lg">
                    {userNameInitials ? userNameInitials : "U"}
                </div>
                <div className="text-center my-4">
                    <h1 className="capitalize text-secondaryText text-xl font-medium">fullname: {user?.fullname}</h1>
                    <h1 className="capitalize text-secondaryText text-xl font-medium">username: {user?.username}</h1>
                    <h1 className="capitalize text-secondaryText text-xl font-medium">email: {user?.email}</h1>
                </div>
                <div className="flex flex-col gap-3">
                    <SecondaryButton btnName={"Change Password"} onClick={clickOnChangePassword} btnIcon={<MdOutlineChangeCircle />} />
                    <SecondaryButton btnName={"Delete Account"} onClick={clickOnDelete} btnIcon={<MdDeleteOutline />} btnColor="text-red-500" />
                </div>
            </div>
        </div>

        {isDeleteCardOpen && (
            <div 
                onClick={() => setIsDeleteCardOpen(false)}
                className="w-full h-screen bg-black absolute top-0 left-0 bg-opacity-80"
            >
                <DeleteConfirmation setIsDeleteCardOpen={setIsDeleteCardOpen} onClick={deleteUser} loading={deletingAccount} />
            </div>
        )}

        {isChangePasswordOpen && (
            <div
                onClick={() => setChangePasswordOpen(false)}
                className="w-full h-screen bg-black absolute top-0 left-0 bg-opacity-80"
            >
                <ChangePassword setChangePasswordOpen={setChangePasswordOpen} />
            </div>
        )}
    </>
  )
}

export default Profile;
