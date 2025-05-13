"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Açık mod renkleri
      "bg-gray-200 border-2 border-gray-300",
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-600",
      "data-[state=checked]:border-blue-500",
      // Koyu mod renkleri
      "dark:bg-gray-700 dark:border-gray-600",
      "dark:data-[state=checked]:from-blue-400 dark:data-[state=checked]:to-blue-500",
      "dark:data-[state=checked]:border-blue-400",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[20px] w-[20px] rounded-full shadow-lg ring-0 transition-all duration-200",
        "transform translate-x-0.5",
        "data-[state=checked]:translate-x-[22px]",
        // Açık mod renkleri
        "bg-white",
        "data-[state=checked]:bg-white",
        "data-[state=checked]:shadow-blue-500/50",
        // Koyu mod renkleri
        "dark:bg-gray-200",
        "dark:data-[state=checked]:bg-white",
        "dark:data-[state=checked]:shadow-blue-400/50"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
