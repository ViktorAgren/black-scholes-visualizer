import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { blackScholes } from "../utils/blackScholes";
import { Info } from "lucide-react";

const formatNumber = (value, decimals = 4) => {
  const rounded =
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rounded.toFixed(decimals);
};

export const GreeksDisplay = ({ inputs, optionType, lockAxes = false }) => {

  const calculateGreeksAcrossPriceRange = useMemo(() => {
    const {
      S: currentStockPrice,
      K: strikePrice,
      r: riskFreeRate,
      sigma: volatility,
      T: timeToExpiration,
    } = inputs;
    const greeksDataPoints = [];
    const priceRange = Math.max(currentStockPrice * 0.6, 30);
    const dataPointCount = 100;
    const stepSize = priceRange / dataPointCount;

    for (
      let stockPrice = Math.max(currentStockPrice - priceRange, 0.1);
      stockPrice <= currentStockPrice + priceRange;
      stockPrice += stepSize
    ) {
      greeksDataPoints.push({
        stockPrice,
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
      });
    }
    return greeksDataPoints;
  }, [inputs, optionType]);

  const currentGreeks = useMemo(() => {
    const { S, K, r, sigma, T } = inputs;
    return {
      delta: blackScholes.delta(S, K, r, sigma, T, optionType),
      gamma: blackScholes.gamma(S, K, r, sigma, T),
      theta: blackScholes.theta(S, K, r, sigma, T, optionType),
      vega: blackScholes.vega(S, K, r, sigma, T),
      rho: blackScholes.rho(S, K, r, sigma, T, optionType),
    };
  }, [inputs, optionType]);

  const greekAxisInfo = useMemo(() => {
    if (calculateGreeksAcrossPriceRange.length === 0) return {};

    const generateNiceTickValues = (min, max, targetTicks = 6) => {
      if (min === max) return [min];
      
      const range = max - min;
      const roughStep = range / (targetTicks - 1);
      
      // Find the order of magnitude
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
      
      // Normalize the rough step
      const normalizedStep = roughStep / magnitude;
      
      // Find a nice step value
      let niceStep;
      if (normalizedStep <= 1) niceStep = 1;
      else if (normalizedStep <= 2) niceStep = 2;
      else if (normalizedStep <= 5) niceStep = 5;
      else niceStep = 10;
      
      const step = niceStep * magnitude;
      
      // Generate tick values
      const ticks = [];
      const start = Math.ceil(min / step) * step;
      
      for (let tick = start; tick <= max + step * 0.01; tick += step) {
        if (tick >= min - step * 0.01) {
          ticks.push(parseFloat(tick.toFixed(10))); // Avoid floating point precision issues
        }
      }
      
      return ticks.length > 0 ? ticks : [min, max];
    };

    const axisInfo = {};
    const greekKeys = ["delta", "gamma", "theta", "vega", "rho"];

    greekKeys.forEach((greek) => {
      const values = calculateGreeksAcrossPriceRange.map(
        (point) => point[greek],
      ).filter(v => isFinite(v) && !isNaN(v));
      
      if (values.length === 0) {
        axisInfo[greek] = { domain: [0, 1], ticks: [0, 0.5, 1], decimals: 2 };
        return;
      }

      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = Math.max((max - min) * 0.05, Math.abs(max) * 0.01);
      
      const domainMin = min - padding;
      const domainMax = max + padding;
      
      // Determine appropriate decimal places based on value range
      const range = domainMax - domainMin;
      let decimals = 2;
      if (range < 0.01) decimals = 4;
      else if (range < 0.1) decimals = 3;
      else if (range < 1) decimals = 2;
      else if (range < 10) decimals = 1;
      else decimals = 0;
      
      const ticks = generateNiceTickValues(domainMin, domainMax, 6);
      
      axisInfo[greek] = {
        domain: [domainMin, domainMax],
        ticks: ticks,
        decimals: decimals
      };
    });

    return axisInfo;
  }, [calculateGreeksAcrossPriceRange]);

  const greeksConfig = [
    {
      key: "delta",
      name: "Delta",
      color: "#059669",
      description:
        "Price sensitivity to $1 stock move. Close to 0.5 for ATM options.",
      interpretation:
        currentGreeks.delta > 0.7
          ? "High directional exposure"
          : currentGreeks.delta > 0.3
            ? "Moderate directional exposure"
            : "Low directional exposure",
    },
    {
      key: "gamma",
      name: "Gamma",
      color: "#dc2626",
      description:
        "How much Delta changes per $1 stock move. Highest for ATM options.",
      interpretation:
        currentGreeks.gamma > 0.05
          ? "High gamma risk - Delta very sensitive"
          : "Moderate gamma exposure",
    },
    {
      key: "theta",
      name: "Theta",
      color: "#4f46e5",
      description:
        "Daily time decay. Negative for long options (you lose money each day).",
      interpretation:
        Math.abs(currentGreeks.theta) > 0.1
          ? "High time decay - watch expiration"
          : "Low time decay",
    },
    {
      key: "vega",
      name: "Vega",
      color: "#eab308",
      description:
        "Sensitivity to 1% volatility change. Higher for longer-dated options.",
      interpretation:
        currentGreeks.vega > 0.2
          ? "High volatility sensitivity"
          : "Low volatility sensitivity",
    },
    {
      key: "rho",
      name: "Rho",
      color: "#ec4899",
      description:
        "Sensitivity to 1% interest rate change. Usually least important Greek.",
      interpretation:
        "Generally minimal impact unless rates change significantly",
    },
  ];

  return (
    <div className="space-y-8">
      {greeksConfig.map((greek) => (
        <div
          key={greek.key}
          className="border border-gray-800 rounded-lg p-6 bg-gray-900"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-green-400">
                {greek.name}
              </h3>
              <div className="group relative">
                <Info className="text-gray-400 cursor-help" size={16} />
                <div className="absolute left-0 top-6 w-80 bg-black border border-gray-700 rounded p-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {greek.description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono" style={{ color: greek.color }}>
                {formatNumber(currentGreeks[greek.key], 4)}
              </div>
              <div className="text-xs text-gray-400">
                {greek.interpretation}
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={calculateGreeksAcrossPriceRange}
                margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <ReferenceLine
                  x={inputs.S}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: "Current Price", position: "top" }}
                />
                <ReferenceLine
                  x={inputs.K}
                  stroke="#8b5cf6"
                  strokeDasharray="5 5"
                  label={{ value: "Strike", position: "top" }}
                />
                <XAxis
                  dataKey="stockPrice"
                  stroke="#6ee7b7"
                  label={{
                    value: "Stock Price",
                    position: "bottom",
                    offset: 20,
                    fill: "#6ee7b7",
                  }}
                  tickFormatter={(value) => value.toFixed(0)}
                />
                <YAxis
                  stroke="#6ee7b7"
                  label={{
                    value: greek.name,
                    angle: -90,
                    position: "insideLeft",
                    offset: -40,
                    fill: "#6ee7b7",
                    style: { textAnchor: "middle" },
                  }}
                  tickFormatter={(value) => {
                    const axisInfo = greekAxisInfo[greek.key];
                    const decimals = axisInfo ? axisInfo.decimals : 2;
                    return value.toFixed(decimals);
                  }}
                  domain={
                    greekAxisInfo[greek.key] ? greekAxisInfo[greek.key].domain : "auto"
                  }
                  ticks={
                    greekAxisInfo[greek.key] ? greekAxisInfo[greek.key].ticks : undefined
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: `1px solid ${greek.color}`,
                    borderRadius: "4px",
                  }}
                  itemStyle={{ color: "#6ee7b7" }}
                  labelStyle={{ color: "#6ee7b7" }}
                  formatter={(value) => [`${value.toFixed(4)}`, greek.name]}
                  labelFormatter={(value) =>
                    `Stock Price: $${value.toFixed(2)}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey={greek.key}
                  stroke={greek.color}
                  dot={false}
                  strokeWidth={3}
                />
                {!isNaN(currentGreeks[greek.key]) &&
                  isFinite(currentGreeks[greek.key]) && (
                    <ReferenceDot
                      x={inputs.S}
                      y={currentGreeks[greek.key]}
                      r={6}
                      fill={greek.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};
