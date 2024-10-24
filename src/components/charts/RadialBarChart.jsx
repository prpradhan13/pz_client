/* eslint-disable react/prop-types */
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

function RoundBar({ expensesByMonth, selectedMonth }) {
  // Calculate total expenses grouped by category for the selected month
  const expenses = expensesByMonth[selectedMonth]?.expenses || [];

    // Check if expenses exist and log the data
    console.log("Expenses Data:", expenses);
  
    // Return a message if no expenses are available
    if (!expenses.length) {
      return <div>No expenses available for the selected month.</div>;
    }

  // Grouping expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.price;
    return acc;
  }, {});

    // Log the grouped totals for debugging
    console.log("Category Totals:", categoryTotals);

  // Prepare data for RadialBarChart
  const data = Object.keys(categoryTotals).map((category) => ({
    name: category,
    uv: categoryTotals[category],
    fill: getCategoryColor(category), // Function to get color based on category
  }));

  const style = {
    top: 0,
    left: 350,
    lineHeight: '24px',
  };

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar
            background
            dataKey="uv"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={style}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Example function to get color based on category
function getCategoryColor(category) {
  const categoryColors = {
    personal: '#8884d8',
    emi: '#82ca9d',
    need: '#FFBB28',
    investment: '#FF8042',
    // Add more categories and their colors as needed
  };
  
  return categoryColors[category] || '#cccccc'; // Default color if category not found
}

export default RoundBar;
