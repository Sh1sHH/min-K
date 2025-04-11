import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import { Pricing2 } from './components/blocks/Pricing2';

function App() {
  return (
    <div className="min-h-screen bg-[#2D1B2D]">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Pricing2 
        heading="Choose your minİK plan"
        description="Select the perfect plan for your business needs"
        plans={[
          {
            id: "plus",
            name: "Plus",
            description: "Perfect for small teams",
            monthlyPrice: "$29",
            yearlyPrice: "$24",
            features: [
              { text: "Up to 10 team members" },
              { text: "All basic features" },
              { text: "Priority email support" },
              { text: "5GB storage space" },
            ],
            button: {
              text: "Get Plus",
              url: "#",
            },
          },
          {
            id: "pro",
            name: "Pro",
            description: "For growing businesses",
            monthlyPrice: "$79",
            yearlyPrice: "$65",
            features: [
              { text: "Unlimited team members" },
              { text: "Advanced analytics" },
              { text: "24/7 priority support" },
              { text: "50GB storage space" },
            ],
            button: {
              text: "Get Pro",
              url: "#",
            },
          },
        ]}
      />
    </div>
  );
}

export default App;