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
    description: "For personal use",
    monthlyPrice: "$19",
    yearlyPrice: "$15",
    features: [
      { text: "Up to 5 team members" },
      { text: "Basic components library" },
      { text: "Community support" },
      { text: "1GB storage space" },
    ],
    button: {
      text: "Purchase Plus",
      url: "#",
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals",
    monthlyPrice: "$49",
    yearlyPrice: "$35",
    features: [
      { text: "Unlimited team members" },
      { text: "Advanced components" },
      { text: "Priority support" },
      { text: "Unlimited storage" },
    ],
    button: {
      text: "Purchase Pro",
      url: "#",
    },
  },
];

const Pricing2 = ({
  heading = "Choose your minİK plan",
  description = "Select the perfect plan for your business needs",
  plans = defaultPlans,
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-4xl font-bold text-brand-tyrian lg:text-6xl">
            {heading}
          </h2>
          <p className="text-gray-600 lg:text-xl">{description}</p>
          <div className="flex items-center gap-3 text-lg text-gray-600">
            Monthly
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Yearly
            <span className="ml-2 rounded-full bg-brand-plum/10 px-3 py-1 text-sm text-brand-persian">
              Save 20%
            </span>
          </div>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="flex w-80 flex-col justify-between text-left border-2 hover:border-brand-persian transition-colors"
              >
                <CardHeader>
                  <CardTitle>
                    <p className="text-2xl font-bold text-brand-tyrian">{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {plan.description}
                  </p>
                  <span className="text-4xl font-bold text-brand-persian">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-lg font-normal text-gray-600">/mo</span>
                  </span>
                  <p className="text-gray-600">
                    Billed{" "}
                    {isYearly
                      ? `$${Number(plan.yearlyPrice.slice(1)) * 12}`
                      : `$${Number(plan.monthlyPrice.slice(1)) * 12}`}{" "}
                    annually
                  </p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.id === "pro" && (
                    <p className="mb-3 font-semibold text-brand-persian">
                      Everything in Plus, and:
                    </p>
                  )}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="size-4 text-brand-persian" />
                        <span className="text-gray-600">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    asChild 
                    className="w-full bg-brand-persian hover:bg-brand-persian/90"
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
    </section>
  );
};

export { Pricing2 }; 