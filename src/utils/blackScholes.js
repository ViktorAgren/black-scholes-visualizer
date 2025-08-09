import { erf } from "mathjs";

const SQRT_2PI = Math.sqrt(2 * Math.PI);
const SQRT_2 = Math.sqrt(2);
const DAYS_PER_YEAR = 365;
const PERCENT_DIVISOR = 100;

const normalCdf = (x) => {
  // Handle extreme values and invalid inputs
  if (!isFinite(x) || isNaN(x)) return 0.5;
  if (x < -10) return 0;
  if (x > 10) return 1;
  return (1 + erf(x / SQRT_2)) / 2;
};

const standardNormalPdf = (x) => Math.exp((-x * x) / 2) / SQRT_2PI;

const calculateD1 = (
  stockPrice,
  strikePrice,
  riskFreeRate,
  volatility,
  timeToExpiration,
) => {
  // Validate inputs
  if (
    !isFinite(stockPrice) ||
    !isFinite(strikePrice) ||
    !isFinite(volatility) ||
    !isFinite(timeToExpiration) ||
    !isFinite(riskFreeRate) ||
    stockPrice <= 0 ||
    strikePrice <= 0 ||
    volatility <= 0 ||
    timeToExpiration <= 0
  ) {
    return 0; // Return safe default for invalid inputs
  }

  const numerator =
    Math.log(stockPrice / strikePrice) +
    (riskFreeRate + volatility ** 2 / 2) * timeToExpiration;
  const denominator = volatility * Math.sqrt(timeToExpiration);

  const result = numerator / denominator;
  return isFinite(result) ? result : 0;
};

const calculateD2 = (
  stockPrice,
  strikePrice,
  riskFreeRate,
  volatility,
  timeToExpiration,
) => {
  return (
    calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    ) -
    volatility * Math.sqrt(timeToExpiration)
  );
};

export const blackScholes = {
  d1: calculateD1,
  d2: calculateD2,
  N: normalCdf,

  callPrice: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
  ) => {
    const d1 = calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const d2 = calculateD2(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const discountFactor = Math.exp(-riskFreeRate * timeToExpiration);

    return (
      stockPrice * normalCdf(d1) - strikePrice * discountFactor * normalCdf(d2)
    );
  },

  putPrice: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
  ) => {
    const d1 = calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const d2 = calculateD2(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const discountFactor = Math.exp(-riskFreeRate * timeToExpiration);

    return (
      strikePrice * discountFactor * normalCdf(-d2) -
      stockPrice * normalCdf(-d1)
    );
  },

  delta: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
    optionType,
  ) => {
    const d1 = calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    return optionType === "call" ? normalCdf(d1) : normalCdf(d1) - 1;
  },

  gamma: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
  ) => {
    const d1 = calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    return (
      standardNormalPdf(d1) /
      (stockPrice * volatility * Math.sqrt(timeToExpiration))
    );
  },

  theta: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
    optionType,
  ) => {
    const d1 = calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const d2 = calculateD2(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const discountFactor = Math.exp(-riskFreeRate * timeToExpiration);
    const timeDecayComponent =
      (-stockPrice * volatility * standardNormalPdf(d1)) /
      (2 * Math.sqrt(timeToExpiration));

    const interestComponent =
      optionType === "call"
        ? -riskFreeRate * strikePrice * discountFactor * normalCdf(d2)
        : riskFreeRate * strikePrice * discountFactor * normalCdf(-d2);

    return (timeDecayComponent + interestComponent) / DAYS_PER_YEAR;
  },

  vega: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
  ) => {
    const d1 = calculateD1(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    return (
      (stockPrice * Math.sqrt(timeToExpiration) * standardNormalPdf(d1)) /
      PERCENT_DIVISOR
    );
  },

  rho: (
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToExpiration,
    optionType,
  ) => {
    const d2 = calculateD2(
      stockPrice,
      strikePrice,
      riskFreeRate,
      volatility,
      timeToExpiration,
    );
    const discountFactor = Math.exp(-riskFreeRate * timeToExpiration);
    const rhoBasis = strikePrice * timeToExpiration * discountFactor;

    const rhoValue =
      optionType === "call"
        ? rhoBasis * normalCdf(d2)
        : -rhoBasis * normalCdf(-d2);

    return rhoValue / PERCENT_DIVISOR;
  },
};
