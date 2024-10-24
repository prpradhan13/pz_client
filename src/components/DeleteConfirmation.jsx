/* eslint-disable react/prop-types */
import { SecondaryButton } from "./buttons/Buttons";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

function DeleteConfirmation({ setIsDeleteCardOpen, onClick, loading=false }) {

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[400px] bg-cardBackground h-[200px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden font-montserrat"
    >
      <div className="w-full h-full flex flex-col justify-center items-center p-5">
        <p className="text-primaryTextColor font-semibold text-xl text-center">
          Are you sure!! you want to delete your account.
        </p>
        <div className="flex gap-5 mt-5">
          <SecondaryButton
            btnName={"Yes"}
            onClick={onClick}
            btnIcon={<IoMdCheckmark fontSize={"1.2rem"} />}
            btnColor="text-red-500"
            isLoading={loading}
          />
          <SecondaryButton
            btnName={"No"}
            onClick={() => setIsDeleteCardOpen(false)}
            btnIcon={<IoMdClose fontSize={"1.2rem"} />}
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
