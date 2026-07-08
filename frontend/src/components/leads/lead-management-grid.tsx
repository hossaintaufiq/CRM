"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Mail, NotebookPen, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/crm";

interface LeadManagementGridProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (leadId: string) => void;
  onCloseDetail: () => void;
}

export function LeadManagementGrid({
  leads,
  selectedLead,
  onSelectLead,
  onCloseDetail,
}: LeadManagementGridProps): React.JSX.Element {
  const drawerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }

    const ctx = gsap.context(() => {
      if (selectedLead) {
        gsap.fromTo(
          "[data-lead-overlay]",
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "power2.out" },
        );
        gsap.fromTo(
          drawer,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.3, ease: "power2.out" },
        );
        gsap.fromTo(
          "[data-lead-item]",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.2, delay: 0.08 },
        );
      } else {
        gsap.to(drawer, { xPercent: 100, duration: 0.25, ease: "power2.inOut" });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [selectedLead]);

  return (
    <section className="relative rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold">Advanced Lead Management Grid</h2>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Last Touch</th>
              <th className="px-4 py-3">Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="cursor-pointer border-t border-border hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.company}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge>{lead.status}</Badge>
                </td>
                <td className="px-4 py-3">{lead.score}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.lastTouch}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" aria-label="Email lead">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Call lead">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Log note">
                      <NotebookPen className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead ? (
        <>
          <button
            type="button"
            data-lead-overlay
            className="absolute inset-0 z-10 bg-black/30"
            aria-label="Close lead detail"
            onClick={onCloseDetail}
          />
          <aside
            ref={drawerRef}
            className="absolute right-0 top-0 z-20 h-full w-[380px] border-l border-border bg-card p-5 shadow-xl"
          >
            <h3 className="text-lg font-semibold">{selectedLead.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
            <div className="mt-4 space-y-2">
              {selectedLead.timeline.map((item) => (
                <div
                  key={item}
                  data-lead-item
                  className="rounded-md border border-border bg-muted/40 p-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
