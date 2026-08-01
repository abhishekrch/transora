import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { StatsCards } from "./StatsCards";
import { RecentWebsites } from "./WebsitesList";

const SCRIPT_STRIP = [
  { char: "नमस्ते", lang: "Hindi" },
  { char: "こ", lang: "Japanese" },
  { char: "Γειά", lang: "Greek" },
  { char: "안녕", lang: "Korean" },
  { char: "नमस्कार", lang: "Sanskrit" },
  { char: "Привет", lang: "Russian" },
  { char: "สวัสดี", lang: "Thai" },
  { char: "שלום", lang: "Hebrew" },
  { char: "Bonjour", lang: "French" },
  { char: "你好", lang: "Chinese" },
];

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 flex h-10 items-center justify-between gap-4 overflow-hidden border-b px-6 opacity-60"
        >
          {SCRIPT_STRIP.map(({ char, lang }) => (
            <span
              key={lang}
              title={lang}
              className="whitespace-nowrap font-display text-sm text-muted-foreground/70"
            >
              {char}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Localization overview
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back{user?.companyName ? `, ${user.companyName}` : ""}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Your sites speak {user?.companyName ? "your customers'" : "your"} language.
            Here&apos;s how translation is moving across them.
          </p>
        </div>
      </div>

      <StatsCards />
      <RecentWebsites />
    </div>
  );
}
