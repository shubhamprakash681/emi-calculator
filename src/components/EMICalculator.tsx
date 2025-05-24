import React, { useEffect, useState } from "react";
import EMIParameter from "./EMIParameter";
import { PieChart } from "react-minimal-pie-chart";

type EMIData = {
  principle: number;
  downpaymentPercentage: number;
  downpayment: number;

  processingFeePercentage: number;
  processingFee: number;
  adjustedLoanAmount: number; // (principle - downpayment) + processing fee

  interestRate: number; // per annum
  tenure: number; // in months
  emi: number; // emi per month
};

type AmortizationEntry = {
  period: {
    month: number;
    year: number;
  };
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
};

const getInitialValues = (
  principle: number,
  initialProcessingFeePercentage: number = 2,
  initialInterestRate: number = 10,
  initialTenure: number = 12 * 5
): EMIData => {
  const adjustedLoanAmount = principle - 0 + principle * (initialProcessingFeePercentage / 100);

  return {
    principle,
    downpaymentPercentage: 0,
    downpayment: 0,

    processingFeePercentage: initialProcessingFeePercentage,
    processingFee: principle * (initialProcessingFeePercentage / 100),
    adjustedLoanAmount,

    interestRate: initialInterestRate,
    tenure: initialTenure,
    emi: calculateEMI(adjustedLoanAmount, initialInterestRate, initialTenure),
  };
};

const calculateEMI = (
  adjustedLoanAmount: number,
  interestRatePercentage: number,
  loanTenureInMonths: number
): number => {
  const monthlyInterestRate = interestRatePercentage / 100 / 12;
  const emi =
    (adjustedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureInMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTenureInMonths) - 1);
  return emi;
};

