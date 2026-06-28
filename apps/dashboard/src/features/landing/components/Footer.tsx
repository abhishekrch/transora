import { Copyright } from "@transora/ui/components/copyright";
import { Logo } from "@transora/ui/components/logo";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export function Footer() {
  return (
    <footer className="bg-transparent py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between border-t border-border/40 pt-8">
          
          <div className="max-w-xs space-y-3">
            <Logo />
            <p className="text-xs leading-relaxed text-secondary/70">
              Translate your website into 100+ languages with one script tag. Zero complex configuration.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-foreground uppercase font-mono">
              Product
            </h4>
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs font-semibold text-secondary transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 text-left text-xs text-secondary/50">
          <Copyright />
        </div>
      </div>
    </footer>
  );
}
