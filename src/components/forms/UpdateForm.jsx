/* eslint-disable react/prop-types */
import { useState } from "react";
import { MainButton } from "../buttons/Buttons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpenseData } from "../../API/expenseAPI";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

function UpdateForm({ setUpdateForm, selectedUpdateData }) {
  const [formData, setFormData] = useState({
    item: selectedUpdateData.item,
    price: selectedUpdateData.price,
    category: selectedUpdateData.category,
    date: selectedUpdateData.date.split("T")[0],
  });

  const expenseId = selectedUpdateData._id;
  const queryClient = useQueryClient();

  // console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateMutation = useMutation({
    mutationFn: () => updateExpenseData(expenseId, formData),
    onSuccess: (data) => {
      queryClient.setQueryData(["expense"], (oldData) => {
        if (!oldData) return oldData;

        const updateExpenses = oldData.expenseData.map((item) =>
          item._id === data.expense._id ? data.expense : item
        );

        return {
          ...oldData,
          expenseData: updateExpenses,
        };
      });
      setUpdateForm(false);
    },
    onError: (error) => {
      console.error("Update failed: ", error);
      alert("Error updating expense.");
    },
  });

  const isUpdating = updateMutation.isLoading;

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate();
    toast.success("Expense updated successfully");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[400px] bg-cardBackground min-h-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden font-montserrat"
    >
      <div className="w-full h-full p-5">
      <button
          type="button"
          onClick={() => setUpdateForm(false)}
          className="text-red-500 absolute right-2 top-2"
        >
          <IoClose fontSize={'1.5rem'} />
        </button>
        <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
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
              placeholder="Enter item name"
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
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Enter item name"
              className="rounded-lg p-2 text-secondaryText bg-mainBgColor outline-none focus:outline-borderColor"
            />
          </div>

          <MainButton type="submit" btnName="Update" isLoading={isUpdating} />
        </form>
      </div>
    </div>
  );
}

export default UpdateForm;
