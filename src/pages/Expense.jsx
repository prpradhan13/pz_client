import { useQuery } from "@tanstack/react-query";
import { getExpenseData } from "../API/expenseAPI";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import Currency from "../utils/Currency";
import { MdKeyboardArrowLeft } from "react-icons/md";
import RoundPie from "../components/charts/RoundPie";
import { ThirdButton } from "../components/buttons/Buttons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaArrowDown } from "react-icons/fa6";
import Loaders from "../components/loaders/Loaders";
import ExpenseTable from "../components/ExpenseTable";

function Expense() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expense"],
    queryFn: getExpenseData,
  });

  // Group expenses by month using useMemo
  const expensesByMonth = useMemo(() => {
    const groupByMonth = (expenses) => {
      if (!expenses || !expenses.length) return {}; // Check if expenses exist

      return expenses.reduce((acc, expense) => {
        const month = dayjs(expense.date).format("MMMM YYYY"); // Group by month name and year
        if (!acc[month]) {
          acc[month] = { expenses: [], totalSpent: 0 };
        }
        acc[month].expenses.push(expense);
        acc[month].totalSpent += expense.price;
        return acc;
      }, {});
    };

    return groupByMonth(data?.expenseData);
  }, [data?.expenseData]);

  const generatePDF = () => {
    setLoadingPdf(true);

    const doc = new jsPDF();
    // Set title
    doc.text("Expense Report", 14, 10);

    // Add table of expenses
    const tableColumn = ["Item", "Price", "Date", "Category"];
    const tableRows = [];

    // Iterate through all months and add rows
    expensesByMonth[selectedMonth].expenses.forEach((expense) => {
      const expenseData = [
        expense.item,
        expense.price,
        dayjs(expense.date).format("DD MMMM YYYY"),
        expense.category,
      ];

      tableRows.push(expenseData);
    });

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save(`expense-report-${selectedMonth}.pdf`);

    setLoadingPdf(false);
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

  if (
    !data ||
    !Array.isArray(data?.expenseData) ||
    data?.expenseData?.length === 0
  ) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[30vw] h-[30vh] bg-cardBackground rounded-lg flex flex-col justify-center items-center gap-3">
          <p className="text-primaryTextColor text-2xl font-semibold capitalize">
            You have no expenses
          </p>
          <div className="">
            <ThirdButton btnName={"create one"} />
          </div>
        </div>
      </div>
    );
  }
  // Find the maximum expense price for the selected month
  // const maxPrice = selectedMonth && Math.max(...expensesByMonth[selectedMonth].expenses.map((e) => e.price));

  return (
    <div className="w-full h-full font-montserrat">
      {!selectedMonth ? (
        <div className="pt-10">
          <h1 className="text-center text-primaryTextColor font-semibold text-xl">
            Your Monthly Expenses
          </h1>
          <div className="grid lg:grid-cols-4 p-10 gap-4">
            {Object.keys(expensesByMonth).map((month) => (
              <div
                key={month}
                className="cardAnim p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedMonth(month)}
              >
                <h3 className="text-lg font-bold text-primaryTextColor">
                  {month}
                </h3>
                <p className="text-secondaryText font-medium">
                  {expensesByMonth[month].expenses.length} expenses
                </p>
                <p className="text-secondaryText font-medium">
                  Total Spent:{" "}
                  <Currency price={expensesByMonth[month].totalSpent} />
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-5 scrollbar-hidden-y overflow-y-scroll">
            <button
              className="mt-10 ml-4 md:mt-0 md:mb-4 px-2 py-1 bg-borderColor text-black rounded-full font-semibold flex"
              onClick={() => setSelectedMonth(null)}
            >
              <MdKeyboardArrowLeft fontSize={"1.5rem"} /> <span>Back</span>
            </button>

          <div className="p-5 flex justify-between items-center">
            <div className="">
              <h2 className="text-2xl font-bold text-primaryTextColor">
                {selectedMonth}
              </h2>
              <p className="text-secondaryText">
                Total Money Spent:{" "}
                <Currency price={expensesByMonth[selectedMonth].totalSpent} />
              </p>
            </div>
            <button
              onClick={generatePDF}
              className="bg-borderColor md:w-[150px] text-pr lg:text-lg font-semibold rounded-full md:rounded-lg p-4 md:px-4 md:py-1 shadow-[1px_3px_35px_-9px_rgba(255,138,101,1)]"
              disabled={loadingPdf}
            >
              {loadingPdf ? (
                "...."
              ) : (
                <div className="flex justify-center items-center gap-1">
                  <FaArrowDown />  <span className="hidden md:block">Expense</span>
                </div>
              )}
            </button>
          </div>

          <div className="w-full grid lg:grid-cols-2 gap-5 px-5">
            {/* <TinyBarChart
              expensesByMonth={expensesByMonth}
              selectedMonth={selectedMonth}
            /> */}
            {/* <RoundBar expensesByMonth={expensesByMonth} selectedMonth={selectedMonth} /> */}
            <RoundPie
              expensesByMonth={expensesByMonth}
              selectedMonth={selectedMonth}
            />
            <div className="hidden md:block">
              <RoundPie
                expensesByMonth={expensesByMonth}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>

          <div className="w-full">
            <ExpenseTable
              expensesByMonth={expensesByMonth}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Expense;
