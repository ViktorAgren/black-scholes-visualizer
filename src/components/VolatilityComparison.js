import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { blackScholes } from "../utils/blackScholes";

export const VolatilityComparison = ({ inputs, optionType }) => {
  const volatilityScenarios = [
    { name: "Low Vol (10%)", value: 0.1, color: "#059669" },
    { name: "Current Vol", value: inputs.sigma, color: "#3b82f6" },
    { name: "High Vol (50%)", value: 0.5, color: "#dc2626" },
  ];

  const comparisonData = useMemo(() => {
    const {
      S: currentStockPrice,
      K: strikePrice,
      r: riskFreeRate,
      T: timeToExpiration,
    } = inputs;
    const data = [];
    const priceRange = currentStockPrice * 0.5;
    const dataPointCount = 50;
    const stepSize = priceRange / dataPointCount;

    for (
      let stockPrice = currentStockPrice - priceRange;
      stockPrice <= currentStockPrice + priceRange;
      stockPrice += stepSize
    ) {
      const dataPoint = { stockPrice };

      volatilityScenarios.forEach((scenario) => {
        const price =
          optionType === "call"
            ? blackScholes.callPrice(
                stockPrice,
                strikePrice,
                riskFreeRate,
                scenario.value,
                timeToExpiration,
              )
            : blackScholes.putPrice(
                stockPrice,
                strikePrice,
                riskFreeRate,
                scenario.value,
                timeToExpiration,
              );

        dataPoint[scenario.name] = price;
      });

      data.push(dataPoint);
    }
    return data;
  }, [inputs, optionType]);

  const vegaImpact = useMemo(() => {
    const { S, K, r, T } = inputs;
    return volatilityScenarios.map((scenario) => ({
      ...scenario,
      vega: blackScholes.vega(S, K, r, scenario.value, T),
      optionPrice:
        optionType === "call"
          ? blackScholes.callPrice(S, K, r, scenario.value, T)
          : blackScholes.putPrice(S, K, r, scenario.value, T),
    }));
  }, [inputs, optionType]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-purple-400" size={20} />
          <h3 className="text-lg font-medium text-purple-400">
            Volatility Impact Analysis
          </h3>
        </div>

        <div className="h-[400px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="stockPrice"
                stroke="#6ee7b7"
                tickFormatter={(value) => value.toFixed(0)}
              />
              <YAxis
                stroke="#6ee7b7"
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #7c3aed",
                  borderRadius: "4px",
                }}
                itemStyle={{ color: "#6ee7b7" }}
                labelStyle={{ color: "#6ee7b7" }}
                formatter={(value) => [`$${value.toFixed(2)}`, ""]}
              />
              {volatilityScenarios.map((scenario) => (
                <Line
                  key={scenario.name}
                  type="monotone"
                  dataKey={scenario.name}
                  stroke={scenario.color}
                  strokeWidth={scenario.name === "Current Vol" ? 3 : 2}
                  strokeDasharray={
                    scenario.name === "Current Vol" ? "0" : "5 5"
                  }
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {vegaImpact.map((scenario) => (
            <div
              key={scenario.name}
              className="bg-gray-900 p-4 rounded border-l-4"
              style={{ borderLeftColor: scenario.color }}
            >
              <div className="text-sm text-gray-400">{scenario.name}</div>
              <div className="text-lg font-mono text-white">
                ${scenario.optionPrice.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                Vega: {scenario.vega.toFixed(4)}
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400 bg-gray-900 p-3 rounded mt-4">
          <strong>Volatility Scenarios:</strong> Higher volatility increases
          option prices because there's more chance of large price movements.
          Vega shows how much the option price changes per 1% volatility change.
        </div>
      </div>
    </div>
  );
};
