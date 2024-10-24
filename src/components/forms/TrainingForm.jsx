/* eslint-disable react/prop-types */
import { useState } from "react";
import { MainButton, ThirdButton } from "../buttons/Buttons";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { createTraining } from "../../API/trainingAPI";

const categoryOptions = [
  "high intensity",
  "cardio",
  "cutting",
  "gaining",
  "abdominal(abs)",
  "beginner",
  "intermediate",
  "advance",
];

function TrainingForm({ setIsTrainingFormOpen }) {
  const [trainingFormData, setTrainingFormData] = useState({
    trainingName: "",
    category: "",
    trainingPlan: [],
  });

  const [currentExercise, setCurrentExercise] = useState({
    exerciseName: "",
    sets: [{ repetitions: 0 }],
    restTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainingFormData({ ...trainingFormData, [name]: value });
  };

  // Handle changes for each exercise and its sets
  const handleExerciseChange = (field, value) => {
    setCurrentExercise({ ...currentExercise, [field]: value });
  };

  // Handle changes in sets (repetitions) within each exercise
  const handleSetChange = (setIndex, value) => {
    const updatedSets = [...currentExercise.sets];
    updatedSets[setIndex].repetitions = value;
    setCurrentExercise({ ...currentExercise, sets: updatedSets });
  };

  // Add a new set to an existing exercise
  const addSet = () => {
    setCurrentExercise((prev) => ({
      ...prev,
      sets: [...prev.sets, { repetitions: 0 }],
    }));
  };

  const removeSet = (setIndex) => {
    const updatedSets = currentExercise.sets.filter(
      (_, index) => index !== setIndex
    );
    setCurrentExercise({ ...currentExercise, sets: updatedSets });
  };

  // Add a new exercise to the training plan
  const addExercise = () => {
    setTrainingFormData((prev) => ({
      ...prev,
      trainingPlan: [...prev.trainingPlan, currentExercise],
    }));
    // Reset the current exercise fields after adding
    setCurrentExercise({
      exerciseName: "",
      sets: [{ repetitions: 0 }],
      restTime: "",
    });
  };

  // Remove an exercise from the plan
  const removeExercise = (exerciseIndex) => {
    const updatedPlan = trainingFormData.trainingPlan.filter(
      (_, i) => i !== exerciseIndex
    );
    setTrainingFormData({ ...trainingFormData, trainingPlan: updatedPlan });
  };

  const createMutation = useMutation({
    mutationFn: () => createTraining(trainingFormData),
    onSuccess: () => {
      toast.success("Training Plan created successfully");
      setTrainingFormData({
        trainingName: "",
        category: "",
        trainingPlan: [],
      });
      setIsTrainingFormOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create expense: ${error.message}`);
    },
  });

  const isCreateLoading = createMutation.isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(trainingFormData);
    if (trainingFormData.trainingPlan.length > 0) {
      createMutation.mutate();
    } else {
      // Show an alert or error message if there's nothing to submit
      toast.error("Please add at least one plan before submitting.");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[400px] bg-cardBackground min-h-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden font-montserrat"
    >
      <div className="w-full h-full p-5">
        <button
          type="button"
          onClick={() => setIsTrainingFormOpen(false)}
          className="text-red-500 absolute right-2 top-2"
        >
          <IoClose fontSize={'1.5rem'} />
        </button>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {/* Training Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="trainingName"
              className="text-lg font-medium text-primaryTextColor"
            >
              Training Name:
            </label>
            <input
              type="text"
              id="trainingName"
              name="trainingName"
              value={trainingFormData.trainingName}
              onChange={handleChange}
              placeholder="Enter Training name"
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="category"
              className="text-lg font-medium text-primaryTextColor"
            >
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={trainingFormData.category}
              onChange={handleChange}
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cateOp, idx) => (
                <option key={idx} value={cateOp}>
                  {cateOp}
                </option>
              ))}
            </select>
          </div>

          {/* Current Exercise Fields */}
          <div className="">
            <h2 className="text-lg font-medium text-primaryTextColor">Create Plan</h2>
            <div className="bg-mainBgColor p-2 rounded-lg">
              <div className="flex flex-col gap-1">
                {/* Exercise Name */}
                <input
                  type="text"
                  placeholder={`Exercise Name`}
                  value={currentExercise.exerciseName}
                  onChange={(e) =>
                    handleExerciseChange("exerciseName", e.target.value)
                  }
                  className="rounded-lg p-2 text-secondaryText bg-cardBackground outline-none focus:outline-borderColor"
                  //   required
                />

                {/* Dynamic Sets */}
                <div className="flex gap-2 flex-wrap my-2">
                  {currentExercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-2">
                      <label className="text-primaryTextColor">
                        Set {setIndex + 1}:
                      </label>
                      <input
                        type="number"
                        placeholder={`Repetitions`}
                        value={set.repetitions}
                        onChange={(e) =>
                          handleSetChange(setIndex, e.target.value)
                        }
                        className="rounded-lg w-[50px] p-2 text-secondaryText bg-cardBackground outline-none focus:outline-borderColor"
                        // required
                      />

                      {currentExercise.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSet(setIndex)}
                          className="text-red-500 bg-cardBackground p-2 rounded-lg flex justify-center items-center"
                        >
                          <IoClose fontSize={"1.2rem"} />
                        </button>
                      )}

                      {setIndex === currentExercise.sets.length - 1 && (
                        <button
                          type="button"
                          onClick={() => addSet()}
                          className="text-primaryTextColor bg-cardBackground rounded-lg p-2"
                        >
                          <FaPlus fontSize={"1.3rem"} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Rest Time */}
                <input
                  type="number"
                  placeholder="Rest Time (in seconds)"
                  value={currentExercise.restTime}
                  onChange={(e) =>
                    handleExerciseChange("restTime", e.target.value)
                  }
                  className="rounded-lg p-2 text-secondaryText bg-cardBackground outline-none focus:outline-borderColor"
                  //   required
                />
              </div>
            </div>
          </div>

          {/* List of added expenses displayed as cards */}
          {trainingFormData.trainingPlan.length > 0 && (
            <ul className="my-2 flex gap-1 flex-wrap bg-mainBgColor p-1 rounded-lg">
              {trainingFormData.trainingPlan // Filter out empty exercises
                .map((plan, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 bg-cardBackground text-primaryTextColor rounded-lg flex justify-between gap-3 items-center capitalize font-medium"
                  >
                    <h2>
                      {plan.exerciseName.length > 5
                        ? `${plan.exerciseName.slice(0, 5)}...`
                        : plan.exerciseName}
                    </h2>
                    <button
                      onClick={() => removeExercise(index)}
                      className="bg-red-500 text-white w-[30px] h-[25px] rounded-full flex justify-center items-center"
                    >
                      <IoClose fontSize={"1.2rem"} />
                    </button>
                  </li>
                ))}
            </ul>
          )}

          {/* Add New Exercise Button */}
          <ThirdButton
            btnName="Add Workout Plan"
            onClick={addExercise}
            textColor="text-black"
            textSize="text-base"
          />

          {/* Submit Button */}
          <MainButton
            type="submit"
            btnName="Save training"
            isLoading={isCreateLoading}
          />
        </form>
      </div>
    </div>
  );
}

export default TrainingForm;
