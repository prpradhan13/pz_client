/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import TrainingDetails from "./TrainingDetails";

function WeeklyPlanDetails({ selectedPlan, setPlanDetailsOpen }) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetailsOpen, setDayDetailsOpen] = useState(false);
  const [restDay, setRestDay] = useState(false);

  const weekly = selectedPlan?.week || [];

  const currentWeek = weekly[currentWeekIndex];

  const goToNextWeek = () => {
    if (currentWeekIndex < weekly.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const clickOnDay = (day) => {
    if (day?.isRestDay) {
        return setRestDay(true);
    }
    setSelectedDay(day);
    setDayDetailsOpen(true);
  };

  return (
    <div className="w-full h-full p-5 scrollbar-hidden-y overflow-y-scroll font-montserrat">
      {!dayDetailsOpen ? (
        <>
          <button
            className="mt-10 ml-4 md:mt-0 md:mb-4 px-2 py-1 bg-borderColor text-black rounded-full font-semibold flex"
            onClick={() => setPlanDetailsOpen(false)}
          >
            <MdKeyboardArrowLeft fontSize={"1.5rem"} />
            <span>Back</span>
          </button>

          <div className="w-full p-6">
            <div className="border-b-2 border-borderColor pb-2">
              <h1 className="text-primaryTextColor font-bold text-center text-2xl capitalize">
                Week {currentWeek?.weekNumber}
              </h1>
              <p className="text-secondaryText text-center capitalize font-semibold">
                {currentWeek?.category}
              </p>
            </div>
          </div>
          <div className="w-full grid lg:grid-cols-4 mt-3 gap-4">
            {currentWeek?.days.map((day) => (
              <div
                key={day?._id}
                onClick={() => clickOnDay(day)}
                className="p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer"
              >
                <h3 className="text-lg font-medium text-borderColor">
                  Day {day?.dayNumber}
                </h3>
                <h1 className="text-xl font-semibold text-secondaryText">
                  {day?.name}
                </h1>
              </div>
            ))}
          </div>

          {restDay && (
            <div
                onClick={() => setRestDay(false)}
                className="bg-black w-full h-screen bg-opacity-85 fixed top-0 left-0 flex justify-center items-center"
            >
                <div className="bg-cardBackground w-[400px] h-[200px] rounded-lg flex justify-center items-center">
                    <p className="text-primaryTextColor font-semibold text-xl">Come on Champ it&apos;s rest day!!! </p>
                </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPreviousWeek}
              className={`p-2 bg-borderColor text-black rounded-full font-semibold text-xs flex items-center ${
                currentWeekIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentWeekIndex === 0}
            >
              <MdKeyboardArrowLeft fontSize={"1.1rem"} />
              <span>Previous Week</span>
            </button>
            <button
              onClick={goToNextWeek}
              className={`p-2 bg-borderColor text-black rounded-full font-semibold text-xs flex items-center ${
                currentWeekIndex === weekly.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentWeekIndex === weekly.length - 1}
            >
              <span>Next Week</span>
              <MdKeyboardArrowRight fontSize={"1.1rem"} />
            </button>
          </div>
        </>
      ) : (
        <TrainingDetails
          selectedTraining={selectedDay}
          setTrainingDetailsOpen={setDayDetailsOpen}
        />
      )}
    </div>
  );
}

export default WeeklyPlanDetails;
