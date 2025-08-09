import React from "react";
import { blackScholes } from "../utils/blackScholes";
import { Terminal as TerminalIcon, Activity } from "lucide-react";

const formatNumber = (value, decimals = 4) => {
  const rounded =
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rounded.toFixed(decimals);
};

export const Terminal = ({ inputs, setInputs, optionType, setOptionType }) => {
  const inputConfig = {
    S: { label: "Stock Price", symbol: "$", step: 1, decimals: 2 },
    K: { label: "Strike Price", symbol: "$", step: 1, decimals: 2 },
    r: { label: "Risk-Free Rate", symbol: "%", step: 0.25, decimals: 2, multiplier: 100 },
    sigma: { label: "Volatility", symbol: "%", step: 1, decimals: 1, multiplier: 100 },
    T: { label: "Time to Expiry", symbol: "years", step: 0.1, decimals: 2 },
  };

  const calculateOptionMetrics = () => {
    const {
      S: stockPrice,
      K: strikePrice,
      r: riskFreeRate,
      sigma: volatility,
      T: timeToExpiration,
    } = inputs;

    const optionPrice =
      optionType === "call"
        ? blackScholes.callPrice(
            stockPrice,
            strikePrice,
            riskFreeRate,
            volatility,
            timeToExpiration,
          )
        : blackScholes.putPrice(
            stockPrice,
            strikePrice,
            riskFreeRate,
            volatility,
            timeToExpiration,
          );

    const optionGreeks = {
      delta: blackScholes.delta(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
        optionType,
      ),
      gamma: blackScholes.gamma(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
      ),
      theta: blackScholes.theta(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
        optionType,
      ),
      vega: blackScholes.vega(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
      ),
      rho: blackScholes.rho(
        stockPrice,
        strikePrice,
        riskFreeRate,
        volatility,
        timeToExpiration,
        optionType,
      ),
    };

    return { price: optionPrice, greeks: optionGreeks };
  };

  const handleInputChange = (key, value) => {
    let newValue = parseFloat(value) || 0;
    
    // Convert percentage inputs back to decimal
    if (key === 'r' || key === 'sigma') {
      newValue = newValue / 100;
    }

    // Apply validation constraints
    if (key === "S" || key === "K") {
      newValue = Math.max(0.01, newValue);
    } else if (key === "sigma") {
      newValue = Math.max(0.001, Math.min(5, newValue));
    } else if (key === "r") {
      newValue = Math.max(-0.1, Math.min(1, newValue));
    } else if (key === "T") {
      newValue = Math.max(0.001, Math.min(10, newValue));
    }

    setInputs((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const getDisplayValue = (key, value) => {
    const config = inputConfig[key];
    if (config.multiplier) {
      return (value * config.multiplier).toFixed(config.decimals);
    }
    return value.toFixed(config.decimals);
  };

  const calculationResults = calculateOptionMetrics();

  return (
    <div className="font-mono">
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <TerminalIcon className="text-green-400" size={16} />
            <span className="text-sm font-medium text-green-400">
              BLACK_SCHOLES_CALCULATOR
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, value]) => {
                const config = inputConfig[key];
                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {config.label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={getDisplayValue(key, value)}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 pr-12 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        step={config.step}
                        placeholder={getDisplayValue(key, value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">{config.symbol}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Option Type
                </label>
                <select
                  value={optionType}
                  onChange={(e) => setOptionType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="call">Call</option>
                  <option value="put">Put</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-green-400" size={16} />
                <span className="text-sm font-medium text-green-400">
                  RESULTS
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">PRICE:</span>
                  <span className="text-white font-mono">
                    ${formatNumber(calculationResults.price, 2)}
                  </span>
                </div>
                {Object.entries(calculationResults.greeks).map(
                  ([greek, value]) => (
                    <div key={greek} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {greek.toUpperCase()}:
                      </span>
                      <span className="text-white font-mono">
                        {formatNumber(value, 4)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
