import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomBarChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-sm text-gray-600">
            Total Income:{" "}
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
        <BarChart data={data}>
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

          <Bar
            dataKey="amount"
            fill="#875cf5"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;