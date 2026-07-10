import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">): React.JSX.Element {
  return (
    <input
      className={cn(
        "focus-ring h-9 w-full rounded-md border border-border bg-card px-3 text-[15px] text-foreground placeholder:text-muted-foreground/80",
        className,
      )}
      {...props}
    />
  );
}
