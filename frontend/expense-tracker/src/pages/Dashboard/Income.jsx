
import React, { useState, useEffect, useMemo } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //! Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.GET_ALL_INCOME
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  //! Get Unique Income Sources
  const uniqueSources = useMemo(() => {
    return [
      ...new Set(
        incomeData
          .map((item) => item.source)
          .filter(Boolean)
      ),
    ];
  }, [incomeData]);

  //! Filter Income Data
  const filteredIncomeData = useMemo(() => {
    return incomeData.filter((item) => {
      const matchesSearch = item.source
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesSource = selectedSource
        ? item.source === selectedSource
        : true;

      const itemDate = new Date(item.date);
      const fromDate = startDate
        ? new Date(`${startDate}T00:00:00`)
        : null;

      const toDate = endDate
        ? new Date(`${endDate}T23:59:59.999`)
        : null;

      const matchesStartDate = fromDate
        ? itemDate >= fromDate
        : true;

      const matchesEndDate = toDate
        ? itemDate <= toDate
        : true;

      return (
        matchesSearch &&
        matchesSource &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [incomeData, searchQuery, selectedSource, startDate, endDate]);

  //! Clear All Filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSource("");
    setStartDate("");
    setEndDate("");
  };

  //! Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // Validation Checks
    if (!source.trim()) {
      toast.error("Source is required.");
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }
  };

  //! Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });

      toast.success("Income details deleted successfully");

      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
  };

  //! Handle Download Income Details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error downloading income details:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          
{/* Search and Filter Section */}
<div className="bg-white p-5 rounded-lg shadow-md">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
    <h3 className="text-lg font-semibold text-black">
      Search & Filter Income
    </h3>

    <button
      onClick={clearFilters}
      className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg mt-3 sm:mt-0"
    >
      Clear Filters
    </button>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    {/* Search by Source */}
    <input
      type="text"
      placeholder="Search by source..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
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

    {/* Source Filter - Last */}
    <select
      value={selectedSource}
      onChange={(e) => setSelectedSource(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
    >
      <option value="">All Sources</option>

      {uniqueSources.map((source, index) => (
        <option key={index} value={source}>
          {source}
        </option>
      ))}
    </select>

  </div>
</div>


          {/* Income List */}
          <IncomeList
            transactions={filteredIncomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Delete Income Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() =>
            setOpenDeleteAlert({ show: false, data: null })
          }
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income detail?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
