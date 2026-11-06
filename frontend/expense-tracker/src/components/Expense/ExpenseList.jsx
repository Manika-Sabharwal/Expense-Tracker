
import React from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload } from "react-icons/lu";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Categories</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {transactions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {transactions.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500 text-sm">No Expenses Found</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
