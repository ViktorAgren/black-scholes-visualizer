import React, { useState, useEffect } from 'react';
import { blackScholes } from '../utils/blackScholes';
import { Terminal as TerminalIcon, Activity } from 'lucide-react';

export const Terminal = () => {
  const [inputs, setInputs] = useState({
    S: 100,    // Stock price
    K: 100,    // Strike price
    r: 0.05,   // Risk-free rate
    sigma: 0.2, // Volatility
    T: 1       // Time to expiration
  });

  const [optionType, setOptionType] = useState('call');
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateOption();
  }, [inputs, optionType]);

  const calculateOption = () => {
    const { S, K, r, sigma, T } = inputs;
    const price = optionType === 'call' 
      ? blackScholes.callPrice(S, K, r, sigma, T)
      : blackScholes.putPrice(S, K, r, sigma, T);

    const greeks = {
      delta: blackScholes.delta(S, K, r, sigma, T, optionType),
      gamma: blackScholes.gamma(S, K, r, sigma, T),
      theta: blackScholes.theta(S, K, r, sigma, T, optionType),
      vega: blackScholes.vega(S, K, r, sigma, T),
      rho: blackScholes.rho(S, K, r, sigma, T, optionType)
    };

    setResults({ price, greeks });
  };

  return (
    <div className="font-mono">
      <div className="border border-green-900 p-4 bg-black text-green-500">
        <div className="flex items-center gap-2 mb-4">
          <TerminalIcon size={14} />
          <span className="text-xs">BLACK_SCHOLES_CALCULATOR</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-xs">{key.toUpperCase()}:</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value)
                  }))}
                  className="w-full bg-black border border-green-900 p-2 text-white"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-xs">OPTION TYPE:</label>
              <select
                value={optionType}
                onChange={(e) => setOptionType(e.target.value)}
                className="w-full bg-black border border-green-900 p-2 text-white"
              >
                <option value="call">CALL</option>
                <option value="put">PUT</option>
              </select>
            </div>
          </div>

          <div className="border border-green-900 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} />
              <span className="text-xs">RESULTS</span>
            </div>
            {results && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>PRICE:</span>
                  <span className="text-white">${results.price.toFixed(2)}</span>
                </div>
                {Object.entries(results.greeks).map(([greek, value]) => (
                  <div key={greek} className="flex justify-between">
                    <span>{greek.toUpperCase()}:</span>
                    <span className="text-white">{value.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};