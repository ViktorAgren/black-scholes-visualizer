# Black-Scholes Option Calculator

Interactive React app for option pricing and strategy analysis using the Black-Scholes model.

## Features

- Greeks visualization (Delta, Gamma, Theta, Vega, Rho) 
- Multi-leg options strategy builder with 15+ presets

## Available Strategies

**Volatility**: Long/Short Straddle, Strangle, Iron Condor, Iron Butterfly  
**Directional**: Bull/Bear Call/Put Spreads  
**Income**: Covered Call, Protective Put, Collar  
**Advanced**: Calendar Spread, Jade Lizard, Ratio Spreads

## Tech Stack

React 18, Recharts, Tailwind CSS, MathJS

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
```bash
git clone https://github.com/yourusername/black-scholes-visualizer.git
cd black-scholes-visualizer
npm install
```

### Development
```bash
npm start
```
Opens the app at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Project Structure

```
src/
├── components/
│   ├── Terminal.js           # Professional parameter input interface
│   ├── PriceChart.js        # Option price vs stock price visualization
│   ├── GreeksDisplay.js     # Individual Greeks sensitivity charts
│   └── StrategyBuilder.js   # Multi-leg options strategy constructor
├── utils/
│   └── blackScholes.js      # Black-Scholes mathematical implementation
└── App.js                   # Main application with tab navigation
```

