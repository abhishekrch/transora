import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Languages, Zap, Shield, BarChart3, Clock, Settings, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    number: "01",
    icon: Languages,
    title: "100+ Languages",
    description: "Translate your website into every major language automatically.",
    visual: "languages",
  },
  {
    number: "02",
    icon: Zap,
    title: "Instant Translations",
    description: "Three-layer edge cache delivers translations in milliseconds.",
    visual: "instant",
  },
  {
    number: "03",
    icon: Shield,
    title: "Domain Whitelisting",
    description: "Your API key is locked to your registered domains for total security.",
    visual: "domain",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Track translations, character usage, and cache hit rates in real-time.",
    visual: "analytics",
  },
  {
    number: "05",
    icon: Clock,
    title: "Real-time Updates",
    description: "Our smart observer automatically detects and translates new dynamic content.",
    visual: "realtime",
  },
  {
    number: "06",
    icon: Settings,
    title: "Custom Glossary",
    description: "Define overrides for brand names, technical jargon, and slang.",
    visual: "glossary",
  },
];

export function Features() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="features" className="relative bg-transparent py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-2xl">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Everything you need to go global
          </h2>
          <p className="mt-4 text-lg text-secondary leading-relaxed">
            One single snippet. Complete, production-grade translation infrastructure.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6 flex flex-col justify-start border-t border-border/60">
            {features.map((feature, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={feature.number}
                  className={`group relative flex items-start gap-6 border-b border-border/60 py-8 transition-all cursor-pointer`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFeatureIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span
                    className={`font-mono text-sm font-semibold transition-colors ${
                      isActive ? "text-primary pl-3" : "text-secondary pl-3 group-hover:text-foreground"
                    }`}
                  >
                    {feature.number}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <feature.icon
                        size={18}
                        className={`transition-colors ${
                          isActive ? "text-primary" : "text-secondary group-hover:text-foreground"
                        }`}
                      />
                      <h3
                        className={`text-lg font-semibold tracking-tight transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                        }`}
                      >
                        {feature.title}
                      </h3>
                    </div>
                    <p
                      className={`mt-2 text-sm leading-relaxed transition-colors ${
                        isActive ? "text-secondary" : "text-secondary/80 group-hover:text-secondary"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className={`self-center transition-all ${
                      isActive ? "opacity-100 translate-x-0 text-primary" : "opacity-0 -translate-x-2 group-hover:opacity-60"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-6 hidden lg:block">
            <div className="sticky top-28">
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-6 h-[420px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-border" />
                    <div className="h-3 w-3 rounded-full bg-border" />
                    <div className="h-3 w-3 rounded-full bg-border" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-secondary/50 uppercase font-semibold">
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 bg-background/5">
                  <AnimatePresence mode="wait">
                    {activeIndex === 0 && (
                      <motion.div
                        key="languages"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full space-y-4"
                      >
                        <div className="rounded-lg border border-border/40 p-4 bg-card">
                          <p className="font-mono text-[10px] text-secondary">Source (English)</p>
                          <p className="text-sm font-medium text-foreground mt-1">Hello, welcome to our translation platform.</p>
                        </div>
                        <div className="flex items-center justify-center text-secondary/40">
                          <div className="h-[1px] w-full bg-border/40" />
                          <span className="px-3 font-mono text-[10px]">TRANSLATING</span>
                          <div className="h-[1px] w-full bg-border/40" />
                        </div>
                        <div className="space-y-2">
                          <div className="rounded-lg border border-border/30 p-3 bg-card flex justify-between items-center">
                            <span className="font-mono text-[11px] font-semibold text-secondary">Spanish</span>
                            <span className="text-xs text-foreground font-medium">Hola, bienvenido a nuestra plataforma de traducción.</span>
                          </div>
                          <div className="rounded-lg border border-border/30 p-3 bg-card flex justify-between items-center">
                            <span className="font-mono text-[11px] font-semibold text-secondary">Japanese</span>
                            <span className="text-xs text-foreground font-medium">こんにちは、翻訳プラットフォームへようこそ。</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeIndex === 1 && (
                      <motion.div
                        key="instant"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-secondary font-semibold">Edge Cache Hit</span>
                            <span className="font-mono text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded">12ms</span>
                          </div>
                          <div className="w-full bg-border/30 h-3 rounded-full overflow-hidden">
                            <motion.div
                              className="bg-primary h-full"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        <div className="space-y-4 border-t border-border/30 pt-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-secondary font-semibold">Database Fetch</span>
                            <span className="font-mono text-xs font-semibold text-secondary/60">340ms</span>
                          </div>
                          <div className="w-full bg-border/30 h-3 rounded-full overflow-hidden">
                            <div className="bg-secondary/30 h-full w-[15%]" />
                          </div>
                        </div>
                        <p className="text-[11px] text-center text-secondary font-mono italic">
                          Edge network latency is 98% faster than traditional server hits.
                        </p>
                      </motion.div>
                    )}

                    {activeIndex === 2 && (
                      <motion.div
                        key="domain"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full space-y-4"
                      >
                        <div className="rounded-lg border border-border/40 p-4 bg-card">
                          <p className="font-mono text-[10px] text-secondary">Authorized Domains</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              transora.io
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              *.transora.io
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              localhost:3000
                            </span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-border/30 p-3 bg-emerald-50/20 flex items-center gap-2.5">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span className="text-xs text-emerald-800 font-medium">Domain match confirmed. API request allowed.</span>
                        </div>
                      </motion.div>
                    )}

                    {activeIndex === 3 && (
                      <motion.div
                        key="analytics"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg border border-border/30 p-3 bg-card">
                            <span className="text-[10px] font-mono text-secondary">Cache Hit Rate</span>
                            <p className="text-xl font-bold text-foreground mt-1">98.2%</p>
                          </div>
                          <div className="rounded-lg border border-border/30 p-3 bg-card">
                            <span className="text-[10px] font-mono text-secondary">Translations</span>
                            <p className="text-xl font-bold text-foreground mt-1">142,390</p>
                          </div>
                        </div>
                        {/* Custom visual chart */}
                        <div className="rounded-lg border border-border/40 p-4 bg-card space-y-2.5">
                          <span className="text-[10px] font-mono text-secondary">Hourly Requests</span>
                          <div className="flex items-end justify-between h-20 pt-2 px-1">
                            <div className="w-[10%] bg-secondary/20 h-[30%] rounded-t-sm" />
                            <div className="w-[10%] bg-secondary/20 h-[45%] rounded-t-sm" />
                            <div className="w-[10%] bg-secondary/20 h-[40%] rounded-t-sm" />
                            <div className="w-[10%] bg-primary h-[75%] rounded-t-sm" />
                            <div className="w-[10%] bg-primary h-[90%] rounded-t-sm" />
                            <div className="w-[10%] bg-primary h-[100%] rounded-t-sm" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeIndex === 4 && (
                      <motion.div
                        key="realtime"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full space-y-4"
                      >
                        <div className="rounded-lg border border-border/40 p-4 bg-card space-y-3">
                          <p className="font-mono text-[10px] text-secondary">DOM Mutation Observer</p>
                          <div className="font-mono text-xs text-secondary/80 bg-background/30 p-2.5 rounded border border-border/20 overflow-x-auto whitespace-nowrap">
                            <span className="text-blue-600">&lt;div</span> <span className="text-red-500">id</span>=<span className="text-green-600">"status"</span><span className="text-blue-600">&gt;</span>
                            <span className="text-foreground bg-yellow-100 px-1 font-semibold animate-pulse">Payment pending</span>
                            <span className="text-blue-600">&lt;/div&gt;</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-secondary font-mono">
                            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            Dynamic content change detected.
                          </div>
                          <div className="font-mono text-xs text-secondary/80 bg-background/30 p-2.5 rounded border border-border/20 overflow-x-auto whitespace-nowrap">
                            <span className="text-blue-600">&lt;div</span> <span className="text-red-500">id</span>=<span className="text-green-600">"status"</span><span className="text-blue-600">&gt;</span>
                            <span className="text-foreground bg-emerald-50 text-emerald-800 px-1 font-semibold">Pago pendiente</span>
                            <span className="text-blue-600">&lt;/div&gt;</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeIndex === 5 && (
                      <motion.div
                        key="glossary"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full space-y-4"
                      >
                        <div className="rounded-lg border border-border/40 bg-card overflow-hidden">
                          <table className="w-full border-collapse text-left">
                            <thead>
                              <tr className="border-b border-border/30 bg-background/40 text-[10px] font-mono text-secondary">
                                <th className="p-2.5">Brand / Keyword</th>
                                <th className="p-2.5">Forced Translation</th>
                              </tr>
                            </thead>
                            <tbody className="text-xs font-mono">
                              <tr className="border-b border-border/20">
                                <td className="p-2.5 font-semibold text-foreground">Transora</td>
                                <td className="p-2.5 text-primary font-bold text-[10px]">Do Not Translate</td>
                              </tr>
                              <tr className="border-b border-border/20">
                                <td className="p-2.5 font-semibold text-foreground">Log in</td>
                                <td className="p-2.5 text-secondary">Iniciar sesión</td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-semibold text-foreground">Billing</td>
                                <td className="p-2.5 text-secondary">Facturación</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-border/40 pt-4 flex items-center justify-between text-[11px] text-secondary/50">
                  <span>Status: Operational</span>
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
