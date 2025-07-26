import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Enhanced mint variants with proper theming
        "mint-primary": "bg-mint-500 text-white shadow-sm hover:bg-mint-600 active:bg-mint-700 focus-visible:ring-mint-500 border border-mint-500 hover:border-mint-600 active:border-mint-700",
        "mint-secondary": "bg-mint-100 text-mint-800 shadow-sm hover:bg-mint-200 active:bg-mint-300 focus-visible:ring-mint-500 border border-mint-200 hover:border-mint-300 active:border-mint-400",
        "mint-outline": "border border-mint-500 text-mint-600 bg-transparent hover:bg-mint-50 hover:text-mint-700 active:bg-mint-100 active:text-mint-800 focus-visible:ring-mint-500",
        "mint-ghost": "text-mint-600 hover:bg-mint-50 hover:text-mint-700 active:bg-mint-100 active:text-mint-800 focus-visible:ring-mint-500",
        // Legacy mint variant for backward compatibility
        mint: "bg-mint-500 text-white shadow hover:bg-mint-600 focus-visible:ring-mint-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine if button should be disabled
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {loading ? (loadingText || "Loading...") : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }