import React, { useState, useEffect } from "react";
import { Calendar, Play, Pause } from "lucide-react";

export const TimeSlider = ({
  timeToExpiration,
  onTimeChange,
  onAnimationChange,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationId, setAnimationId] = useState(null);

  const timeScenarios = [
    { days: 90, label: "3 months", value: 90 / 365 },
    { days: 60, label: "2 months", value: 60 / 365 },
    { days: 30, label: "1 month", value: 30 / 365 },
    { days: 14, label: "2 weeks", value: 14 / 365 },
    { days: 7, label: "1 week", value: 7 / 365 },
    { days: 3, label: "3 days", value: 3 / 365 },
    { days: 1, label: "1 day", value: 1 / 365 },
  ];

  const currentDays = Math.round(timeToExpiration * 365);

  useEffect(() => {
    return () => {
      if (animationId) {
        clearInterval(animationId);
      }
    };
  }, [animationId]);

  const handleSliderChange = (e) => {
    const days = parseInt(e.target.value);
    onTimeChange(days / 365);
  };

  const startAnimation = () => {
    if (isAnimating) {
      clearInterval(animationId);
      setIsAnimating(false);
      setAnimationId(null);
      onAnimationChange?.(false);
      return;
    }

    setIsAnimating(true);
    onAnimationChange?.(true);

    // Create a closure that captures the current time and decrements from there
    let currentTimeInDays = Math.round(timeToExpiration * 365);

    const id = setInterval(() => {
      currentTimeInDays -= 1;

      if (currentTimeInDays <= 1) {
        clearInterval(id);
        setIsAnimating(false);
        setAnimationId(null);
        onTimeChange(1 / 365);
        onAnimationChange?.(false);
        return;
      }

      onTimeChange(currentTimeInDays / 365);
    }, 200);
    setAnimationId(id);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-400" size={20} />
          <h3 className="text-lg font-medium text-blue-400">
            Time to Expiration
          </h3>
        </div>
        <button
          onClick={startAnimation}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors"
        >
          {isAnimating ? <Pause size={16} /> : <Play size={16} />}
          {isAnimating ? "Pause" : "Animate Time Decay"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Current: {currentDays} days</span>
          <span className="text-blue-400 font-mono">
            {timeToExpiration.toFixed(4)} years
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="90"
          value={currentDays}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #dc2626 0%, #eab308 50%, #059669 100%)`,
          }}
        />

        <div className="grid grid-cols-4 gap-2">
          {timeScenarios.map((scenario) => (
            <button
              key={scenario.days}
              onClick={() => onTimeChange(scenario.value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(currentDays - scenario.days) <= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-400 bg-gray-900 p-3 rounded">
        <strong>Time Decay Impact:</strong> Watch how Theta accelerates as
        expiration approaches. Options lose value fastest in the final weeks,
        especially at-the-money options.
      </div>
    </div>
  );
};
