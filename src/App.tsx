import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';

function App() {
  return (
    <div className="min-h-screen bg-[#2D1B2D]">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}

export default App;