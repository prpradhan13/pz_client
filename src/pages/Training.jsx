import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTrainingData, getTraining } from "../API/trainingAPI";
import Loaders from "../components/loaders/Loaders";
import { ThirdButton } from "../components/buttons/Buttons";
import dayjs from "dayjs";
import { useState } from "react";
import TrainingDetails from "../components/TrainingDetails";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TrainingForm from "../components/forms/TrainingForm";

function Training() {
  const [trainingDetailsOpen, setTrainingDetailsOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedTrainingToDelete, setSelectedTrainingToDelete] = useState(false);
  const [isTrainingFormOpen, setIsTrainingFormOpen] = useState(false);

  const queryClient = useQueryClient();

  useGSAP(() => {
    gsap.from(".cardAnim", {
      scale: 0.5,
      duration: 0.5,
      opacity: 0,
      stagger: 0.15,
    })
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["training"],
    queryFn: getTraining,
  });

  const dateOfTrainingCreate = dayjs(data?.trainingData?.createdAt).format(
    "DD MMMM YYYY"
  );

  const clickOnTrainingData = (trainData) => {
    setSelectedTraining(trainData);
    setTrainingDetailsOpen(true);
  };

  const clickOnDeleteTraining = (e, trainingId) => {
    e.stopPropagation();
    setSelectedTrainingToDelete(trainingId);
  };

  const deleteMutation = useMutation({
    mutationFn: (trainingId) => deleteTrainingData(trainingId),
    onSuccess: (data, trainingId) => {
      queryClient.setQueryData(["training"], (oldData) => {
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
 
  if (
    !data ||
    !Array.isArray(data?.trainingData) ||
    data?.trainingData?.length === 0
  ) {
    return (
      <div className="w-full h-full flex justify-center items-center p-10">
        <div className="w-full md:w-[30vw] h-[30vh] bg-cardBackground rounded-lg flex flex-col justify-center items-center gap-3">
          <p className="text-primaryTextColor text-2xl font-semibold capitalize">
            You have no Training Plans
          </p>
          <div
            onClick={() => setIsTrainingFormOpen(true)}
            className=""
          >
            <ThirdButton btnName={"create one"} />
          </div>
          {isTrainingFormOpen && (
            <div
              onClick={() => setIsTrainingFormOpen(false)}
              className="w-full h-screen bg-black absolute top-0 left-0 bg-opacity-80"
            >
              <TrainingForm setIsTrainingFormOpen={setIsTrainingFormOpen}/>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full font-montserrat">
        {!trainingDetailsOpen ? (
          <div className="pt-10">
            <h1 className="text-center text-primaryTextColor font-semibold text-xl">
              Your Training Program
            </h1>
            <div className="grid lg:grid-cols-4 p-10 gap-4">
              {data.trainingData.map((trainData) => (
                <div
                  key={trainData._id}
                  onClick={() => clickOnTrainingData(trainData)}
                  className="cardAnim p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold text-borderColor capitalize">
                      {trainData.trainingName}
                    </h3>
                    <button
                      onClick={(e) => clickOnDeleteTraining(e, trainData._id)}
                      className="text-red-500"
                    >
                      <MdDeleteOutline fontSize={"1.5rem"} />
                    </button>
                  </div>
                  <h4 className="font-medium text-secondaryText capitalize">
                    {trainData.category} Workout
                  </h4>
                  <p className="capitalize text-secondaryText font-medium">
                    created at: {dateOfTrainingCreate}
                  </p>

                  {selectedTrainingToDelete === trainData._id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-black bg-opacity-95 w-full h-full absolute top-0 left-0 flex justify-center items-center"
                    >
                      <button
                        type="button"
                        onClick={() => handleTrainingDelete(trainData._id)}
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
      </div>
    </>
  );
}

export default Training;
