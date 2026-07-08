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
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Contact2, label: "Leads", href: "/leads" },
  { icon: Workflow, label: "Deals (Kanban)", href: "/deals" },
  { icon: Contact2, label: "Contacts", href: "/contacts" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bot, label: "Automations", href: "/automations" },
  { icon: Settings, label: "Settings", href: "/settings" },
] as const;

export function AppShell({
  children,
  unreadNotifications,
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
    <div ref={shellRef} className="relative min-h-screen bg-background text-foreground">
      <aside
        data-sidebar
        className="fixed inset-y-0 left-0 z-20 w-[268px] border-r border-border bg-sidebar px-3 py-4"
      >
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              CRM
            </div>
            <div data-link-label className="text-sm font-semibold text-sidebar-foreground">
              Enterprise Console
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

        <nav className="space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "focus-ring flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground transition-colors hover:bg-muted",
                pathname === href && "bg-muted",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span data-link-label className="truncate">
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      <div data-main className="ml-[268px] min-h-screen transition-none">
        <TopNavbar
          onCommandPaletteOpen={() => setCommandOpen(true)}
          unreadNotifications={unreadNotifications}
        />
        <main className="p-6">{children}</main>
      </div>

      {commandOpen ? (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/40 pt-24">
          <div className="w-[560px] rounded-lg border border-border bg-card p-4 shadow-xl">
            <p className="text-sm text-muted-foreground">
              Command palette placeholder (Cmd/Ctrl + K)
            </p>
            <p className="mt-2 text-sm">Search modules, jump to records, trigger automations.</p>
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
