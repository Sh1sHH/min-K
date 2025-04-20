"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import StarField from "@/components/ui/star-field";

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
  heading: string;
  description: string;
  plans: PricingPlan[];
}

export const Pricing2 = ({
  heading,
  description,
  plans,
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section  id="price-section" className="relative py-24 overflow-hidden bg-white ">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Star field effect */}
        <StarField />
        
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/white2.png" 
            alt="Background" 
            className="w-full h-full object-cover object-center opacity-5"
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
        
        {/* Subtle gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/5 rounded-full filter blur-[100px] opacity-30 animate-float mix-blend-overlay"
          style={{ animationDuration: '15s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/5 rounded-full filter blur-[90px] opacity-30 animate-float-delay mix-blend-overlay"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
            <h2 className="text-pretty text-4xl font-bold text-[#1F2A44] lg:text-6xl">
              {heading}
            </h2>
            <p className="text-[#1F2A44]/70 lg:text-xl">{description}</p>
            
            {/* Modern Toggle Button */}
            <div className="flex items-center gap-3 bg-[#1F2A44]/5 rounded-full px-4 py-2 border border-[#1F2A44]/10 relative w-fit text-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  !isYearly ? 'text-[#1F2A44] font-medium' : 'text-[#1F2A44]/60'
                }`}
              >
                Monthly
              </button>
              <div 
                onClick={() => setIsYearly(!isYearly)}
                className="relative h-6 w-12 rounded-full bg-[#4DA3FF]/20 cursor-pointer p-0.5 transition-colors duration-300"
              >
                <div 
                  className={`absolute h-5 w-5 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#B1E5D3] shadow-lg transition-all duration-300 ease-out ${
                    isYearly ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isYearly ? 'text-[#1F2A44] font-medium' : 'text-[#1F2A44]/60'
                }`}
              >
                Yearly
                <span className="ml-1 text-[#4DA3FF] text-xs font-medium">
                  (-20%)
                </span>
              </button>
            </div>

            {/* Pricing Cards */}
            <div className="mt-16 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col bg-white shadow-lg border border-[#1F2A44]/10 rounded-3xl p-8 ${
                    plan.isPopular ? 'ring-2 ring-[#4DA3FF] ring-offset-2 ring-offset-white' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-[#4DA3FF] to-[#B1E5D3] px-3 py-1 text-sm font-medium text-white">
                      Most Popular
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#1F2A44]">
                      {plan.name}
                    </CardTitle>
                    <p className="text-[#1F2A44]/70">{plan.description}</p>
                  </CardHeader>

                  <div className="mt-4 flex items-baseline text-[#1F2A44]">
                    <span className="text-4xl font-bold tracking-tight">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="ml-1 text-sm font-semibold text-[#1F2A44]/70">
                      /month
                    </span>
                  </div>

                  <CardContent>
                    <Separator className="mb-6 bg-[#1F2A44]/10" />
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="size-4 text-[#4DA3FF]" />
                          <span className="text-[#1F2A44]/70">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full py-6 transition-all duration-300 bg-[#4DA3FF]/10 hover:bg-[#4DA3FF]/20 text-[#1F2A44] border border-[#4DA3FF]/20 rounded-xl"
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