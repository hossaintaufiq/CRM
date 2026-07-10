"use client";

import Link from "next/link";
import { Bell, Building2, Command, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

interface TopNavbarProps {
  onCommandPaletteOpen: () => void;
  unreadNotifications: number;
  organizationName: string;
}

export function TopNavbar({
  onCommandPaletteOpen,
  unreadNotifications,
  organizationName,
}: TopNavbarProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/70 bg-background/75 px-6 backdrop-blur-xl">
      <button
        type="button"
        onClick={onCommandPaletteOpen}
        className="focus-ring flex w-[420px] items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3 py-2 text-[15px] text-muted-foreground shadow-[0_1px_0_rgb(15_23_32_/_0.03)] transition-colors hover:border-gold/35 hover:text-foreground"
      >
        <Search className="h-4 w-4 text-gold-deep/80" />
        <span>Search leads, deals, contacts...</span>
        <kbd className="ml-auto inline-flex items-center gap-0.5 rounded border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground">
          <Command className="h-3 w-3" />
          K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <Link href="/notifications" className="relative">
          <Button variant="ghost" size="icon" aria-label="Notifications hub">
            <Bell className="h-4 w-4" />
          </Button>
          {unreadNotifications > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded bg-destructive px-1 font-mono text-[10px] font-semibold text-white">
              {unreadNotifications}
            </span>
          ) : null}
        </Link>
        <div className="flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3 py-1.5 shadow-[0_1px_0_rgb(15_23_32_/_0.03)]">
          <Building2 className="h-4 w-4 text-gold-deep" />
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Workspace
            </p>
            <Input
              className="h-5 w-[150px] border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0"
              value={organizationName}
              readOnly
              aria-label="Organization switcher"
            />
          </div>
          <Avatar initials="AB" />
        </div>
      </div>
    </header>
  );
}
