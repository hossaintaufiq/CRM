import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<"div"> {
  initials: string;
}

export function Avatar({ initials, className, ...props }: AvatarProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border border-border bg-foreground font-mono text-[10px] font-semibold tracking-wide text-background",
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  );
}
