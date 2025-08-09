import React, { useState } from "react";
import { Terminal } from "./components/Terminal";
import { PriceChart } from "./components/PriceChart";
import { GreeksDisplay } from "./components/GreeksDisplay";
import { StrategyBuilder } from "./components/StrategyBuilder";

function App() {
  const [inputs, setInputs] = useState({
    S: 100,
    K: 100,
    r: 0.05,
    sigma: 0.2,
    T: 1,
  });
  const [optionType, setOptionType] = useState("call");
  const [activeTab, setActiveTab] = useState("single");

  const tabs = [
    { id: "single", label: "Single Option" },
    { id: "strategies", label: "Strategies" },
  ];

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

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "single" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-900 rounded-lg shadow-xl">
                <Terminal
                  inputs={inputs}
                  setInputs={setInputs}
                  optionType={optionType}
                  setOptionType={setOptionType}
                />
              </div>
              <div className="bg-gray-900 rounded-lg shadow-xl">
                <PriceChart inputs={inputs} optionType={optionType} />
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-green-400">
                Greeks Analysis
              </h2>
              <GreeksDisplay inputs={inputs} optionType={optionType} />
            </div>
          </>
        )}

        {activeTab === "strategies" && (
          <div className="mb-12">
            <StrategyBuilder baseInputs={inputs} />
          </div>
        )}

        <footer className="text-center text-gray-400 text-sm">
          <p>
            Built with React and Recharts • Advanced Options Analytics •
            Educational Tool
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
