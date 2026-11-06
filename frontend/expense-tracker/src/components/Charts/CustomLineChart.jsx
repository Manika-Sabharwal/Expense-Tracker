import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const CustomLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-sm text-gray-600">
            Total Expense:{" "}
            <span className="text-sm font-medium text-gray-900">
              ₹{payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#555" }}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#875cf5"
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;