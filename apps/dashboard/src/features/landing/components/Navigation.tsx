import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@transora/ui/components/button";
import { Menu, X } from "lucide-react";
import { Logo } from "@transora/ui/components/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-secondary transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-xs font-semibold" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="rounded-full text-xs font-semibold px-4" asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </div>

        <button
          className="text-secondary md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border/40 bg-background px-6 py-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-secondary hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
              <Button variant="ghost" size="sm" className="w-full text-xs font-semibold" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" className="w-full rounded-full text-xs font-semibold" asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
