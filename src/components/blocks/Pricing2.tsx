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
    id: "standard",
    name: "Standard",
    description: "Perfect for small teams getting started",
    monthlyPrice: "$29",
    yearlyPrice: "$24",
    features: [
      { text: "Up to 5 team members" },
      { text: "Basic analytics" },
      { text: "24/7 email support" },
      { text: "10 GB storage" },
      { text: "API access" }
    ],
    button: {
      text: "Get Standard",
      url: "#",
    },
    isPopular: false
  },
  {
    id: "plus",
    name: "Plus",
    description: "Best for growing businesses",
    monthlyPrice: "$79",
    yearlyPrice: "$64",
    features: [
      { text: "Up to 20 team members" },
      { text: "Advanced analytics" },
      { text: "24/7 priority support" },
      { text: "50 GB storage" },
      { text: "API access" },
      { text: "Custom integrations" },
      { text: "Team training" }
    ],
    button: {
      text: "Get Plus",
      url: "#",
    },
    isPopular: true
  },
  {
    id: "pro",
    name: "Pro",
    description: "For large enterprises",
    monthlyPrice: "$149",
    yearlyPrice: "$119",
    features: [
      { text: "Unlimited team members" },
      { text: "Enterprise analytics" },
      { text: "24/7 VIP support" },
      { text: "Unlimited storage" },
      { text: "API access" },
      { text: "Custom integrations" },
      { text: "Team training" },
      { text: "Custom features" },
      { text: "Dedicated account manager" }
    ],
    button: {
      text: "Get Pro",
      url: "#",
    },
    isPopular: false
  }
];

const Pricing2 = ({
  heading = "Choose your minİK plan",
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
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10 relative w-fit text-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  !isYearly ? 'text-white' : 'text-neutral-300'
                }`}
              >
                Monthly
              </button>
              <div 
                onClick={() => setIsYearly(!isYearly)}
                className="relative h-7 w-14 rounded-full bg-white/10 cursor-pointer transition-colors duration-300 hover:bg-white/20"
              >
                <div 
                  className={`absolute top-1 h-5 w-5 rounded-full bg-purple-500 shadow-lg transition-all duration-500 ease-in-out ${
                    isYearly ? 'left-[calc(100%-24px)]' : 'left-1'
                  } hover:bg-purple-400`}
                />
              </div>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isYearly ? 'text-white' : 'text-neutral-300'
                }`}
              >
                Yearly
                <span className="ml-1 text-purple-300 text-xs">
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
                    ${plan.id === selectedPlan 
                      ? 'bg-purple-600/30 border-purple-400/70 scale-105 shadow-2xl' 
                      : 'bg-white/5 border-white/20 hover:border-white/40'}`}
                >
                  {plan.isPopular && plan.id === selectedPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>
                      <p className={`text-2xl font-bold ${plan.id === selectedPlan ? 'text-white' : 'text-neutral-300'}`}>
                        {plan.name}
                      </p>
                    </CardTitle>
                    <p className="text-sm text-neutral-300">
                      {plan.description}
                    </p>
                    <span className={`text-4xl font-bold ${plan.id === selectedPlan ? 'text-white' : 'text-neutral-300'}`}>
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal text-neutral-300">/mo</span>
                    </span>
                    <p className="text-neutral-400">
                      Billed{" "}
                      {isYearly
                        ? `$${Number(plan.yearlyPrice.slice(1)) * 12}`
                        : `$${Number(plan.monthlyPrice.slice(1)) * 12}`}{" "}
                      annually
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Separator className={`mb-6 ${plan.id === selectedPlan ? 'bg-purple-400/20' : 'bg-white/10'}`} />
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className={`size-4 ${plan.id === selectedPlan ? 'text-purple-300' : 'text-white/70'}`} />
                          <span className="text-neutral-300">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      asChild 
                      className={`w-full transition-all duration-300 ${
                        plan.id === selectedPlan
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      <a href={plan.button.url}>
                        {plan.button.text}
                        <ArrowRight className="ml-2 size-4" />
                      </a>
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