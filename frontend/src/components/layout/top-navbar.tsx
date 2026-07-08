"use client";

import { Bell, Building2, Command, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

interface TopNavbarProps {
  onCommandPaletteOpen: () => void;
}

export function TopNavbar({
  onCommandPaletteOpen,
}: TopNavbarProps): React.JSX.Element {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      <button
        type="button"
        onClick={onCommandPaletteOpen}
        className="focus-ring flex w-[420px] items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Search leads, deals, contacts...</span>
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 text-xs text-foreground">
          <Command className="mr-0.5 inline h-3 w-3" />
          K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications hub">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Input
            className="h-7 w-[170px] border-0 bg-transparent px-0 focus-visible:ring-0"
            value="Northstar Ventures"
            readOnly
            aria-label="Organization switcher"
          />
          <Avatar initials="AB" />
        </div>
      </div>
    </header>
  );
}
