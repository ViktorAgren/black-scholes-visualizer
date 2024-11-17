import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { blackScholes } from '../utils/blackScholes';

export const GreeksDisplay = ({ inputs, optionType }) => {
  const generateGreeksData = useMemo(() => {
    const { K, r, sigma, T } = inputs;
    const data = [];
    const currentPrice = inputs.S;
    const range = currentPrice * 0.5;

    for (let S = currentPrice - range; S <= currentPrice + range; S += range / 50) {
      data.push({
        stockPrice: S,
        delta: blackScholes.delta(S, K, r, sigma, T, optionType),
        gamma: blackScholes.gamma(S, K, r, sigma, T),
        theta: blackScholes.theta(S, K, r, sigma, T, optionType),
        vega: blackScholes.vega(S, K, r, sigma, T),
        rho: blackScholes.rho(S, K, r, sigma, T, optionType)
      });
    }
    return data;
  }, [inputs, optionType]);

  const greeksConfig = [
    { key: 'delta', name: 'Delta', color: '#059669' },
    { key: 'gamma', name: 'Gamma', color: '#dc2626' },
    { key: 'theta', name: 'Theta', color: '#4f46e5' },
    { key: 'vega', name: 'Vega', color: '#eab308' },
    { key: 'rho', name: 'Rho', color: '#ec4899' }
  ];

  return (
    <div className="space-y-8"> {/* Increased spacing between charts */}
      {greeksConfig.map(greek => (
        <div key={greek.key} className="border border-gray-800 rounded-lg p-6 bg-gray-900">
          <h3 className="text-lg font-medium text-green-400 mb-4">{greek.name}</h3>
          <div className="h-[300px]"> {/* Increased height for better visibility */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={generateGreeksData}
                margin={{ top: 20, right: 30, left: 60, bottom: 40 }} // Increased margins
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis 
                  dataKey="stockPrice" 
                  stroke="#6ee7b7"
                  label={{ 
                    value: 'Stock Price', 
                    position: 'bottom', 
                    offset: 20, // Increased offset
                    fill: '#6ee7b7' 
                  }}
                />
                <YAxis 
                  stroke="#6ee7b7"
                  label={{ 
                    value: greek.name, 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -40, // Adjusted offset
                    fill: '#6ee7b7',
                    style: { textAnchor: 'middle' }
                  }}
                  tickFormatter={(value) => value.toFixed(2)} // Format tick values
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #059669',
                    borderRadius: '4px'
                  }}
                  itemStyle={{ color: '#6ee7b7' }}
                  labelStyle={{ color: '#6ee7b7' }}
                  formatter={(value) => value.toFixed(4)} // Format tooltip values
                />
                <Line 
                  type="monotone" 
                  dataKey={greek.key} 
                  stroke={greek.color} 
                  dot={false}
                  strokeWidth={2} // Increased line thickness
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};