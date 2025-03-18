import React, { useState, useEffect } from "react";

const InterestCalculator = () => {
  // Original calculator state
  const [amount, setAmount] = useState("");
  const [interestType, setInterestType] = useState("per100");
  const [interestRate, setInterestRate] = useState("");
  const [rateType, setRateType] = useState("annual");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [days, setDays] = useState(0);
  const [interest, setInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [history, setHistory] = useState([]);

  // New calculator 1 state
  const [principalPerHundred, setPrincipalPerHundred] = useState("");
  const [ratePerHundred, setRatePerHundred] = useState("");
  const [timeMonths, setTimeMonths] = useState("");
  const [resultPerHundred, setResultPerHundred] = useState(null);

  // New calculator 2 state
  const [principalTenThousand, setPrincipalTenThousand] = useState("");
  const [ratePerTenThousand, setRatePerTenThousand] = useState("");
  const [resultTenThousand, setResultTenThousand] = useState(null);

  // Active calculator tab
  const [activeTab, setActiveTab] = useState("original");

  useEffect(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
    }
  }, [fromDate, toDate]);

  // Original calculator functions
  const calculate = () => {
    if (!amount || !interestRate || !days) {
      alert("Please fill all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(interestRate);
    let interestAmount = 0;
    let total = 0;

    // Convert rate to annual rate if it's monthly
    const annualRate = rateType === "monthly" ? rateNum * 12 : rateNum;

    // Calculate interest based on interest type
    if (interestType === "per100") {
      // Per 100₹ calculation: P * R * T / 100
      interestAmount = (amountNum * annualRate * days) / (100 * 365);
    } else {
      // Percentage calculation: P * (R/100) * T
      interestAmount = (amountNum * (annualRate / 100) * days) / 365;
    }

    total = amountNum + interestAmount;

    setInterest(interestAmount.toFixed(2));
    setTotalAmount(total.toFixed(2));

    // Add to history
    const newEntry = {
      id: Date.now(),
      amount: amountNum,
      interestRate: rateNum,
      rateType,
      interestType,
      fromDate,
      toDate,
      days,
      interest: interestAmount.toFixed(2),
      totalAmount: total.toFixed(2),
    };

    setHistory([newEntry, ...history.slice(0, 9)]);
  };

  const resetForm = () => {
    setAmount("");
    setInterestRate("");
    setInterestType("per100");
    setRateType("annual");
    setFromDate("");
    setToDate("");
    setDays(0);
    setInterest(0);
    setTotalAmount(0);
  };

  // New calculator 1 function
  const calculateInterestPerHundred = () => {
    if (!principalPerHundred || !ratePerHundred || !timeMonths) {
      alert("Please fill all fields");
      return;
    }

    const principal = parseFloat(principalPerHundred);
    const rate = parseFloat(ratePerHundred);
    const time = parseFloat(timeMonths);

    // Calculate interest per 100₹ per month
    const interestPerMonth = (principal * rate * time) / 100;
    const totalAmount = principal + interestPerMonth;

    setResultPerHundred({
      principal,
      interestAmount: interestPerMonth.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    });
  };

  // New calculator 2 function
  const calculateInterestPerTenThousand = () => {
    if (!principalTenThousand || !ratePerTenThousand) {
      alert("Please fill all fields");
      return;
    }

    const principal = parseFloat(principalTenThousand);
    const ratePerTenK = parseFloat(ratePerTenThousand);

    // Calculate interest based on rate per 10,000₹
    const interestAmount = (principal * ratePerTenK) / 10000;
    const totalAmount = principal - interestAmount;

    setResultTenThousand({
      principal,
      interestAmount: interestAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Reset form for Calculator 1
  const resetCalculator1 = () => {
    setPrincipalPerHundred("");
    setRatePerHundred("");
    setTimeMonths("");
    setResultPerHundred(null);
  };

  // Reset form for Calculator 2
  const resetCalculator2 = () => {
    setPrincipalTenThousand("");
    setRatePerTenThousand("");
    setResultTenThousand(null);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Interest Calculator
      </h1>

      {/* Tab Navigation */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === "original"
              ? "bg-blue-100 border-b-2 border-blue-600"
              : ""
          }`}
          onClick={() => setActiveTab("original")}
        >
          Date-based Calculator
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "calculator1"
              ? "bg-blue-100 border-b-2 border-blue-600"
              : ""
          }`}
          onClick={() => setActiveTab("calculator1")}
        >
          Monthly Calculator
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "calculator2"
              ? "bg-blue-100 border-b-2 border-blue-600"
              : ""
          }`}
          onClick={() => setActiveTab("calculator2")}
        >
          One-time Calculator
        </button>
      </div>

      {/* Original Calculator */}
      {activeTab === "original" && (
        <div>
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Interest Type
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="per100"
                    checked={interestType === "per100"}
                    onChange={() => setInterestType("per100")}
                  />
                  <span className="ml-2">Per 100₹</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="percentage"
                    checked={interestType === "percentage"}
                    onChange={() => setInterestType("percentage")}
                  />
                  <span className="ml-2">Percentage (%)</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Principal Amount (₹)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter principal amount"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {interestType === "per100"
                  ? "Interest Rate (per 100₹)"
                  : "Interest Rate (%)"}
              </label>
              <div className="flex">
                <input
                  type="number"
                  className="flex-1 p-2 border rounded-l"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Enter interest rate"
                  step="0.01"
                />
                <select
                  className="w-32 p-2 border-t border-r border-b rounded-r"
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                >
                  <option value="annual">per year</option>
                  <option value="monthly">per month</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {days > 0 && (
              <div className="mb-4">
                <p className="text-sm">
                  Duration: <span className="font-medium">{days} days</span>
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={calculate}
              >
                Calculate
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </div>

          {interest > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <h2 className="text-lg font-semibold mb-2">Result</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Principal Amount:</div>
                <div className="text-sm font-medium">
                  ₹{parseFloat(amount).toFixed(2)}
                </div>

                <div className="text-sm">Interest Amount:</div>
                <div className="text-sm font-medium">₹{interest}</div>

                <div className="text-sm">Total Amount:</div>
                <div className="text-sm font-medium">₹{totalAmount}</div>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Calculation History</h2>
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={clearHistory}
                >
                  Clear History
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-1 text-left">Amount</th>
                      <th className="py-2 px-1 text-left">Rate</th>
                      <th className="py-2 px-1 text-left">Rate Type</th>
                      <th className="py-2 px-1 text-left">Int. Type</th>
                      <th className="py-2 px-1 text-left">Period</th>
                      <th className="py-2 px-1 text-left">Interest</th>
                      <th className="py-2 px-1 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => (
                      <tr key={entry.id} className="border-b">
                        <td className="py-2 px-1">
                          ₹{entry.amount.toFixed(2)}
                        </td>
                        <td className="py-2 px-1">{entry.interestRate}</td>
                        <td className="py-2 px-1">
                          {entry.rateType === "monthly" ? "monthly" : "annual"}
                        </td>
                        <td className="py-2 px-1">
                          {entry.interestType === "per100" ? "per 100₹" : "%"}
                        </td>
                        <td className="py-2 px-1">
                          {formatDate(entry.fromDate)} to{" "}
                          {formatDate(entry.toDate)}
                        </td>
                        <td className="py-2 px-1">₹{entry.interest}</td>
                        <td className="py-2 px-1">₹{entry.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calculator 1: Monthly Interest Calculator */}
      {activeTab === "calculator1" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Interest Calculator
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={principalPerHundred}
              onChange={(e) => setPrincipalPerHundred(e.target.value)}
              placeholder="Enter principal amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Interest per ₹100 per month (₹)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={ratePerHundred}
              onChange={(e) => setRatePerHundred(e.target.value)}
              placeholder="Enter interest per ₹100 per month"
              step="0.01"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Time (months)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={timeMonths}
              onChange={(e) => setTimeMonths(e.target.value)}
              placeholder="Enter time in months"
            />
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={calculateInterestPerHundred}
            >
              Calculate Interest
            </button>
            <button
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              onClick={resetCalculator1}
            >
              Reset
            </button>
          </div>

          {resultPerHundred && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="text-md font-semibold mb-2">Result</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Principal Amount:</div>
                <div className="text-sm font-medium">
                  ₹{resultPerHundred.principal.toFixed(2)}
                </div>

                <div className="text-sm">Interest Amount:</div>
                <div className="text-sm font-medium">
                  ₹{resultPerHundred.interestAmount}
                </div>

                <div className="text-sm">Total Amount:</div>
                <div className="text-sm font-medium">
                  ₹{resultPerHundred.totalAmount}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calculator 2: One-time Calculator */}
      {activeTab === "calculator2" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">One-time Calculator</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={principalTenThousand}
              onChange={(e) => setPrincipalTenThousand(e.target.value)}
              placeholder="Enter principal amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Interest per ₹10,000 (₹)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={ratePerTenThousand}
              onChange={(e) => setRatePerTenThousand(e.target.value)}
              placeholder="Enter interest per ₹10,000"
              step="0.01"
            />
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={calculateInterestPerTenThousand}
            >
              Calculate Settled Amount
            </button>
            <button
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              onClick={resetCalculator2}
            >
              Reset
            </button>
          </div>

          {resultTenThousand && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="text-md font-semibold mb-2">Result</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Principal Amount:</div>
                <div className="text-sm font-medium">
                  ₹{resultTenThousand.principal.toFixed(2)}
                </div>

                <div className="text-sm">Interest Amount:</div>
                <div className="text-sm font-medium">
                  ₹{resultTenThousand.interestAmount}
                </div>

                <div className="text-sm">Total Amount:</div>
                <div className="text-sm font-medium">
                  ₹{resultTenThousand.totalAmount}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
