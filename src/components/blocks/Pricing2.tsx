"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
  isPopular?: boolean;
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const defaultPlans = [
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
      { text: "5GB storage space" }
    ],
    button: {
      text: "Get Plus",
      url: "#",
    },
    isPopular: false
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    monthlyPrice: "$79",
    yearlyPrice: "$64",
    features: [
      { text: "Unlimited team members" },
      { text: "Advanced analytics" },
      { text: "24/7 priority support" },
      { text: "50GB storage space" }
    ],
    button: {
      text: "Get Pro",
      url: "#",
    },
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: "$149",
    yearlyPrice: "$119",
    features: [
      { text: "Unlimited team members" },
      { text: "Enterprise analytics" },
      { text: "24/7 VIP support" },
      { text: "Unlimited storage" },
      { text: "Custom integrations" },
      { text: "Dedicated account manager" }
    ],
    button: {
      text: "Contact Sales",
      url: "#",
    },
    isPopular: false
  }
];

const Pricing2 = ({
  heading = "1",
  description = "Select the perfect plan for your business needs",
  plans = defaultPlans,
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <section className="relative py-32">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Main gradient with enhanced color stops */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C0633] from-5% via-[#4F1C48] via-25% via-[#1B0421] via-55% to-[#0F0F0F] to-90% opacity-95" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[url('/mesh-gradient.png')] bg-cover bg-center mix-blend-soft-light opacity-30" />
        
        {/* Animated gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] bg-gradient-to-r from-[#4F1C48] via-[#3C1237] to-[#2C0633] rounded-full filter blur-[130px] opacity-50 animate-float"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] bg-gradient-to-l from-[#2C0633] via-[#251429] to-[#1B0421] rounded-full filter blur-[120px] opacity-40 animate-float-delay"
          style={{ animationDuration: '15s' }}
        />
        
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
            <h2 className="text-pretty text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 lg:text-6xl">
              {heading}
            </h2>
            <p className="text-neutral-300 lg:text-xl">{description}</p>
            
            {/* Modern Toggle Button */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 relative w-fit text-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  !isYearly ? 'text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Monthly
              </button>
              <div 
                onClick={() => setIsYearly(!isYearly)}
                className="relative h-6 w-12 rounded-full bg-purple-900/50 cursor-pointer p-0.5 transition-colors duration-300"
              >
                <div 
                  className={`absolute h-5 w-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg transition-all duration-300 ease-out ${
                    isYearly ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isYearly ? 'text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Yearly
                <span className="ml-1 text-purple-400 text-xs font-medium">
                  (-20%)
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative flex flex-col justify-between text-left backdrop-blur-sm transition-all duration-500 cursor-pointer hover:scale-105
                    rounded-3xl
                    ${plan.id === selectedPlan 
                      ? 'bg-purple-600/30 border-purple-400/70 scale-105' 
                      : 'bg-white/5 border-white/20 hover:border-white/40'}`}
                >
                  <CardHeader>
                    <CardTitle>
                      <p className="text-2xl font-bold text-white">
                        {plan.name}
                      </p>
                    </CardTitle>
                    <p className="text-sm text-neutral-400">
                      {plan.description}
                    </p>
                    <span className="text-4xl font-bold text-white mt-4 block">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal text-neutral-400">/mo</span>
                    </span>
                    <p className="text-neutral-400 mt-1">
                      Billed ${isYearly
                        ? Number(plan.yearlyPrice.slice(1)) * 12
                        : Number(plan.monthlyPrice.slice(1)) * 12} annually
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-6 bg-white/10" />
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="size-4 text-white/70" />
                          <span className="text-neutral-400">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full py-6 transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                      onClick={() => window.location.href = plan.button.url}
                    >
                      {plan.button.text}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 }; 