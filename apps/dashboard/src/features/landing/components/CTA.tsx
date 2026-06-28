import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@transora/ui/components/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative bg-transparent py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Technical blueprint console wrapper */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-8 md:p-16 shadow-xs">
          {/* Subtle grid pattern of hairlines */}
          <div 
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Column: Typography */}
            <motion.div
              className="lg:col-span-8 space-y-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                  DEPLOYMENT READY
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl leading-[1.1]">
                Ready to go global?
              </h2>
              <p className="max-w-[48ch] text-[0.95rem] leading-[1.55] text-secondary">
                Get started with Transora today. Paste the widget snippet into your HTML head and go live in seconds. Free for MVP, no credit card required.
              </p>
            </motion.div>

            {/* Right Column: Actions */}
            <motion.div
              className="lg:col-span-4 flex flex-col gap-3 lg:items-end"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button size="lg" className="rounded-full font-semibold w-full lg:w-auto" asChild>
                <Link to="/register">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full font-semibold hover:bg-background w-full lg:w-auto" asChild>
                <Link to="/login">Sign in to dashboard</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
