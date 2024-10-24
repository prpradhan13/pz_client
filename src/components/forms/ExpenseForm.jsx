/* eslint-disable react/prop-types */
import { MainButton, ThirdButton } from "../buttons/Buttons";
import { createExpense } from "../../API/expenseAPI";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

function ExpenseForm({ setIsFormOpen }) {
  const [formData, setFormData] = useState({
    item: "",
    price: "",
    category: "",
    date: "",
  });
  const [expenseList, setExpenseList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addExpense = () => {
    // Only add if the formData has values
    // Validate formData before adding
    if (formData.item && formData.price && formData.category) {
      setExpenseList([...expenseList, formData]); // Add the current formData to the expenseList
      setFormData({ item: "", price: "", category: "", date: "" }); // Clear the form fields
    } else {
      toast.error("Please fill out all fields.");
    }
  };

  const removeExpense = (index) => {
    // Create a new array without the expense at the specified index
    const updatedExpenses = expenseList.filter((_, i) => i !== index);
    setExpenseList(updatedExpenses);
    toast.success("Expense removed successfully.");
  };

  const createMutation = useMutation({
    mutationFn: () => createExpense(expenseList),
    onSuccess: () => {
      toast.success("Expense created successfully");
      setExpenseList([]); // Clear the expense list after success
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create expense: ${error.message}`);
    },
  });

  const isCreateLoading = createMutation.isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if there's anything in the expenseList before submitting
    if (expenseList.length > 0) {
      createMutation.mutate();
    } else {
      // Show an alert or error message if there's nothing to submit
      toast.error("Please add at least one expense before submitting.");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[400px] bg-cardBackground min-h-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden font-montserrat"
    >
      <div className="w-full h-full p-5">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="item"
              className="text-lg font-medium text-primaryTextColor"
            >
              Item:
            </label>
            <input
              type="text"
              id="item"
              name="item"
              value={formData.item}
              onChange={handleChange}
              placeholder="Enter item name"
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="price"
              className="text-lg font-medium text-primaryTextColor"
            >
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

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
              value={formData.category}
              onChange={handleChange}
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            >
              <option value="">Select Category</option>
              <option value="investment">Investment</option>
              <option value="need">Need</option>
              <option value="emi">EMI</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="date"
              className="text-lg font-medium text-primaryTextColor"
            >
              Date (optional):
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

          <div className="w-full pt-2">
            <ThirdButton btnName="add expense" onClick={addExpense} textSize={"text-base"} textColor={"text-mainBgColor"}/>
          </div>

          {/* List of added expenses displayed as cards */}
          <ul className="mt-4 flex gap-1 flex-wrap">
            {expenseList.map((expense, index) => (
              <li
                key={index}
                className="px-3 py-1 bg-mainBgColor text-primaryTextColor rounded-lg flex justify-between gap-3 items-center capitalize font-medium"
              >
                <h2>
                  {expense.item.length > 5 ? `${expense.item.slice(0, 5)}...` : expense.item}
                </h2>
                <button
                  onClick={() => removeExpense(index)}
                  className="bg-red-500 text-white w-[30px] h-[25px] rounded-full flex justify-center items-center"
                >
                  <IoClose fontSize={"1.2rem"}/>
                </button>
              </li>
            ))}
          </ul>

          {expenseList.length > 0 ? (
            <MainButton type="submit" btnName="Create" isLoading={isCreateLoading} />
          ) : (
            <p className="text-center">
              *Click on Add then on Create 
            </p>
          )}

        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
