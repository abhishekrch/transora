import { motion } from "motion/react";

const steps = [
  {
    number: "01 // REGISTER",
    title: "Configure Domain",
    description: "Create your Transora account and add your production domain to authorized settings.",
  },
  {
    number: "02 // SNIPPET",
    title: "Copy Snippet",
    description: "Retrieve your unique script tag containing your public live publishable API key.",
  },
  {
    number: "03 // DEPLOY",
    title: "Instant Live",
    description: "Paste it in your HTML head. Your website translates automatically on first load.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-transparent py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        <div className="mb-16">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            Integration Workflow
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Three steps to translate
          </h2>
          <p className="mt-4 text-lg text-secondary leading-relaxed max-w-2xl">
            No complex backend databases, no server-side localization files. Just paste one script tag.
          </p>
        </div>

        <div className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          
          <div className="absolute top-[4px] left-0 right-0 hidden h-[1px] bg-border/60 md:block z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative flex flex-col pt-6 z-10 text-left"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="absolute top-0 left-0 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background md:block" />

              <span className="font-mono text-[10px] font-bold tracking-wider text-primary uppercase mt-2">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary/80 max-w-[32ch]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
