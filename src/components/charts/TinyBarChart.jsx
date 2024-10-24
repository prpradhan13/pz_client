/* eslint-disable react/prop-types */
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";

// Utility function to group expenses by item and sum the prices
const groupExpensesByItem = (expenses) => {
  const groupedData = {};

  expenses.forEach((expense) => {
    if (groupedData[expense.item]) {
      groupedData[expense.item] += expense.price; // Add price if item already exists
    } else {
      groupedData[expense.item] = expense.price; // Create a new entry for the item
    }
  });

  // Transform the grouped data into an array format for the chart
  return Object.keys(groupedData).map((item) => ({
    name: item, // Item name (e.g., "Gym")
    "Total Spent": groupedData[item], // Total money spent on this item
  }));
};

function TinyBarChart({ expensesByMonth, selectedMonth }) {
  const chartData = groupExpensesByItem(
    expensesByMonth[selectedMonth].expenses
  );

  return (
    <div className="w-full p-3">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name" // This will be the item name
            axisLine={false}
            tick={{ fill: "#CFCFCF" }}
            tickLine={false}
            className="capitalize font-medium"
          />
          <YAxis axisLine={false} tick={{ fill: "#CFCFCF" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="Total Spent" // This will be the total money spent on the item
            fill="#FF8A65"
            activeBar={<Rectangle fill="#FF8A65" stroke="#FF8A65" />}
            legendType="circle"
            radius={[10, 10, 0, 0]}

          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TinyBarChart;
