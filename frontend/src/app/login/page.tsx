"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE, API_ENDPOINTS } from "@/lib/api/endpoints";

const AUTH_KEY = "nexus_access_token";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nexus.crm");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials or backend offline");
      }
      const data = (await response.json()) as { access_token: string };
      window.localStorage.setItem(AUTH_KEY, data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="surface w-full max-w-md space-y-4 rounded-lg p-6 shadow-xl"
      >
        <div>
          <p className="page-eyebrow">Authentication</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sign in to Nexus</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Email/password is live. Social/SSO providers need credentials.
          </p>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            POST {API_BASE}/api/v1/auth/login
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Email
          </span>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Password
          </span>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          {["Google", "Microsoft", "GitHub", "Apple"].map((provider) => (
            <Button
              key={provider}
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setError(
                  `${provider} login is scaffolded. Configure ${provider.toUpperCase()}_CLIENT_ID/SECRET in backend/.env`,
                )
              }
            >
              {provider}
            </Button>
          ))}
        </div>

        <p className="font-mono text-[10px] text-muted-foreground">
          Demo: admin@nexus.crm / Admin123! · OAuth stubs: {API_ENDPOINTS.dashboardSummary.replace("dashboard/summary", "auth/oauth/{provider}/start")}
        </p>
      </form>
    </main>
  );
}
