/* eslint-disable react/prop-types */
import { MdKeyboardArrowLeft } from "react-icons/md";

function TrainingDetails({ selectedTraining, setTrainingDetailsOpen }) {
    
  return (
    <div className="w-full h-full p-5 scrollbar-hidden-y overflow-y-scroll font-montserrat">
      <button
        className="mb-4 px-2 py-1 bg-borderColor text-black rounded-full font-semibold"
        onClick={() => setTrainingDetailsOpen(false)}
      >
        <MdKeyboardArrowLeft fontSize={"1.5rem"} />
      </button>

      <div className="w-full p-6 rounded-lg">
        <h1 className="text-primaryTextColor font-bold text-center text-2xl pb-5 border-b-2 border-borderColor capitalize">
          {selectedTraining?.trainingName || "Training Plan"}
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-3">
            {selectedTraining?.trainingPlan?.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="my-5 p-4 bg-cardBackground rounded-lg">
                <h2 className="text-xl font-semibold text-primaryTextColor mb-3">
                Exercise {exerciseIndex + 1}
                </h2>
                <p className="text-lg text-borderColor capitalize font-semibold">
                {exercise.exerciseName}
                </p>

                <div className="mt-3">
                {exercise.sets.map((set, setIndex) => (
                    <p key={setIndex} className="text-secondaryText bg-mainBgColor rounded-md mb-1">
                    Set {setIndex + 1}: <span className="font-semibold">{set.repetitions} repetitions</span>
                    </p>
                ))}
                </div>

                <p className="text-base font-medium text-secondaryText mt-4">
                *Rest in between sets: <span className="font-semibold text-borderColor">{exercise?.restTime} seconds</span>
                </p>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TrainingDetails;
