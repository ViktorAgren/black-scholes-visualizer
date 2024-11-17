import React, { useState } from 'react';
import { Terminal } from './components/Terminal';
import { PriceChart } from './components/PriceChart';
import { GreeksDisplay } from './components/GreeksDisplay';

function App() {
  const [inputs, setInputs] = useState({
    S: 100,    // Stock price
    K: 100,    // Strike price
    r: 0.05,   // Risk-free rate
    sigma: 0.2, // Volatility
    T: 1       // Time to expiration
  });
  const [optionType, setOptionType] = useState('call');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Black-Scholes Option Calculator
          </h1>
          <p className="text-gray-400 mt-2">
            Interactive visualization of option pricing and Greeks
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-lg shadow-xl">
            <Terminal 
              inputs={inputs} 
              setInputs={setInputs}
              optionType={optionType}
              setOptionType={setOptionType}
            />
          </div>
          <div className="bg-gray-900 rounded-lg shadow-xl">
            <PriceChart 
              inputs={inputs} 
              optionType={optionType} 
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            Greeks Analysis
          </h2>
          <GreeksDisplay 
            inputs={inputs} 
            optionType={optionType} 
          />
        </div>

        <footer className="text-center text-gray-400 text-sm">
          <p>Built with React and Recharts • Source code available on GitHub</p>
        </footer>
      </div>
    </div>
  );
}

export default App;