"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  ChevronLeft,
  Contact2,
  Hexagon,
  LayoutDashboard,
  PanelLeftClose,
  Settings,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TopNavbar } from "@/components/layout/top-navbar";

interface AppShellProps {
  children: React.ReactNode;
  unreadNotifications: number;
  organizationName: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Contact2, label: "Leads", href: "/leads" },
  { icon: Workflow, label: "Deals", href: "/deals" },
  { icon: Contact2, label: "Contacts", href: "/contacts" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bot, label: "Automations", href: "/automations" },
  { icon: Settings, label: "Settings", href: "/settings" },
] as const;

export function AppShell({
  children,
  unreadNotifications,
  organizationName,
}: AppShellProps): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 0.35 } });
      timeline
        .to("[data-sidebar]", { width: collapsed ? 84 : 268 })
        .to(
          "[data-link-label]",
          { opacity: collapsed ? 0 : 1, x: collapsed ? -4 : 0, pointerEvents: collapsed ? "none" : "auto" },
          0,
        )
        .to("[data-main]", { marginLeft: collapsed ? 84 : 268 }, 0);
    }, shell);

    return () => {
      ctx.revert();
    };
  }, [collapsed]);

  useLayoutEffect(() => {
    function onKeydown(event: KeyboardEvent): void {
      const isPaletteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isPaletteShortcut) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    }

    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <div ref={shellRef} className="relative min-h-screen text-foreground">
      <aside
        data-sidebar
        className="fixed inset-y-0 left-0 z-20 w-[268px] border-r border-border/70 bg-sidebar/85 px-3 py-4 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center justify-between px-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
              <Hexagon className="h-4 w-4" strokeWidth={2.25} />
              <span className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/10" />
            </div>
            <div data-link-label className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
                Nexus
              </p>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Control Plane
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed((state) => !state)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <p
          data-link-label
          className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Modules
        </p>
        <nav className="space-y-0.5">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "focus-ring flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground/80 transition-colors hover:bg-muted/70 hover:text-sidebar-foreground",
                  active && "nav-active text-sidebar-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span data-link-label className="truncate font-medium">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          data-link-label
          className="absolute bottom-4 left-3 right-3 rounded-md border border-border/70 bg-muted/40 px-3 py-2.5"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            System
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success" />
            All pipelines synced
          </p>
        </div>
      </aside>

      <div data-main className="ml-[268px] min-h-screen transition-none">
        <TopNavbar
          onCommandPaletteOpen={() => setCommandOpen(true)}
          unreadNotifications={unreadNotifications}
          organizationName={organizationName}
        />
        <main className="p-6">{children}</main>
      </div>

      {commandOpen ? (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-foreground/25 pt-24 backdrop-blur-sm">
          <div className="w-[560px] rounded-lg border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl">
            <p className="page-eyebrow">Command</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">Jump anywhere</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search modules, jump to records, trigger automations.
            </p>
            <div className="mt-4 text-right">
              <Button variant="outline" size="sm" onClick={() => setCommandOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
