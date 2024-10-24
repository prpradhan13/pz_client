/* eslint-disable react/prop-types */
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Currency from "../../utils/Currency";

// Utility function to group expenses by item and sum the prices
const groupExpensesByItem = (expenses) => {
  const groupedData = {};

  expenses.forEach((expense) => {
    if (groupedData[expense.category]) {
      groupedData[expense.category] += expense.price; // Add price if item already exists
    } else {
      groupedData[expense.category] = expense.price; // Create a new entry for the item
    }
  });

  // Transform the grouped data into an array format for the chart
  return Object.keys(groupedData).map((category) => ({
    name: category, // Item name (e.g., "Gym")
    "Total Spent": groupedData[category], // Total money spent on this item
  }));
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {<Currency price={value} />} {/* Display the price */}
    </text>
  );
};

function RoundPie({ expensesByMonth, selectedMonth }) {
  const chartData = groupExpensesByItem(
    expensesByMonth[selectedMonth].expenses
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const style = {
    textTransform: "capitalize",
  }

  return (
    <div className="w-full rounded-lg bg-cardBackground">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="Total Spent"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={style} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RoundPie;
