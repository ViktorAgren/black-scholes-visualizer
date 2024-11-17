import React from 'react';
import { Terminal } from './components/Terminal';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Black-Scholes Option Calculator</h1>
        <Terminal />
      </div>
    </div>
  );
}

export default App;