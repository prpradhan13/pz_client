/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteExpenseData } from "../API/expenseAPI";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import UpdateForm from "./forms/UpdateForm";

const ITEMS_PER_PAGE = 10;

function ExpenseTable({ expensesByMonth, selectedMonth, setSelectedMonth }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [updateForm, setUpdateForm] = useState(false);
  const [selectedUpdateData, setSelectedUpdateData] = useState({});
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date

  const queryClient = useQueryClient();

  // Memoize the expenses array to avoid unnecessary recalculations
  const expenses = useMemo(() => {
    return expensesByMonth[selectedMonth]?.expenses || [];
  }, [expensesByMonth, selectedMonth]);

  // Filter expenses based on the selected date range
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = dayjs(expense.date);
      const isAfterStartDate = startDate
        ? expenseDate.isAfter(dayjs(startDate).subtract(1, "day"))
        : true;
      const isBeforeEndDate = endDate
        ? expenseDate.isBefore(dayjs(endDate).add(1, "day"))
        : true;
      return isAfterStartDate && isBeforeEndDate;
    });
  }, [expenses, startDate, endDate]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

  // Get the current page's expenses
  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle going to the next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle going to the previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (expenseId) => deleteExpenseData(expenseId),
    onSuccess: (data, expenseId) => {
      queryClient.setQueryData(["expense"], (oldData) => {
        if (!oldData) return oldData;
        const updatedExpenses = oldData.expenseData.filter(
          (item) => item._id !== expenseId
        );

        return {
          ...oldData,
          expenseData: updatedExpenses,
        };
      });
    },
  });

  const isDeleting = deleteMutation.isLoading;

  const handleDelete = (expenseId) => {
    deleteMutation.mutate(expenseId);
    setSelectedMonth(null);
    toast.success("Expense deleted successfully");
  };

  const clickOnUpdateIcon = (expense) => {
    setSelectedUpdateData(expense);
    setUpdateForm(true);
  };

  // Handle resetting pagination when date filter changes
  const handleDateChange = () => {
    setCurrentPage(1);
  };

  return (
    <>
      <div className="w-full mt-6 md:p-5 md:mt-0">
        <div className="">
          <h1 className="text-primaryTextColor font-bold text-center text-xl pb-3">
            Expense Details
          </h1>

          {/* Date Filters */}
          <div className="md:flex md:justify-between mb-5">
            <div className="flex items-center text-primaryTextColor mb-2 md:mb-0">
              <label htmlFor="startDate" className="mr-3 font-medium">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleDateChange();
                }}
                className="p-2 bg-cardBackground rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center text-primaryTextColor">
              <label htmlFor="endDate" className="mr-3 font-medium">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleDateChange();
                }}
                className="p-2 bg-cardBackground rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="w-full">
            {filteredExpenses.length === 0 ? (
              // Show "No Data Available" if no expenses are found
              <div className="text-center text-lg font-semibold py-5 text-primaryTextColor">
                No Data Available
              </div>
            ) : (
              <div className="w-full bg-cardBackground rounded-lg overflow-x-auto md:overflow-hidden">
                <table className="text-secondaryText w-full">
                  <thead className="border-b">
                    <tr className="text-lg font-semibold text-borderColor">
                      <td className="w-20 md:w-28 p-3 text-base tracking-wider">Date</td>
                      <td className="w-20 md:w-28 p-3 text-base tracking-wider">Price</td>
                      <td className="p-3 text-base tracking-wider">Items</td>
                      <td className="w-20 md:w-32 p-3 text-base tracking-wider">Category</td>
                      <td className="p-3 w-20 text-base tracking-wider">Edit</td>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExpenses.map((expense) => (
                      <tr
                        key={expense._id}
                        className="font-medium capitalize odd:bg-mainBgColor"
                      >
                        <td className="p-3 text-sm whitespace-nowrap"> {dayjs(expense.date).format("DD/MM/YY")} </td>
                        <td className="p-3 text-sm whitespace-nowrap"> {expense.price} </td>
                        <td className="p-3 text-sm whitespace-nowrap"> {expense.item} </td>
                        <td className="p-3 text-sm whitespace-nowrap"> {expense.category} </td>
                        <td className="p-3 grid grid-cols-2 gap-7">
                          <button
                            type="button"
                            onClick={() => clickOnUpdateIcon(expense)}
                            className="text-blue-500 text-[1.1rem] md:text-[1.5rem] "
                          >
                            <FaRegPenToSquare />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-500 text-[1.2rem] md:text-[1.5rem]"
                            disabled={isDeleting} // Disable the button while deleting
                          >
                            {isDeleting ? (
                              <span>Loading...</span> // Render loading text or spinner
                            ) : (
                              <MdDelete />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredExpenses.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center mt-5 gap-2">
              <button
                onClick={previousPage}
                className="bg-mainBgColor p-1 rounded-lg text-primaryTextColor"
                disabled={currentPage === 1}
              >
                <MdOutlineKeyboardArrowLeft fontSize={"1.1rem"} />
              </button>

              <span className="mx-2 text-primaryTextColor font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={nextPage}
                className="bg-mainBgColor p-1 rounded-lg text-primaryTextColor"
                disabled={currentPage === totalPages}
              >
                <MdOutlineKeyboardArrowRight fontSize={"1.1rem"} />
              </button>
            </div>
          )}
        </div>
      </div>

      {updateForm && (
        <div
          onClick={() => setUpdateForm(false)}
          className="w-full h-screen bg-black absolute top-0 left-0 bg-opacity-80"
        >
          <UpdateForm
            setUpdateForm={setUpdateForm}
            selectedUpdateData={selectedUpdateData}
          />
        </div>
      )}
    </>
  );
}

export default ExpenseTable;