const EMICalculator: React.FC = () => {
  const [emiData, setEmiData] = useState<EMIData>(() => getInitialValues(1000000));

  const [amortizationData, setAmortizationData] = useState<AmortizationEntry[]>([]);

  // useEffect for calculating emi and other values when emiData changes
  useEffect(() => {
    const downpayment = emiData.principle * (emiData.downpaymentPercentage / 100);
    const processingFee = emiData.principle * (emiData.processingFeePercentage / 100);
    const adjustedLoanAmount = emiData.principle - downpayment + processingFee;
    const emi = calculateEMI(adjustedLoanAmount, emiData.interestRate, emiData.tenure);

    setEmiData((prev) => ({
      ...prev,
      downpayment,
      processingFee,
      adjustedLoanAmount,
      emi,
    }));
  }, [
    emiData.principle,
    emiData.downpaymentPercentage,
    emiData.processingFeePercentage,
    emiData.interestRate,
    emiData.tenure,
  ]);

  useEffect(() => {
    const schedule: AmortizationEntry[] = [];
    let remaining = emiData.adjustedLoanAmount;
    const monthlyInterestRate = emiData.interestRate / 100 / 12;

    const period = new Date();
    period.setMonth(period.getMonth() + 1); // start from next month
    for (let month = 0; month < emiData.tenure; month++) {
      const interest = Number((remaining * monthlyInterestRate).toFixed(2));
      const principal = Number((emiData.emi - interest).toFixed(2));
      const newRemaining = Number((remaining - principal).toFixed(2));

      schedule.push({
        period: {
          month: period.getMonth(),
          year: period.getFullYear(),
        },
        payment: Number(emiData.emi.toFixed(2)),
        principal,
        interest,
        remaining: newRemaining > 1 ? newRemaining : 0,
      });

      remaining = newRemaining;
      period.setMonth(period.getMonth() + 1);
    }

    setAmortizationData(schedule);
  }, [emiData]);

  const totalInterest = emiData.emi * emiData.tenure - emiData.adjustedLoanAmount;
  const totalAmount = emiData.emi * emiData.tenure;

  const pieChartData = [
    {
      title: "Principal",
      value: emiData.adjustedLoanAmount,
      color: "#4CAF50",
    },
    {
      title: "Interest",
      value: totalInterest,
      color: "#F44336",
    },
  ];

  return (
    <div className="rounded-xl shadow-md shadow-card text-card-foreground w-full space-y-16">
      {/* <h2 className="font-semibold text-2xl text-center">EMI Calculator</h2> */}

      <div className="my-4 flex flex-col items-center mx-2 sm:mx-4 md:flex-row gap-6">
        <div className="w-full space-y-6">
          <EMIParameter
            label="Loan Amount"
            valueToDisplay={`₹ ${emiData.principle}`}
            value={emiData.principle}
            minValue={10000}
            maxValue={100000000}
            step={5000}
            onChange={(e) => setEmiData({ ...emiData, principle: Number(e.target.value) })}
          />

          <EMIParameter
            label="Interest Rate (p.a.)"
            valueToDisplay={`${emiData.interestRate} %`}
            value={emiData.interestRate}
            minValue={1}
            maxValue={30}
            step={1}
            onChange={(e) => setEmiData({ ...emiData, interestRate: Number(e.target.value) })}
          />

          <EMIParameter
            label={`Processing Fee (in %) - Total- ${emiData.processingFee.toFixed(2)}`}
            valueToDisplay={`${emiData.processingFeePercentage} %`}
            value={emiData.processingFeePercentage}
            minValue={1}
            maxValue={20}
            step={1}
            onChange={(e) => setEmiData({ ...emiData, processingFeePercentage: Number(e.target.value) })}
          />

          <EMIParameter
            label={`Down payment (in %) - Total- ${emiData.downpayment.toFixed(2)}`}
            valueToDisplay={`${emiData.downpaymentPercentage} %`}
            value={emiData.downpaymentPercentage}
            minValue={0}
            maxValue={60}
            step={5}
            onChange={(e) => setEmiData({ ...emiData, downpaymentPercentage: Number(e.target.value) })}
          />

          <EMIParameter
            label="Tenure (in months)"
            valueToDisplay={`${emiData.tenure} months`}
            value={emiData.tenure}
            minValue={1}
            maxValue={60}
            step={1}
            onChange={(e) => setEmiData({ ...emiData, tenure: Number(e.target.value) })}
          />

          <div className="space-y-3 py-2 text-lg">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly EMI</span>
              <span className="font-semibold whitespace-nowrap">₹ {emiData.emi.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Principle Amount</span>
              <span className="font-semibold whitespace-nowrap">₹ {emiData.principle.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                <div>Adjusted Loan Amount</div>
                <div className="hidden sm:visible">[(principle - downpayment) + processing fee]</div>
              </span>
              <span className="font-semibold whitespace-nowrap">₹ {emiData.adjustedLoanAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Interest</span>
              <span className="font-semibold whitespace-nowrap">₹ {totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount (EMI × Tenure)</span>
              <span className="font-semibold whitespace-nowrap">₹ {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Pie chart section */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="p-3 relative w-full max-w-3xs sm:max-w-2xs md:max-w-xl mb-6 hover:scale-105 transition-all duration-300 ease-in-out">
            <PieChart
              data={pieChartData}
              // label={({ dataEntry }) => dataEntry.title}
              // labelStyle={{
              //   fontSize: "6px",
              //   fontFamily: "sans-serif",
              //   fill: "#FFFFFF",
              //   fontWeight: "bold",
              // }}
              // labelPosition={60}
              animate
              animationDuration={1000}
              animationEasing="ease-out"
              // segmentsShift={0.5}
              startAngle={-90}
              rounded
              lineWidth={40}
              paddingAngle={2}
              segmentsStyle={{ transition: "all 0.3s ease" }}
              segmentsTabIndex={0}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">₹{totalAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Payment</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md p-2">
            {pieChartData.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl shadow-sm border flex items-center hover:scale-105 transition-all duration-300 ease-in-out ${
                  index === 0
                    ? "border-0 bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100"
                    : "border-0 bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                <div>
                  <div className="font-medium text-muted-foreground">{item.title}</div>
                  <div className="text-lg font-semibold">₹{item.value.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((item.value / totalAmount) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amortization Schedule section */}
      <div className="mx-2 sm:mx-4 mt-8">
        <h3 className="text-lg font-semibold mb-4">Amortization Schedule</h3>
        <div className="!overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border whitespace-nowrap text-center">
            <thead>
              <tr className="bg-green-100 dark:bg-gray-950">
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Principal</th>
                <th className="border px-4 py-2">Interest</th>
                <th className="border px-4 py-2">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationData.map((entry, index) => (
                <tr
                  key={index}
                  className={`text-green-600 dark:text-green-100 ${
                    index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-green-50 dark:bg-gray-900"
                  }`}
                >
                  <td className="border px-4 py-2">
                    {getMonthName(entry.period.month)} - {entry.period.year}
                  </td>
                  <td className="border px-4 py-2">₹ {entry.payment.toFixed(2)}</td>
                  <td className="border px-4 py-2">₹ {entry.principal.toFixed(2)}</td>
                  <td className="border px-4 py-2">₹ {entry.interest.toFixed(2)}</td>
                  <td className="border px-4 py-2">₹ {entry.remaining.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getMonthName = (monthIndex: number): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthNames[monthIndex];
};

export default EMICalculator;
