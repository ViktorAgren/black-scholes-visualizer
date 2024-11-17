import { erf } from 'mathjs';

export const blackScholes = {
  // Calculate d1 and d2 parameters
  d1: (S, K, r, sigma, T) => {
    return (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
  },
  d2: (S, K, r, sigma, T) => {
    return (Math.log(S / K) + (r - sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
  },

  // Normal CDF function
  N: (x) => {
    return (1 + erf(x / Math.sqrt(2))) / 2;
  },

  // Call option price
  callPrice: (S, K, r, sigma, T) => {
    const d1 = blackScholes.d1(S, K, r, sigma, T);
    const d2 = blackScholes.d2(S, K, r, sigma, T);
    return S * blackScholes.N(d1) - K * Math.exp(-r * T) * blackScholes.N(d2);
  },

  // Put option price
  putPrice: (S, K, r, sigma, T) => {
    const d1 = blackScholes.d1(S, K, r, sigma, T);
    const d2 = blackScholes.d2(S, K, r, sigma, T);
    return K * Math.exp(-r * T) * blackScholes.N(-d2) - S * blackScholes.N(-d1);
  },

  // Greeks
  delta: (S, K, r, sigma, T, type) => {
    const d1 = blackScholes.d1(S, K, r, sigma, T);
    return type === 'call' ? blackScholes.N(d1) : blackScholes.N(d1) - 1;
  },

  gamma: (S, K, r, sigma, T) => {
    const d1 = blackScholes.d1(S, K, r, sigma, T);
    return Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(2 * Math.PI * T));
  },

  theta: (S, K, r, sigma, T, type) => {
    const d1 = blackScholes.d1(S, K, r, sigma, T);
    const d2 = blackScholes.d2(S, K, r, sigma, T);
    if (type === 'call') {
      return (-S * sigma * Math.exp(-d1 * d1 / 2) / (2 * Math.sqrt(2 * Math.PI * T)) 
              - r * K * Math.exp(-r * T) * blackScholes.N(d2)) / 365;
    } else {
      return (-S * sigma * Math.exp(-d1 * d1 / 2) / (2 * Math.sqrt(2 * Math.PI * T)) 
              + r * K * Math.exp(-r * T) * blackScholes.N(-d2)) / 365;
    }
  },

  vega: (S, K, r, sigma, T) => {
    const d1 = blackScholes.d1(S, K, r, sigma, T);
    return S * Math.sqrt(T) * Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI) / 100;
  },

  rho: (S, K, r, sigma, T, type) => {
    const d2 = blackScholes.d2(S, K, r, sigma, T);
    if (type === 'call') {
      return K * T * Math.exp(-r * T) * blackScholes.N(d2) / 100;
    } else {
      return -K * T * Math.exp(-r * T) * blackScholes.N(-d2) / 100;
    }
  }
};