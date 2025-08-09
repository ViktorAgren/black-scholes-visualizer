import React, { useState, useMemo } from "react";
import { Plus, Minus, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { blackScholes } from "../utils/blackScholes";

const formatNumber = (value, decimals = 4) => {
  const rounded =
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rounded.toFixed(decimals);
};

export const StrategyBuilder = ({ baseInputs }) => {
  const [legs, setLegs] = useState([
    {
      id: 1,
      optionType: "call",
      strike: baseInputs.K,
      quantity: 1,
      action: "buy",
    },
  ]);

  const [strategyParams, setStrategyParams] = useState({
    S: baseInputs.S,
    r: baseInputs.r,
    sigma: baseInputs.sigma,
    T: baseInputs.T,
  });

  const presetStrategies = [
    {
      name: "Long Straddle",
      description: "Buy call + Buy put at same strike (volatility play)",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K,
          quantity: 1,
          action: "buy",
        },
        { optionType: "put", strike: baseInputs.K, quantity: 1, action: "buy" },
      ],
    },
    {
      name: "Short Straddle",
      description: "Sell call + Sell put at same strike (collect premium)",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "put",
          strike: baseInputs.K,
          quantity: 1,
          action: "sell",
        },
      ],
    },
    {
      name: "Long Strangle",
      description: "Buy OTM call + Buy OTM put (cheaper volatility play)",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "put",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Bull Call Spread",
      description: "Buy lower strike call + Sell higher strike call",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "sell",
        },
      ],
    },
    {
      name: "Bear Put Spread",
      description: "Buy higher strike put + Sell lower strike put",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "put",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "sell",
        },
      ],
    },
    {
      name: "Bull Put Spread",
      description: "Sell higher strike put + Buy lower strike put",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "put",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Bear Call Spread",
      description: "Sell lower strike call + Buy higher strike call",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Iron Condor",
      description: "Sell ATM straddle + Buy protective wings",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K - 10,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "put",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 10,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Iron Butterfly",
      description: "Sell ATM straddle + Buy equidistant wings",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K - 10,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "put",
          strike: baseInputs.K,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 10,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Protective Put",
      description: "Long stock + Long put (insurance strategy)",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Covered Call",
      description: "Long stock + Short call (income strategy)",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "sell",
        },
      ],
    },
    {
      name: "Collar",
      description: "Long stock + Long put + Short call",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K - 5,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "sell",
        },
      ],
    },
    {
      name: "Calendar Spread",
      description: "Sell short-term + Buy long-term same strike",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Jade Lizard",
      description: "Short put + Short call spread (high probability)",
      legs: [
        {
          optionType: "put",
          strike: baseInputs.K - 10,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 5,
          quantity: 1,
          action: "sell",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 15,
          quantity: 1,
          action: "buy",
        },
      ],
    },
    {
      name: "Ratio Call Spread",
      description: "Buy 1 call + Sell 2 higher strike calls",
      legs: [
        {
          optionType: "call",
          strike: baseInputs.K,
          quantity: 1,
          action: "buy",
        },
        {
          optionType: "call",
          strike: baseInputs.K + 10,
          quantity: 2,
          action: "sell",
        },
      ],
    },
  ];

  const addLeg = () => {
    const newLeg = {
      id: Date.now(),
      optionType: "call",
      strike: baseInputs.K,
      quantity: 1,
      action: "buy",
    };
    setLegs([...legs, newLeg]);
  };

  const removeLeg = (id) => {
    setLegs(legs.filter((leg) => leg.id !== id));
  };

  const updateLeg = (id, field, value) => {
    setLegs(
      legs.map((leg) => (leg.id === id ? { ...leg, [field]: value } : leg)),
    );
  };

  const loadPresetStrategy = (strategy) => {
    const newLegs = strategy.legs.map((leg, index) => ({
      id: Date.now() + index,
      ...leg,
    }));
    setLegs(newLegs);
  };

  const calculateStrategyPayoffProfile = useMemo(() => {
    const {
      S: currentStockPrice,
      r: riskFreeRate,
      sigma: volatility,
      T: timeToExpiration,
    } = strategyParams;

    // Validate parameters
    if (
      !currentStockPrice ||
      currentStockPrice <= 0 ||
      !volatility ||
      volatility <= 0 ||
      !timeToExpiration ||
      timeToExpiration <= 0 ||
      riskFreeRate < 0
    ) {
      return [];
    }

    // Calculate initial cost of the strategy
    let initialCost = 0;
    legs.forEach((leg) => {
      if (!leg.strike || leg.strike <= 0 || !leg.quantity) return;

      const multiplier = leg.action === "buy" ? -1 : 1; // Buy costs money, sell gives money
      const initialPrice =
        leg.optionType === "call"
          ? blackScholes.callPrice(
              currentStockPrice,
              leg.strike,
              riskFreeRate,
              volatility,
              timeToExpiration,
            )
          : blackScholes.putPrice(
              currentStockPrice,
              leg.strike,
              riskFreeRate,
              volatility,
              timeToExpiration,
            );

      initialCost += multiplier * initialPrice * leg.quantity;
    });

    const data = [];
    const priceRange = Math.max(currentStockPrice * 0.6, 30);
    const dataPointCount = 100;
    const stepSize = priceRange / dataPointCount;

    for (
      let stockPrice = Math.max(currentStockPrice - priceRange, 0.01);
      stockPrice <= currentStockPrice + priceRange;
      stockPrice += stepSize
    ) {
      let totalValue = 0;
      let totalDelta = 0;
      let totalGamma = 0;
      let totalTheta = 0;
      let totalVega = 0;

      let hasValidData = true;

      legs.forEach((leg) => {
        if (!leg.strike || leg.strike <= 0 || !leg.quantity) {
          hasValidData = false;
          return;
        }

        const multiplier = leg.action === "buy" ? 1 : -1;

        try {
          const optionPrice =
            leg.optionType === "call"
              ? blackScholes.callPrice(
                  stockPrice,
                  leg.strike,
                  riskFreeRate,
                  volatility,
                  timeToExpiration,
                )
              : blackScholes.putPrice(
                  stockPrice,
                  leg.strike,
                  riskFreeRate,
                  volatility,
                  timeToExpiration,
                );

          const delta = blackScholes.delta(
            stockPrice,
            leg.strike,
            riskFreeRate,
            volatility,
            timeToExpiration,
            leg.optionType,
          );
          const gamma = blackScholes.gamma(
            stockPrice,
            leg.strike,
            riskFreeRate,
            volatility,
            timeToExpiration,
          );
          const theta = blackScholes.theta(
            stockPrice,
            leg.strike,
            riskFreeRate,
            volatility,
            timeToExpiration,
            leg.optionType,
          );
          const vega = blackScholes.vega(
            stockPrice,
            leg.strike,
            riskFreeRate,
            volatility,
            timeToExpiration,
          );

          // Validate calculations
          if (
            isNaN(optionPrice) ||
            isNaN(delta) ||
            isNaN(gamma) ||
            isNaN(theta) ||
            isNaN(vega) ||
            !isFinite(optionPrice) ||
            !isFinite(delta) ||
            !isFinite(gamma) ||
            !isFinite(theta) ||
            !isFinite(vega)
          ) {
            hasValidData = false;
            return;
          }

          totalValue += multiplier * optionPrice * leg.quantity;
          totalDelta += multiplier * delta * leg.quantity;
          totalGamma += multiplier * gamma * leg.quantity;
          totalTheta += multiplier * theta * leg.quantity;
          totalVega += multiplier * vega * leg.quantity;
        } catch (error) {
          hasValidData = false;
          return;
        }
      });

      if (hasValidData) {
        data.push({
          stockPrice,
          totalValue: totalValue + initialCost, // Add initial cost to get P&L
          totalDelta,
          totalGamma,
          totalTheta,
          totalVega,
        });
      }
    }
    return data;
  }, [legs, strategyParams]);

  const currentMetrics = useMemo(() => {
    const currentData = calculateStrategyPayoffProfile.find(
      (point) => Math.abs(point.stockPrice - strategyParams.S) < 1,
    );
    return (
      currentData || {
        totalValue: 0,
        totalDelta: 0,
        totalGamma: 0,
        totalTheta: 0,
        totalVega: 0,
      }
    );
  }, [calculateStrategyPayoffProfile, strategyParams.S]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="text-orange-400" size={20} />
            <h3 className="text-lg font-medium text-orange-400">
              Options Strategy Builder
            </h3>
          </div>
          <button
            onClick={addLeg}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition-colors"
          >
            <Plus size={16} />
            Add Leg
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 max-h-96 overflow-y-auto">
          {presetStrategies.map((strategy) => (
            <button
              key={strategy.name}
              onClick={() => loadPresetStrategy(strategy)}
              className="text-left p-3 bg-gray-900 hover:bg-gray-700 rounded border border-gray-700 transition-colors"
            >
              <div className="font-medium text-orange-400">{strategy.name}</div>
              <div className="text-sm text-gray-400 mt-1">
                {strategy.description}
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-4">
            Strategy Parameters
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Stock Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={strategyParams.S.toFixed(2)}
                  onChange={(e) => {
                    const newValue = Math.max(
                      0.01,
                      parseFloat(e.target.value) || 0.01,
                    );
                    setStrategyParams((prev) => ({
                      ...prev,
                      S: newValue,
                    }));
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 pr-8 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="1"
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 text-xs">$</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Risk-Free Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={(strategyParams.r * 100).toFixed(2)}
                  onChange={(e) => {
                    let newValue = parseFloat(e.target.value) || 0;
                    newValue = Math.max(-10, Math.min(100, newValue)) / 100;
                    setStrategyParams((prev) => ({
                      ...prev,
                      r: newValue,
                    }));
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 pr-8 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.25"
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 text-xs">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Volatility
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={(strategyParams.sigma * 100).toFixed(1)}
                  onChange={(e) => {
                    let newValue = parseFloat(e.target.value) || 0.1;
                    newValue = Math.max(0.1, Math.min(500, newValue)) / 100;
                    setStrategyParams((prev) => ({
                      ...prev,
                      sigma: newValue,
                    }));
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 pr-8 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="1"
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 text-xs">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Time to Expiry
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={strategyParams.T.toFixed(2)}
                  onChange={(e) => {
                    const newValue = Math.max(
                      0.001,
                      Math.min(10, parseFloat(e.target.value) || 0.001),
                    );
                    setStrategyParams((prev) => ({
                      ...prev,
                      T: newValue,
                    }));
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 pr-12 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 text-xs">years</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {legs.map((leg, index) => (
            <div
              key={leg.id}
              className="flex items-center gap-3 p-3 bg-gray-900 rounded"
            >
              <span className="text-gray-400 w-8">#{index + 1}</span>

              <select
                value={leg.action}
                onChange={(e) => updateLeg(leg.id, "action", e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>

              <input
                type="number"
                value={leg.quantity}
                onChange={(e) =>
                  updateLeg(leg.id, "quantity", parseInt(e.target.value) || 1)
                }
                className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                min="1"
              />

              <select
                value={leg.optionType}
                onChange={(e) =>
                  updateLeg(leg.id, "optionType", e.target.value)
                }
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>

              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm">@</span>
                <div className="relative">
                  <input
                    type="number"
                    value={leg.strike.toFixed(2)}
                    onChange={(e) =>
                      updateLeg(
                        leg.id,
                        "strike",
                        parseFloat(e.target.value) || baseInputs.K,
                      )
                    }
                    className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 pr-4 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="1"
                  />
                  <span className="absolute inset-y-0 right-1 flex items-center text-gray-400 text-xs">$</span>
                </div>
              </div>

              {legs.length > 1 && (
                <button
                  onClick={() => removeLeg(leg.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 mt-6 p-4 bg-gray-900 rounded">
          <div className="text-center">
            <div className="text-sm text-gray-400">P&L</div>
            <div
              className={`text-lg font-mono ${currentMetrics.totalValue >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              ${formatNumber(currentMetrics.totalValue, 2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Portfolio Delta</div>
            <div className="text-lg font-mono text-green-400">
              {formatNumber(currentMetrics.totalDelta, 4)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Portfolio Gamma</div>
            <div className="text-lg font-mono text-red-400">
              {formatNumber(currentMetrics.totalGamma, 4)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Portfolio Theta</div>
            <div className="text-lg font-mono text-blue-400">
              {formatNumber(currentMetrics.totalTheta, 4)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Portfolio Vega</div>
            <div className="text-lg font-mono text-yellow-400">
              {formatNumber(currentMetrics.totalVega, 4)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-medium text-orange-400 mb-4">
          Strategy Payoff Profile
        </h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={calculateStrategyPayoffProfile}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
              <ReferenceLine
                x={strategyParams.S}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{ value: "Current", position: "top" }}
              />
              {legs.map((leg) => (
                <ReferenceLine
                  key={leg.id}
                  x={leg.strike}
                  stroke="#8b5cf6"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              ))}
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
                  border: "1px solid #f97316",
                  borderRadius: "4px",
                }}
                itemStyle={{ color: "#6ee7b7" }}
                labelStyle={{ color: "#6ee7b7" }}
                formatter={(value) => [`$${value.toFixed(2)}`, "P&L"]}
                labelFormatter={(value) => `Stock Price: $${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="totalValue"
                stroke="#f97316"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
