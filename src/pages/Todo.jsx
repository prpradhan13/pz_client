import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodoData, updateTaskChange, updateTodoData } from "../API/todoAPI";
import Loaders from "../components/loaders/Loaders";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaPlus, FaRegPenToSquare } from "react-icons/fa6";
import toast from "react-hot-toast";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

function Todo() {
  const [filter, setFilter] = useState("all");
  const [selectedTodoToAddTask, setSelectedTodoToAddTask] = useState(null);
  const [taskInputData, setTaskInputData] = useState("");

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
    return todoData?.filter((todo) => {
      const remainingDays = dayjs(todo.dueDate).diff(today, "day");

      if (filter === "overdue") return remainingDays < 0;
      if (filter === "dueSoon") return remainingDays >= 0 && remainingDays <= 5;
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

    const newTask = [{
      tasktitle: taskInputData,
      completed: false,
    }]

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
    <div className="w-full h-full font-montserrat">
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
              <div className="flex justify-between items-center">
                <span
                  className={`${
                    todo.completed ? "bg-green-500" : "bg-[#d1b82b]"
                  } py-1 px-2 rounded-md text-black font-semibold text-xs`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
                <p
                  className={`font-medium text-sm ${
                    remainingDays <= 3 ? "text-red-500" : "text-secondaryText "
                  }`}
                >
                  {remainingDays >= 0
                    ? `Left ${remainingDays} day(s)`
                    : `Overdue by ${Math.abs(remainingDays)} day(s)`}
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
                            task.completed ? "line-through text-gray-600" : "text-secondaryText"
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Todo;
