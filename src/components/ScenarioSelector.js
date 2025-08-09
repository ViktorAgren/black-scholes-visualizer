import React, { useState } from "react";
import { BookOpen, TrendingUp, TrendingDown, Clock } from "lucide-react";

export const ScenarioSelector = ({ onScenarioSelect, currentInputs }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      id: "earnings-play",
      name: "Earnings Play",
      icon: TrendingUp,
      description: "High volatility before earnings, then volatility crush",
      story: "You bought options before earnings expecting a big move...",
      stages: [
        {
          name: "Pre-Earnings (High IV)",
          inputs: { ...currentInputs, sigma: 0.6, T: 7 / 365 },
          explanation:
            "Implied volatility is elevated before earnings announcement",
        },
        {
          name: "Post-Earnings (Vol Crush)",
          inputs: { ...currentInputs, sigma: 0.2, T: 6 / 365 },
          explanation:
            "Volatility collapses after earnings, even if stock moves as expected",
        },
        {
          name: "Week Later",
          inputs: { ...currentInputs, sigma: 0.2, T: 1 / 365 },
          explanation: "Time decay accelerates as expiration approaches",
        },
      ],
    },
    {
      id: "time-decay",
      name: "Time Decay Demo",
      icon: Clock,
      description: "Watch theta acceleration as expiration approaches",
      story: "You hold an at-the-money option as time passes...",
      stages: [
        {
          name: "30 Days Out",
          inputs: { ...currentInputs, T: 30 / 365 },
          explanation: "Plenty of time value remaining, theta is manageable",
        },
        {
          name: "7 Days Out",
          inputs: { ...currentInputs, T: 7 / 365 },
          explanation: "Time decay accelerates, especially for ATM options",
        },
        {
          name: "1 Day Out",
          inputs: { ...currentInputs, T: 1 / 365 },
          explanation:
            "Extreme time decay - option value approaches intrinsic value",
        },
      ],
    },
    {
      id: "gamma-scalping",
      name: "Gamma Scalping",
      icon: TrendingDown,
      description: "See how gamma changes with stock price movement",
      story: "You want to understand gamma risk near the strike...",
      stages: [
        {
          name: "ATM - High Gamma",
          inputs: { ...currentInputs, S: currentInputs.K },
          explanation:
            "At-the-money options have maximum gamma - delta changes rapidly",
        },
        {
          name: "ITM - Lower Gamma",
          inputs: { ...currentInputs, S: currentInputs.K + 10 },
          explanation:
            "In-the-money options have lower gamma - delta changes slowly",
        },
        {
          name: "OTM - Lower Gamma",
          inputs: { ...currentInputs, S: currentInputs.K - 10 },
          explanation: "Out-of-the-money options also have lower gamma",
        },
      ],
    },
    {
      id: "volatility-smile",
      name: "Volatility Impact",
      icon: BookOpen,
      description: "Compare option values across volatility levels",
      story:
        "Market volatility is changing - how does this affect your position?",
      stages: [
        {
          name: "Low Volatility (15%)",
          inputs: { ...currentInputs, sigma: 0.15 },
          explanation: "Low volatility environment - options are cheaper",
        },
        {
          name: "Normal Volatility (25%)",
          inputs: { ...currentInputs, sigma: 0.25 },
          explanation: "Normal market conditions",
        },
        {
          name: "High Volatility (50%)",
          inputs: { ...currentInputs, sigma: 0.5 },
          explanation: "Crisis/event-driven volatility - options are expensive",
        },
      ],
    },
    {
      id: "market-crash",
      name: "Market Crash Scenario",
      icon: TrendingDown,
      description:
        "How options behave during market stress and volatility spikes",
      story: "The market is crashing and volatility is exploding...",
      stages: [
        {
          name: "Normal Market",
          inputs: { ...currentInputs, sigma: 0.2, S: currentInputs.K },
          explanation: "Calm market conditions with normal volatility",
        },
        {
          name: "Market Stress",
          inputs: { ...currentInputs, sigma: 0.45, S: currentInputs.K - 10 },
          explanation:
            "Stock drops 10% and volatility doubles - put options surge",
        },
        {
          name: "Full Panic",
          inputs: { ...currentInputs, sigma: 0.8, S: currentInputs.K - 20 },
          explanation: "Stock down 20%, vol explodes - massive option premium",
        },
      ],
    },
    {
      id: "interest-rate-impact",
      name: "Interest Rate Changes",
      icon: TrendingUp,
      description: "How Rho affects options when interest rates change",
      story:
        "The Fed is changing interest rates - what happens to your options?",
      stages: [
        {
          name: "Low Rates (2%)",
          inputs: { ...currentInputs, r: 0.02, T: 1 },
          explanation: "Low interest rate environment - minimal Rho impact",
        },
        {
          name: "Normal Rates (5%)",
          inputs: { ...currentInputs, r: 0.05, T: 1 },
          explanation: "Normal interest rates - moderate Rho sensitivity",
        },
        {
          name: "High Rates (8%)",
          inputs: { ...currentInputs, r: 0.08, T: 1 },
          explanation:
            "High rates favor calls over puts - significant Rho impact",
        },
      ],
    },
    {
      id: "dividend-effect",
      name: "Ex-Dividend Impact",
      icon: BookOpen,
      description: "How stock price adjustments affect option values",
      story: "The stock is going ex-dividend tomorrow...",
      stages: [
        {
          name: "Before Ex-Dividend",
          inputs: { ...currentInputs, S: currentInputs.K + 2, T: 10 / 365 },
          explanation: "Stock trades higher ahead of dividend payment",
        },
        {
          name: "Ex-Dividend Day",
          inputs: { ...currentInputs, S: currentInputs.K, T: 9 / 365 },
          explanation:
            "Stock drops by dividend amount, strikes adjust accordingly",
        },
        {
          name: "Post Ex-Dividend",
          inputs: { ...currentInputs, S: currentInputs.K + 1, T: 8 / 365 },
          explanation: "Stock recovers partially, time decay continues",
        },
      ],
    },
    {
      id: "weekend-decay",
      name: "Weekend Time Decay",
      icon: Clock,
      description: "How options lose value over weekends",
      story:
        "Friday close to Monday open - time passes but market is closed...",
      stages: [
        {
          name: "Friday Close",
          inputs: { ...currentInputs, T: 7 / 365 },
          explanation: "End of trading week - one week to expiration",
        },
        {
          name: "Monday Open",
          inputs: { ...currentInputs, T: 5 / 365 },
          explanation:
            "Two calendar days passed but only business days matter for most options",
        },
        {
          name: "Wednesday",
          inputs: { ...currentInputs, T: 3 / 365 },
          explanation: "Mid-week - time decay accelerating rapidly",
        },
      ],
    },
    {
      id: "expiration-friday",
      name: "Expiration Friday",
      icon: Clock,
      description: "The final day of an option's life",
      story: "It's expiration Friday - your options expire at close...",
      stages: [
        {
          name: "Market Open (ITM)",
          inputs: { ...currentInputs, S: currentInputs.K + 5, T: 0.25 / 365 },
          explanation:
            "In-the-money option at market open - mostly intrinsic value",
        },
        {
          name: "Market Open (ATM)",
          inputs: { ...currentInputs, S: currentInputs.K, T: 0.25 / 365 },
          explanation: "At-the-money - maximum time value but rapidly decaying",
        },
        {
          name: "Market Open (OTM)",
          inputs: { ...currentInputs, S: currentInputs.K - 5, T: 0.25 / 365 },
          explanation: "Out-of-the-money - racing against time, needs big move",
        },
      ],
    },
    {
      id: "iv-rank",
      name: "Implied Volatility Rank",
      icon: TrendingUp,
      description: "Understanding when volatility is cheap vs expensive",
      story: "Learn to identify when options are cheap or expensive...",
      stages: [
        {
          name: "Low IV Rank (10th percentile)",
          inputs: { ...currentInputs, sigma: 0.12 },
          explanation:
            "Volatility in bottom 10% of annual range - options are cheap",
        },
        {
          name: "Medium IV Rank (50th percentile)",
          inputs: { ...currentInputs, sigma: 0.25 },
          explanation: "Average volatility conditions - fair value options",
        },
        {
          name: "High IV Rank (90th percentile)",
          inputs: { ...currentInputs, sigma: 0.45 },
          explanation: "Volatility in top 10% of range - options are expensive",
        },
      ],
    },
  ];

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
    onScenarioSelect(scenario.stages[0].inputs);
  };

  const handleStageClick = (stage) => {
    onScenarioSelect(stage.inputs);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="text-indigo-400" size={20} />
        <h3 className="text-lg font-medium text-indigo-400">
          Educational Scenarios
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
        {scenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario)}
              className={`text-left p-4 rounded border-2 transition-all ${
                selectedScenario?.id === scenario.id
                  ? "border-indigo-500 bg-gray-700"
                  : "border-gray-700 bg-gray-900 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="text-indigo-400" size={18} />
                <div className="font-medium text-indigo-400">
                  {scenario.name}
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {scenario.description}
              </div>
              <div className="text-xs text-gray-500 italic">
                {scenario.story}
              </div>
            </button>
          );
        })}
      </div>

      {selectedScenario && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">
            {selectedScenario.name} - Stages
          </h4>
          <div className="space-y-2">
            {selectedScenario.stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => handleStageClick(stage)}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">
                      {stage.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {stage.explanation}
                    </div>
                  </div>
                  <div className="text-xs text-indigo-400">
                    Stage {index + 1}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-400 bg-gray-900 p-3 rounded mt-4">
        <strong>How to use:</strong> Click on a scenario to see how Greeks
        behave in real-world situations. Each stage shows different market
        conditions and explains what's happening to your position.
      </div>
    </div>
  );
};
