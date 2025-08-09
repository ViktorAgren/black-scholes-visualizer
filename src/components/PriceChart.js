import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { blackScholes } from "../utils/blackScholes";

export const PriceChart = ({ inputs, optionType }) => {
  const generateChartData = useMemo(() => {
    const {
      S: currentStockPrice,
      K: strikePrice,
      r: riskFreeRate,
      sigma: volatility,
      T: timeToExpiration,
    } = inputs;
    const pricePoints = [];
    const priceRange = currentStockPrice * 0.5;
    const dataPointCount = 50;
    const stepSize = priceRange / dataPointCount;

    for (
      let stockPrice = currentStockPrice - priceRange;
      stockPrice <= currentStockPrice + priceRange;
      stockPrice += stepSize
    ) {
      const callOptionPrice = blackScholes.callPrice(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
      );
      const putOptionPrice = blackScholes.putPrice(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
      );
      const callIntrinsicValue = Math.max(0, stockPrice - strikePrice);
      const putIntrinsicValue = Math.max(0, strikePrice - stockPrice);

      pricePoints.push({
        stockPrice,
        callPrice: callOptionPrice,
        putPrice: putOptionPrice,
        intrinsicCall: callIntrinsicValue,
        intrinsicPut: putIntrinsicValue,
      });
    }
    return pricePoints;
  }, [inputs]);

  return (
    <div className="border border-gray-800 rounded-lg p-6 bg-gray-900">
      <h3 className="text-lg font-medium text-green-400 mb-4">
        {optionType === "call" ? "Call" : "Put"} Option Price
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={generateChartData}
            margin={{ top: 20, right: 30, left: 70, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="stockPrice"
              stroke="#6ee7b7"
              label={{
                value: "Stock Price",
                position: "insideBottom",
                offset: -40,
                fill: "#6ee7b7",
              }}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <YAxis
              stroke="#6ee7b7"
              label={{
                value: "Option Price",
                angle: -90,
                position: "insideLeft",
                offset: -50,
                fill: "#6ee7b7",
                style: { textAnchor: "middle" },
              }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #059669",
                borderRadius: "4px",
                padding: "10px",
              }}
              itemStyle={{ color: "#6ee7b7" }}
              labelStyle={{ color: "#6ee7b7", marginBottom: "5px" }}
              formatter={(value) => value.toFixed(2)}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                paddingTop: "10px",
                color: "#6ee7b7",
              }}
            />
            {optionType === "call" ? (
              <>
                <Line
                  type="monotone"
                  dataKey="callPrice"
                  stroke="#059669"
                  name="Call Price"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="intrinsicCall"
                  stroke="#4f46e5"
                  name="Intrinsic Value"
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="putPrice"
                  stroke="#dc2626"
                  name="Put Price"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="intrinsicPut"
                  stroke="#4f46e5"
                  name="Intrinsic Value"
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
