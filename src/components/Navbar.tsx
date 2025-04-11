import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Project Management"
              href="/products/pm"
              src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60"
              description="Manage your projects efficiently with our tools."
            />
            <ProductItem
              title="Design System"
              href="/products/design"
              src="https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=800&auto=format&fit=crop&q=60"
              description="Beautiful and consistent design system for your brand."
            />
            <ProductItem
              title="Analytics"
              href="/products/analytics"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
              description="Get insights into your business performance."
            />
            <ProductItem
              title="Marketing"
              href="/products/marketing"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
              description="Grow your business with our marketing solutions."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/pricing/starter">Starter</HoveredLink>
            <HoveredLink href="/pricing/pro">Professional</HoveredLink>
            <HoveredLink href="/pricing/team">Team</HoveredLink>
            <HoveredLink href="/pricing/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
} 