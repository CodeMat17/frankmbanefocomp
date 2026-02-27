"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Users, GraduationCap, Globe2, Lightbulb } from "lucide-react";

const eligibilityChecks = [
  "Currently enrolled in an accredited Bachelor of Architecture (3rd year or above)",
  "Currently enrolled in a Master of Architecture program worldwide",
  "Interdisciplinary teams (engineering, material science, cultural studies) are encouraged",
  "Teams of up to 4 students, or individual entrants",
];

const categories = [
  {
    icon: GraduationCap,
    title: "B.Arch Students",
    desc: "3rd year or above in any accredited program worldwide",
    color: "oklch(0.37 0.12 148)",
    bg: "oklch(0.37 0.12 148 / 0.08)",
  },
  {
    icon: Globe2,
    title: "M.Arch Students",
    desc: "Any year, any accredited graduate architecture program",
    color: "oklch(0.52 0.12 38)",
    bg: "oklch(0.52 0.12 38 / 0.08)",
  },
  {
    icon: Lightbulb,
    title: "Interdisciplinary",
    desc: "Engineering, material science, cultural studies students welcome",
    color: "oklch(0.65 0.14 68)",
    bg: "oklch(0.65 0.14 68 / 0.10)",
  },
];

export default function Eligibility() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="eligibility" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container-max section-padding">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-bold uppercase tracking-widest text-primary block mb-3">
                Who Can Apply
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6 leading-tight">
                Eligibility Requirements
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                This competition is open to architecture students globally. We especially
                encourage interdisciplinary collaboration — bringing together diverse perspectives
                to tackle these complex challenges.
              </p>
            </motion.div>

            {/* Checklist */}
            <div className="space-y-4">
              {eligibilityChecks.map((check, i) => (
                <motion.div
                  key={check}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  </motion.div>
                  <p className="text-foreground leading-relaxed">{check}</p>
                </motion.div>
              ))}
            </div>

            {/* Team size callout */}
            <motion.div
              className="mt-8 p-5 rounded-2xl border border-primary/20 bg-primary/5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">Team Structure</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4].map((n) => (
                  <motion.div
                    key={n}
                    className="flex flex-col items-center p-3 rounded-xl bg-background border border-border min-w-[56px]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.8 + n * 0.08, type: "spring" }}
                  >
                    <div className="flex -space-x-1 mb-1">
                      {Array.from({ length: n }).map((_, j) => (
                        <div key={j} className="w-4 h-4 rounded-full bg-primary/40 border-2 border-background" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{n === 1 ? "Solo" : `${n} members`}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — category cards */}
          <div className="space-y-4">
            <motion.p
              className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Eligible Program Types
            </motion.p>

            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  className="group flex gap-4 p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all"
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  whileHover={{ x: -4 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cat.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground mb-1">{cat.title}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</div>
                  </div>
                </motion.div>
              );
            })}


          </div>
        </div>
      </div>
    </section>
  );
}
