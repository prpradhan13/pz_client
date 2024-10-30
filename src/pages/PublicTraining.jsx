import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTrainingData, getPublicTrainingData } from "../API/trainingAPI";
import Loaders from "../components/loaders/Loaders";
import { useState } from "react";
import {
  MdDeleteOutline,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import dayjs from "dayjs";
import TrainingDetails from "../components/TrainingDetails";
import { useAuth } from "../context/AuthContext";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function PublicTraining() {
  const [trainingDetailsOpen, setTrainingDetailsOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedTrainingToDelete, setSelectedTrainingToDelete] = useState(false);
    
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
    
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicTraining", currentPage, limit],
    queryFn: () => getPublicTrainingData(currentPage, limit),
    keepPreviousData: true,
  });

  // Destructure trainingData and total from the response
  const { trainingData = [], total = 0 } = data || {
    trainingData: [],
    total: 0,
  };

  const clickOnTrainingData = (trainData) => {
    setSelectedTraining(trainData);
    setTrainingDetailsOpen(true);
  };

  const dateOfTrainingCreate = dayjs(data?.trainingData?.createdAt).format(
    "DD MMMM YYYY"
  );

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clickOnDeleteTraining = (e, trainingId) => {
    e.stopPropagation();
    setSelectedTrainingToDelete(trainingId);
  };

  const deleteMutation = useMutation({
    mutationFn: (trainingId) => deleteTrainingData(trainingId),
    onSuccess: (data, trainingId) => {
      queryClient.setQueryData(["publicTraining", currentPage, limit], (oldData) => {
        if (!oldData) return oldData;
        const updatedTraining = oldData.trainingData.filter(
          (item) => item._id !== trainingId
        );

        return {
          ...oldData,
          trainingData: updatedTraining,
        };
      });
    },
  });

  const isDeleting = deleteMutation.isLoading;

  const handleTrainingDelete = (trainingId) => {
    deleteMutation.mutate(trainingId);
    setSelectedTrainingToDelete(null);
    toast.success("Training deleted successfully");
  };

  const handleWeeklyPlan = () => {
    navigate('/weeklyplan')
  }

  if (isLoading) {
    return (
      <div>
        <Loaders />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="w-full font-montserrat flex flex-col md:flex-row flex-wrap p-10 gap-4">
      {!trainingDetailsOpen ? (
        <div className="">
          <h1 className="text-center text-primaryTextColor font-semibold text-xl">
            Training Program
          </h1>

          {/* pagination */}
          <div className="flex justify-center items-center mt-5 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-cardBackground p-1 rounded-lg text-primaryTextColor"
              disabled={currentPage === 1}
            >
              <MdOutlineKeyboardArrowLeft fontSize={"1.1rem"} />
            </button>
            <span className="mx-2 text-primaryTextColor font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-cardBackground p-1 rounded-lg text-primaryTextColor"
              disabled={currentPage === totalPages}
            >
              <MdOutlineKeyboardArrowRight fontSize={"1.1rem"} />
            </button>
          </div>
          <button
              type="button"
              onClick={handleWeeklyPlan}
              className="mt-5 bg-borderColor rounded-md w-[150px] text-primaryTextColor font-semibold p-1"
            >
              Weekly Plans
            </button>
          <div className="grid lg:grid-cols-4 mt-5 gap-4">
            {trainingData.map((training) => (
              <div
                key={training._id}
                onClick={() => clickOnTrainingData(training)}
                className="cardAnim p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer relative overflow-hidden"
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-borderColor capitalize">
                    {training.trainingName}
                  </h3>
                  {user?.isAdmin && (
                    <button
                      onClick={(e) => clickOnDeleteTraining(e, training._id)}
                      className="text-red-500"
                    >
                      <MdDeleteOutline fontSize={"1.5rem"} />
                    </button>
                  )}
                </div>
                <h4 className="font-medium text-secondaryText capitalize">
                  {training.category} Workout
                </h4>
                <p className="capitalize text-secondaryText font-medium">
                  created at: {dateOfTrainingCreate}
                </p>

                {selectedTrainingToDelete === training._id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black bg-opacity-95 w-full h-full absolute top-0 left-0 flex justify-center items-center"
                  >
                    <button
                      type="button"
                      onClick={() => handleTrainingDelete(training._id)}
                      className="bg-cardBackground p-2 rounded-lg text-green-500 font-medium mr-3"
                      disabled={isDeleting}
                    >
                      <IoMdCheckmark fontSize={"1.2rem"} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTrainingToDelete(null)}
                      className="bg-cardBackground p-2 rounded-lg text-red-500 font-medium"
                    >
                      <IoMdClose fontSize={"1.2rem"} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <TrainingDetails
          selectedTraining={selectedTraining}
          setTrainingDetailsOpen={setTrainingDetailsOpen}
        />
      )}
    </section>
  );
}

export default PublicTraining;
