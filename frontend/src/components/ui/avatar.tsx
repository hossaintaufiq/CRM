import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<"div"> {
  initials: string;
}

export function Avatar({ initials, className, ...props }: AvatarProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground",
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  );
}
