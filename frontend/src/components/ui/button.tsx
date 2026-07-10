import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center rounded-md text-sm font-semibold tracking-tight transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-primary-foreground hover:bg-foreground/90 active:scale-[0.98]",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        ghost: "text-foreground hover:bg-muted",
        outline:
          "border border-border bg-card text-foreground hover:border-gold/40 hover:bg-muted/60",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-9 px-4",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
