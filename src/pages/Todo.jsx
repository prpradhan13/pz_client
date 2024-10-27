import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTodoData,
  removeTask,
  updateTaskChange,
  updateTodoData,
} from "../API/todoAPI";
import Loaders from "../components/loaders/Loaders";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaPlus, FaRegPenToSquare } from "react-icons/fa6";
import toast from "react-hot-toast";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { ThirdButton } from "../components/buttons/Buttons";
import TodoForm from "../components/forms/TodoForm";

function Todo() {
  const [filter, setFilter] = useState("all");
  const [selectedTodoToAddTask, setSelectedTodoToAddTask] = useState(null);
  const [taskInputData, setTaskInputData] = useState("");
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);

  useEffect(() => {
    if (isTodoFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTodoFormOpen]);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todo"],
    queryFn: getTodoData,
  });

  const todoData = useMemo(() => data?.todos, [data?.todos]);

  // Get today's date
  const today = dayjs();

  // Filter the todos based on the selected filter
  const filteredTodos = useMemo(() => {
    return todoData
      ?.map((todo) => {
        // Calculate progress percentage for each todo
        const completedTasks = todo.tasks.filter(
          (task) => task.completed
        ).length;
        const totalTasks = todo.tasks.length;
        const progressPercentage =
          totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        const isTodoCompleted = completedTasks === totalTasks && totalTasks > 0;

        return {
          ...todo,
          completed: isTodoCompleted, // Update the completed status based on tasks
          progressPercentage,
        };
      })
      .filter((todo) => {
        const remainingDays = dayjs(todo.dueDate).diff(today, "day");

        if (filter === "overdue") return remainingDays < 0;
        if (filter === "dueSoon")
          return remainingDays >= 0 && remainingDays <= 5;
        if (filter === "completed") return todo.completed;
        return true; // Default is to return all todos
      });
  }, [todoData, filter, today]);

  const updateTaskMutation = useMutation({
    mutationFn: ({ todoId, taskId, taskTitle, isCompleted }) =>
      updateTaskChange(todoId, taskId, taskTitle, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries(["todo"]);
    },
    onError: (err, variables, context) => {
      console.log(err);
      // Roll back cache to the previous value in case of an error
      queryClient.setQueryData(["todo"], context.previousTodos);
    },
  });

  // Mutation for adding a new task to a todo
  const updateTodoMutation = useMutation({
    mutationFn: ({ todoId, newTask }) => updateTodoData(todoId, newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["todo"]);
      toast.success("Task added successfully!");
    },
    onError: () => {
      toast.error("Failed to add the task!");
    },
  });

  const handleTaskChange = (todoId, taskId, taskTitle, isCompleted) => {
    const task = filteredTodos
      .find((todo) => todo.tasks.some((t) => t._id === taskId))
      ?.tasks.find((t) => t._id === taskId);

    if (task.completed) {
      toast.success("This task is already completed!");
      return;
    }

    updateTaskMutation.mutate({ todoId, taskId, taskTitle, isCompleted });
  };

  const handleAddTask = (todoId) => {
    setSelectedTodoToAddTask(todoId);
  };

  const saveAddedTask = () => {
    if (!taskInputData.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }

    const newTask = [
      {
        tasktitle: taskInputData,
        completed: false,
      },
    ];

    // Call the mutation to update the todo with the new task
    updateTodoMutation.mutate({ todoId: selectedTodoToAddTask, newTask });

    // Reset task input after saving
    setTaskInputData("");
    setSelectedTodoToAddTask(null);
  };

  const closeTodoInput = () => {
    setTaskInputData("");
    setSelectedTodoToAddTask(null);
  };

  const taskRemoveMutation = useMutation({
    mutationFn: (taskId) => removeTask(taskId),
    onSuccess: (data, taskId) => {
      queryClient.setQueryData(["todo"], (oldData) => {
        if (!oldData) return oldData;
        const updatedTodos = oldData.todos
          .map((todo) => {
            if (!todo.tasks.some((task) => task._id === taskId)) return todo;

            const updatedTasks = todo.tasks.filter(
              (task) => task._id !== taskId
            );

            // If no tasks are left, return null or mark the todo as needing deletion (optional logic)
            if (updatedTasks.length === 0) {
              return null; // Or you could add additional logic to delete the todo entirely
            }

            // Return the todo with the updated tasks array
            return {
              ...todo,
              tasks: updatedTasks,
            };
          })
          .filter(Boolean); // Filter out null values if any todos were removed entirely

        return { ...oldData, todos: updatedTodos };
      });
    },
  });

  const deleteTask = (taskId) => {
    taskRemoveMutation.mutate(taskId);
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

  if (todoData.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center p-10">
        <div className="w-full md:w-[30vw] h-[30vh] bg-cardBackground rounded-lg flex flex-col justify-center items-center gap-3">
          <p className="text-primaryTextColor text-2xl font-semibold capitalize">
            You have no Todos
          </p>
          <div onClick={() => setIsTodoFormOpen(true)} className="">
            <ThirdButton btnName={"create one"} />
          </div>
          {isTodoFormOpen && (
            <div
              onClick={() => setIsTodoFormOpen(false)}
              className="w-full h-screen bg-black fixed top-0 left-0 bg-opacity-80 z-50"
            >
              <TodoForm setIsTodoFormOpen={setIsTodoFormOpen} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full font-montserrat">
      <h1 className="text-center text-primaryTextColor font-semibold text-xl pt-10">
        Your Todos
      </h1>
      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 font-medium mt-4 text-sm">
        <button
          onClick={() => setFilter("all")}
          className={`py-1 px-2 ${
            filter === "all" ? "text-borderColor" : "text-primaryTextColor"
          } bg-cardBackground rounded-lg`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("overdue")}
          className={`py-1 px-2 ${
            filter === "overdue" ? "text-borderColor" : "text-primaryTextColor"
          } bg-cardBackground rounded-lg`}
        >
          Overdue
        </button>
        <button
          onClick={() => setFilter("dueSoon")}
          className={`py-1 px-2 ${
            filter === "dueSoon" ? "text-borderColor" : "text-primaryTextColor"
          } bg-cardBackground rounded-lg`}
        >
          Due Soon
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`py-1 px-2 ${
            filter === "completed"
              ? "text-borderColor"
              : " text-primaryTextColor"
          } bg-cardBackground rounded-lg`}
        >
          Completed
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap p-10 gap-4">
        {filteredTodos.map((todo) => {
          const createdAt = dayjs(todo.createdAt).format("DD MMMM YYYY");
          const dueDate = dayjs(todo.dueDate).format("DD MMMM YYYY");

          // Calculate the remaining days until the due date
          const today = dayjs();
          const remainingDays = dayjs(todo.dueDate).diff(today, "day");

          return (
            <div
              key={todo._id}
              className="md:min-w-[350px] p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer"
            >
              {/* Progress Bar */}
              <div className="w-full bg-mainBgColor rounded-full h-1 mb-1">
                <div
                  className={`h-1 rounded-full ${
                    todo.progressPercentage === 100
                      ? "bg-[rgb(0_128_0)]"
                      : todo.progressPercentage >= 75
                      ? "bg-[#22c55e]"
                      : todo.progressPercentage >= 50
                      ? "bg-[#fde047]"
                      : "bg-[#f97316]"
                  }`}
                  style={{ width: `${todo.progressPercentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`${
                    todo.progressPercentage === 100
                      ? "bg-[rgb(0_128_0)]"
                      : todo.progressPercentage >= 75
                      ? "bg-[#22c55e]"
                      : todo.progressPercentage >= 50
                      ? "bg-[#fde047]"
                      : "bg-[#f97316]"
                  } py-1 px-2 rounded-md text-mainBgColor font-semibold text-sm`}
                >
                  {/* {todo.completed ? "Completed" : "Pending"} */}
                  {`${todo.tasks.filter((task) => task.completed).length}/${
                    todo.tasks.length
                  }`}
                </span>
                <p
                  className={`font-medium text-sm ${
                    remainingDays <= 3 ? "text-red-500" : "text-secondaryText "
                  }`}
                >
                  {todo.completed ? (
                    <></>
                  ) : (
                    <>
                      {remainingDays >= 0
                        ? `Left ${remainingDays} day(s)`
                        : `Overdue by ${Math.abs(remainingDays)} day(s)`}
                    </>
                  )}
                </p>
              </div>

              <div className="my-4">
                <h2 className="text-base font-bold text-borderColor capitalize">
                  {`${todo.title === "" ? "No title" : todo.title}`}
                </h2>
                <p className="text-secondaryText font-medium text-sm">
                  Created: {createdAt}
                </p>
                <p className="text-secondaryText font-medium text-sm">
                  Due Date: {dueDate}
                </p>
              </div>

              <div className="">
                <div className="flex justify-between">
                  <span className="text-primaryTextColor font-semibold">
                    {" "}
                    Tasks{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddTask(todo._id)}
                    className="flex items-center gap-1 bg-mainBgColor rounded-md p-1 text-primaryTextColor "
                  >
                    <FaPlus fontSize={"1rem"} />
                  </button>
                </div>
                <div className="bg-mainBgColor p-2 rounded-md mt-2">
                  {selectedTodoToAddTask === todo._id ? (
                    <div className="flex gap-3 mb-2">
                      <input
                        type="text"
                        value={taskInputData}
                        onChange={(e) => setTaskInputData(e.target.value)}
                        placeholder="Enter task title"
                        className="bg-transparent border-b-2 border-borderColor outline-none text-primaryTextColor"
                      />
                      <button
                        type="button"
                        onClick={saveAddedTask}
                        className="bg-cardBackground p-1 rounded-md text-green-500 font-medium"
                      >
                        <IoMdCheckmark fontSize={"1rem"} />
                      </button>
                      <button
                        type="button"
                        onClick={closeTodoInput}
                        className="bg-cardBackground p-1 rounded-md text-red-500 font-medium"
                      >
                        <IoMdClose fontSize={"1rem"} />
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {todo.tasks?.map((task) => (
                    <div
                      key={task._id}
                      className="flex gap-2 justify-between items-center mb-2"
                    >
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) =>
                            handleTaskChange(
                              todo._id,
                              task._id,
                              task.tasktitle,
                              e.target.checked
                            )
                          }
                          className="cursor-pointer"
                        />
                        <p
                          className={`capitalize font-medium ${
                            task.completed
                              ? "line-through text-gray-600"
                              : "text-secondaryText"
                          }`}
                        >
                          {task.tasktitle}
                        </p>
                        {task.completed && (
                          <span className="text-green-500">
                            <IoMdCheckmark fontSize={"1.2rem"} />
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => deleteTask(task._id, todo._id)}
                        className="text-red-500"
                      >
                        <MdDelete fontSize={"1.2rem"} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Todo;
