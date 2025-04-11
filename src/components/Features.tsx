import React from 'react';
import { Users, Building2, Shield, Wallet } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Accelerate every part of your business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rippling brings all your employee systems and data together to make your job easier.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="w-8 h-8 text-orange-500" />}
            title="HR Management"
            description="Streamline your HR processes with automated workflows and employee self-service."
          />
          <FeatureCard
            icon={<Building2 className="w-8 h-8 text-orange-500" />}
            title="IT Management"
            description="Manage all your employee apps and devices from a single dashboard."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-orange-500" />}
            title="Benefits"
            description="Offer competitive benefits packages and manage them all in one place."
          />
          <FeatureCard
            icon={<Wallet className="w-8 h-8 text-orange-500" />}
            title="Payroll"
            description="Run payroll in minutes with automated tax calculations and direct deposits."
          />
        </div>

        {/* HR Impact Section */}
        <div className="mt-24 bg-gradient-to-r from-[#2D1B2D] to-[#1B1B2D] rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-8">
            Maximize HR's impact
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h4 className="text-xl font-semibold text-white mb-2">
                Employee Management
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Performance Reviews</li>
                <li>• Time Off Tracking</li>
                <li>• Onboarding</li>
                <li>• Training</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h4 className="text-xl font-semibold text-white mb-2">
                Compliance
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Policy Management</li>
                <li>• Document Storage</li>
                <li>• Reporting</li>
                <li>• Auditing</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h4 className="text-xl font-semibold text-white mb-2">
                Benefits & Compensation
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Health Insurance</li>
                <li>• 401(k) Plans</li>
                <li>• Equity Management</li>
                <li>• Compensation Planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition group">
      <div className="mb-4 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Features; 