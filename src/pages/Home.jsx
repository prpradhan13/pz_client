import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ThirdButton } from "../components/buttons/Buttons";
import ExpenseForm from "../components/forms/ExpenseForm";
import TrainingForm from "../components/forms/TrainingForm";
import TodoForm from "../components/forms/TodoForm";

function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTrainingFormOpen, setIsTrainingFormOpen] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const box = useRef();

  useEffect(() => {
    if (isFormOpen || isTrainingFormOpen || isTodoFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormOpen, isTrainingFormOpen, isTodoFormOpen]);

  useGSAP(() => {
    let tl = gsap.timeline();
    tl.from(".h1Anim", {
      scale: 0.5,
      duration: 0.5,
      opacity: 0,
      stagger: 0.15,
    }).from(".pAnim", {
      y: -30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.5,
      // ease: "bounce.out",
    });
  }, {scope: box});

  const handleExpense = () => {
    setIsFormOpen(true);
  };

  const handleTraining = () => {
    setIsTrainingFormOpen(true)
  };

  const handleTodo = () => {
    setIsTodoFormOpen(true);
  };

  return (
    <section
      ref={box}
      className="w-full h-screen px-5 py-2 font-montserrat"
    >
      <div className="w-full h-full flex justify-center items-center flex-col gap-4">
        <h1 className="h1Anim capitalize text-primaryTextColor text-3xl lg:text-5xl font-semibold text-center">
          Welcome to{" "}
          <span className="text-borderColor font-pacifico font-medium text-5xl block md:inline">
            project zero
          </span>
        </h1>
        <p className="pAnim text-secondaryText font-medium tracking-widest leading-7 text-base">
          No worry,We take care of you.
        </p>
        <div className="flex gap-3 items-center justify-center flex-wrap md:flex-nowrap">
          <div className="pAnim md:w-full">
            <ThirdButton btnName={"expense"} onClick={handleExpense}/>
          </div>
          <div className="pAnim md:w-full">
            <ThirdButton btnName={"training"} onClick={handleTraining}/>
          </div>
          <div className="pAnim md:w-full">
            <ThirdButton btnName={"Todo"} onClick={handleTodo}/>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div
          onClick={() => setIsFormOpen(false)}
          className="w-full h-screen bg-black fixed top-0 left-0 bg-opacity-80 z-50"
        >
          <ExpenseForm setIsFormOpen={setIsFormOpen}/>
        </div>
      )}

      {isTrainingFormOpen && (
        <div
          onClick={() => setIsTrainingFormOpen(false)}
          className="w-full h-screen bg-black fixed top-0 left-0 bg-opacity-80 z-50"
        >
          <TrainingForm setIsTrainingFormOpen={setIsTrainingFormOpen}/>
        </div>
      )}

      {isTodoFormOpen && (
        <div
          onClick={() => setIsTodoFormOpen(false)}
          className="w-full h-screen bg-black fixed top-0 left-0 bg-opacity-80 z-50"
        >
          <TodoForm setIsTodoFormOpen={setIsTodoFormOpen}/>
        </div>
      )}
    </section>
  );
}

export default Home;
