const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income & expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get income transactions in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: {
        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    });

    last60DaysIncomeTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Get total income for last 60 days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    last30DaysExpenseTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Get total expense for last 30 days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch income transactions
    const incomeTransactions = await Income.find({ userId });

    // Sort income transactions
    incomeTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Fetch expense transactions
    const expenseTransactions = await Expense.find({ userId });

    // Sort expense transactions
    expenseTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Get last 5 income transactions
    const lastIncomeTransactions = incomeTransactions
      .slice(0, 5)
      .map((txn) => ({
        ...txn.toObject(),
        type: "income",
      }));

    // Get last 5 expense transactions
    const lastExpenseTransactions = expenseTransactions
      .slice(0, 5)
      .map((txn) => ({
        ...txn.toObject(),
        type: "expense",
      }));

    // Combine income and expense transactions
    const lastTransactions = [
      ...lastIncomeTransactions,
      ...lastExpenseTransactions,
    ];

    // Sort combined transactions
    lastTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) -
        (totalExpense[0]?.total || 0),

      totalIncome: totalIncome[0]?.total || 0,

      totalExpense: totalExpense[0]?.total || 0,

      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },

      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },

      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};