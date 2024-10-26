/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createTodo } from "../../API/todoAPI";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { MainButton, ThirdButton } from "../buttons/Buttons";

const priorityOptions = ["low", "medium", "high"];

function TodoForm({ setIsTodoFormOpen }) {
  const [todoFormData, setTodoFormData] = useState({
    title: "",
    dueDate: "",
    priority: "",
    tasks: [],
  });
  const [currentTask, setCurrentTask] = useState({
    tasktitle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoFormData({ ...todoFormData, [name]: value });
  };

  // Handle changes for each task
  const handleTaskChange = (field, value) => {
    setCurrentTask({ ...currentTask, [field]: value });
  };

  const addTask = () => {
    if (currentTask.tasktitle === "") {
        return toast.error("Please add a task")
    }
    setTodoFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, currentTask],
    }));

    setCurrentTask({
      tasktitle: "",
    });
  };

  const removeTask = (taskIndex) => {
    const updatedTask = todoFormData.tasks.filter((_, i) => i !== taskIndex);
    setTodoFormData({ ...todoFormData, tasks: updatedTask });
  };

  const createMutation = useMutation({
    mutationFn: () => createTodo(todoFormData),
    onSuccess: () => {
      toast.success("Todo created successfully");
      setTodoFormData({
        title: "",
        dueDate: "",
        priority: "",
        tasks: [],
      });
      setIsTodoFormOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create todo");
    },
  });

  const isCreateLoading = createMutation.isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(todoFormData);
    if (todoFormData.tasks.length > 0) {
      createMutation.mutate();
    } else {
      toast.error("Please add at least one Todo before submitting.");
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
          onClick={() => setIsTodoFormOpen(false)}
          className="text-red-500 absolute right-2 top-2"
        >
          <IoClose fontSize={"1.5rem"} />
        </button>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="title"
              className="text-lg font-medium text-primaryTextColor"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={todoFormData.title}
              onChange={handleChange}
              placeholder="Enter todo title"
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="dueDate"
              className="text-lg font-medium text-primaryTextColor"
            >
              Due Date:
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={todoFormData.dueDate}
              onChange={handleChange}
              placeholder="Enter todo title"
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="priority"
              className="text-lg font-medium text-primaryTextColor"
            >
              Priority:
            </label>
            <select
              name="priority"
              id="priority"
              value={todoFormData.priority}
              onChange={handleChange}
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            >
              <option value=""></option>
              {priorityOptions.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-primaryTextColor">Tasks</h2>
            <input
              type="text"
              placeholder={`Task title`}
              value={currentTask.tasktitle}
              onChange={(e) => handleTaskChange("tasktitle", e.target.value)}
              className="rounded-lg p-2 bg-mainBgColor text-secondaryText outline-none focus:outline-borderColor"
            />
          </div>

          {todoFormData.tasks.length > 0 && (
            <div className="my-2 flex gap-1 flex-wrap bg-mainBgColor p-1 rounded-lg">
              {todoFormData.tasks.map((task, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-cardBackground text-primaryTextColor rounded-lg flex justify-between gap-3 items-center capitalize font-medium"
                >
                  <h2>
                    {task.tasktitle.length > 5
                      ? `${task.tasktitle.slice(0, 5)}...`
                      : task.tasktitle}
                  </h2>
                    <button
                      onClick={() => removeTask(index)}
                      className="bg-red-500 text-white w-[30px] h-[25px] rounded-full flex justify-center items-center"
                    >
                      <IoClose fontSize={"1.2rem"} />
                    </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Exercise Button */}
          <ThirdButton
            btnName="Add Task"
            onClick={addTask}
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

export default TodoForm;
