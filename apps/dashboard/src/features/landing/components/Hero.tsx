import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@transora/ui/components/button";
import { Globe, ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const snippetCode = `<script src="cdn.transora.io/v1/widget.js" data-key="pk_live_your_key"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-transparent pt-20 md:pt-24">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-6xl lg:text-[3.75rem]">
              One script tag.
              <br />
              <span className="text-secondary">Entire website translated.</span>
            </h1>

            <p className="mb-8 max-w-[50ch] text-[0.95rem] leading-[1.55] text-secondary">
              Transora translates your website into 100+ languages automatically.
              No code changes, no complex setup. Just paste and go.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start translating
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-secondary/70">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>100+ languages</span>
              </div>
              <div className="h-4 w-px bg-border/60" />
              <div>&lt; 15KB widget</div>
              <div className="h-4 w-px bg-border/60" />
              <div>3-layer cache</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-background/25">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="ml-2 text-xs font-mono text-secondary/60">index.html</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={12} className="text-primary" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>COPY CODE</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-6">
                <pre className="overflow-x-auto text-xs font-mono leading-relaxed">
                  <code>
                    <span className="text-secondary/40">{"<!DOCTYPE html>"}</span>
                    {"\n"}
                    <span className="text-secondary/40">{"<html>"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-secondary/40">{"<head>"}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-primary/70 italic">{"<!-- Add Transora -->"}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-secondary/60">{"<script"}</span>
                    {"\n"}
                    {"      "}
                    <span className="text-primary font-bold">{"src"}</span>
                    {"="}
                    <span className="text-emerald-700">{'"cdn.transora.io/v1/widget.js"'}</span>
                    {"\n"}
                    {"      "}
                    <span className="text-primary font-bold">{"data-key"}</span>
                    {"="}
                    <span className="text-emerald-700">{'"pk_live_your_key"'}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-secondary/60">{">"}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-secondary/60">{"</script>"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-secondary/60">{"</head>"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-secondary/60">{"<body>"}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-secondary/60">{"<h1>"}</span>
                    {"Welcome"}
                    <span className="text-secondary/60">{"</h1>"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-secondary/60">{"</body>"}</span>
                    {"\n"}
                    <span className="text-secondary/60">{"</html>"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
