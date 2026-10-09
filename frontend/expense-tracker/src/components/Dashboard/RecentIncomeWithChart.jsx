import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data = [], totalIncome = 0 }) => {
const chartData = data.map((item) => ({
name: item?.source,
amount: Number(item?.amount) || 0,
}));

return ( <div className="card"> <div className="flex items-center justify-between"> <h5 className="text-lg">Last 60 Days Income</h5> </div>
  <div className="w-full h-[360px]">
    <CustomPieChart
      data={chartData}
      label="Total Income"
      totalAmount={`₹${totalIncome}`}
      showTextAnchor
      colors={COLORS}
    />
  </div>
</div>

);
};

export default RecentIncomeWithChart;
