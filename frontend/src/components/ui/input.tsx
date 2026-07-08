import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">): React.JSX.Element {
  return (
    <input
      className={cn(
        "focus-ring h-9 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
