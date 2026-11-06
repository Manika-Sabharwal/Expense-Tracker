
import React, { useState, useEffect, useMemo } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Search and Filter States
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  //! Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Get Unique Categories
  const categories = useMemo(() => {
    const uniqueCategories = new Map();

    expenseData.forEach((expense) => {
      const category = expense.category?.trim();

      if (category) {
        const normalizedCategory = category.toLowerCase();

        if (!uniqueCategories.has(normalizedCategory)) {
          uniqueCategories.set(normalizedCategory, category);
        }
      }
    });

    return ["All", ...uniqueCategories.values()];
  }, [expenseData]);

  // Filter Expenses
  const filteredExpenses = useMemo(() => {
    return expenseData.filter((expense) => {
      const matchesSearch = expense.category
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      const expenseDate = new Date(expense.date);

      const matchesStartDate = startDate
        ? expenseDate >= new Date(startDate)
        : true;

      const matchesEndDate = endDate
        ? expenseDate <
          new Date(
            new Date(endDate).setDate(new Date(endDate).getDate() + 1)
          )
        : true;

      const matchesCategory =
        selectedCategory === "All" ||
        expense.category?.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase();

      return (
        matchesSearch &&
        matchesStartDate &&
        matchesEndDate &&
        matchesCategory
      );
    });
  }, [expenseData, searchText, startDate, endDate, selectedCategory]);

  // Clear All Filters
  const clearFilters = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setSelectedCategory("All");
  };

  //! Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  //! Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  //! Handle Download Expense Details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error downloading expense details:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">

          {/* Expense Overview */}
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">
                Search & Filter Expenses
              </h3>

              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg mt-3 sm:mt-0"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Search by Category */}
              <input
                type="text"
                placeholder="Search by category..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
              />

              {/* Start Date */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                  aria-label="Start Date"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                  aria-label="End Date"
                />
              </div>

              {/* Category Filter - Last */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
              >
                <option value="All">All Categories</option>

                {categories
                  .filter((category) => category !== "All")
                  .map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

            </div>
          </div>

          {/* Expense List */}
          <ExpenseList
            transactions={filteredExpenses}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />

        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        {/* Delete Expense Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() =>
            setOpenDeleteAlert({ show: false, data: null })
          }
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default Expense;
