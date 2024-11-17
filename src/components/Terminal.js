import React from 'react';
import { blackScholes } from '../utils/blackScholes';
import { Terminal as TerminalIcon, Activity } from 'lucide-react';

export const Terminal = ({ inputs, setInputs, optionType, setOptionType }) => {
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

    return { price, greeks };
  };

  const results = calculateOption();

  return (
    <div className="font-mono">
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <TerminalIcon className="text-green-400" size={16} />
            <span className="text-sm font-medium text-green-400">BLACK_SCHOLES_CALCULATOR</span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300">
                    {key.toUpperCase()}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      [key]: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step={key === 'sigma' || key === 'r' ? '0.01' : '1'}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  OPTION TYPE:
                </label>
                <select
                  value={optionType}
                  onChange={(e) => setOptionType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="call">CALL</option>
                  <option value="put">PUT</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-green-400" size={16} />
                <span className="text-sm font-medium text-green-400">RESULTS</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">PRICE:</span>
                  <span className="text-white font-mono">${results.price.toFixed(2)}</span>
                </div>
                {Object.entries(results.greeks).map(([greek, value]) => (
                  <div key={greek} className="flex justify-between text-sm">
                    <span className="text-gray-400">{greek.toUpperCase()}:</span>
                    <span className="text-white font-mono">{value.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};