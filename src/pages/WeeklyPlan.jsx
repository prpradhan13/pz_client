import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlan } from "../API/weeklyPlan";
import { useState } from "react";
import Loaders from "../components/loaders/Loaders";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { MdDeleteOutline } from "react-icons/md";
import WeeklyPlanDetails from "../components/WeeklyPlanDetails";

function WeeklyPlan() {
  const [planDetailsOpen, setPlanDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["weeklyplan"],
    queryFn: getWeeklyPlan,
  });

  const planData = data?.weeklyPlan;
  const dateOfTrainingCreate = dayjs(planData?.createdAt).format(
    "DD MMMM YYYY"
  );

  const clickOnPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanDetailsOpen(true);
  }

  const clickOnDeletePlan = (e) => {
    e.stopPropagation();
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

  if (planData?.length === 0) {
    return (
      <div className="pt-10">
        <h1 className="text-center text-primaryTextColor font-semibold text-xl">
          No plans!
        </h1>
      </div>
    );
  }

  return (
    <div className="">
      {!planDetailsOpen ? (
        <div className="pt-10">
          <h1 className="text-center text-primaryTextColor font-semibold text-2xl">
            Welcome Champ!!!
          </h1>
          <div className="grid lg:grid-cols-4 mx-10 mt-3 gap-4">
            {planData?.map((plan) => (
              <div
                key={plan?._id}
                onClick={() => clickOnPlan(plan)}
                className="p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer relative overflow-hidden"
              >
                <h3 className="text-lg font-bold text-borderColor capitalize w-80">
                  {plan?.trainingName}
                </h3>
                <p className="text-secondaryText">
                  Created: {dateOfTrainingCreate}
                </p>

                {user?.isAdmin && (
                  <button
                    onClick={(e) => clickOnDeletePlan(e, plan._id)}
                    className="absolute text-red-500 right-2 top-2"
                  >
                    <MdDeleteOutline fontSize={"1.5rem"} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <WeeklyPlanDetails
            selectedPlan={selectedPlan}
            setPlanDetailsOpen={setPlanDetailsOpen}
        />
      )}
    </div>
  );
}

export default WeeklyPlan;
