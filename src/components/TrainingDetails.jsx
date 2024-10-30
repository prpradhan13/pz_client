/* eslint-disable react/prop-types */
import { MdKeyboardArrowLeft } from "react-icons/md";

function TrainingDetails({ selectedTraining, setTrainingDetailsOpen }) {
  const exercisePlan = selectedTraining.trainingPlan || selectedTraining.workoutPlan;

  return (
    <div className="w-full h-full p-5 scrollbar-hidden-y overflow-y-scroll font-montserrat">
      <button
        className="mt-10 ml-4 md:mt-0 md:mb-4 px-2 py-1 bg-borderColor text-black rounded-full font-semibold flex"
        onClick={() => setTrainingDetailsOpen(false)}
      >
        <MdKeyboardArrowLeft fontSize={"1.5rem"} />
        <span>Back</span>
      </button>

      <div className="w-full p-6 rounded-lg">
        <h1 className="text-primaryTextColor font-bold text-center text-2xl pb-5 border-b-2 border-borderColor capitalize">
          {selectedTraining?.trainingName || selectedTraining?.name ? (selectedTraining?.trainingName || selectedTraining?.name) : ("Training Plan")}
        </h1>

        <div className="grid md:grid-cols-2 md:gap-3">
          {exercisePlan.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="my-5 p-4 bg-cardBackground rounded-lg"
            >
              <h2 className="text-xl font-semibold text-primaryTextColor">
                Exercise {exerciseIndex + 1}
              </h2>
              <p className="text-lg text-borderColor capitalize font-semibold">
                {exercise.exerciseName}
              </p>

              <div className="mt-2 grid grid-cols-2 gap-x-2">
                {exercise.sets.map((set, setIndex) => (
                  <p
                    key={setIndex}
                    className="text-secondaryText bg-mainBgColor font-medium rounded-md mb-1 p-1"
                  >
                    Set {setIndex + 1}:{" "}
                    <span className="font-semibold text-borderColor">
                      {set.repetitions}
                    </span>{' '}
                    repes
                  </p>
                ))}
              </div>

              <p className="text-base font-medium text-secondaryText mt-3">
                *Rest in between sets:{" "}
                <span className="font-semibold">
                  {exercise?.restTime} seconds
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrainingDetails;
