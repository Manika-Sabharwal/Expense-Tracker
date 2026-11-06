import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");

  const formattedInteger = Number(integerPart).toLocaleString("en-IN");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (transactions = []) => {
  const groupedData = {};

  transactions.forEach((item) => {
    const date = moment(item.date).format("DD MMM YYYY");

    if (!groupedData[date]) {
      groupedData[date] = 0;
    }

    groupedData[date] += Number(item.amount) || 0;
  });

  return Object.entries(groupedData)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort(
      (a, b) =>
        moment(a.date, "DD MMM YYYY").valueOf() -
        moment(b.date, "DD MMM YYYY").valueOf(),
    );
};

export const prepareExpenseLineChartData = (transactions = []) => {
  const groupedData = {};

  transactions.forEach((item) => {
    const date = moment(item.date).format("DD MMM YYYY");

    if (!groupedData[date]) {
      groupedData[date] = 0;
    }

    groupedData[date] += Number(item.amount) || 0;
  });

  return Object.entries(groupedData)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort(
      (a, b) =>
        moment(a.date, "DD MMM YYYY").valueOf() -
        moment(b.date, "DD MMM YYYY").valueOf(),
    );
};
