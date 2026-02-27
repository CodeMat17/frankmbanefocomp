"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Medal, Award, Star, Heart } from "lucide-react";

const topPrizes = [
  {
    place: 2,
    label: "Second Prize",
    amount: "₦2,000,000",
    icon: Medal,
    color: "oklch(0.79 0.01 285)",
    textColor: "oklch(0.40 0.02 285)",
    bg: "oklch(0.79 0.01 285 / 0.12)",
    border: "oklch(0.79 0.01 285 / 0.40)",
    extras: ["Certificate", "Publication in NIA Journal"],
  },
  {
    place: 1,
    label: "First Prize",
    amount: "₦5,000,000",
    icon: Trophy,
    color: "oklch(0.80 0.17 85)",
    textColor: "oklch(0.40 0.12 85)",
    bg: "oklch(0.80 0.17 85 / 0.12)",
    border: "oklch(0.80 0.17 85 / 0.50)",
    extras: ["Trophy", "NIA Journal Publication", "Symposium Invitation"],
    featured: true,
  },
  {
    place: 3,
    label: "Third Prize",
    amount: "₦1,000,000",
    icon: Award,
    color: "oklch(0.62 0.11 52)",
    textColor: "oklch(0.35 0.08 52)",
    bg: "oklch(0.62 0.11 52 / 0.10)",
    border: "oklch(0.62 0.11 52 / 0.40)",
    extras: ["Certificate", "Publication in NIA Journal"],
  },
];

const otherPrizes = [
  {
    label: "Honorable Mentions",
    amount: "₦500,000 each",
    count: "Up to 4",
    icon: Star,
    desc: "Certificate + Digital Publication",
  },
  {
    label: "People's Choice",
    amount: "Certificate",
    count: "1 winner",
    icon: Heart,
    desc: "Selected via public online gallery vote",
  },
];

const evaluationCriteria = [
  { label: "Depth of Response to Themes", weight: 40, color: "oklch(0.37 0.12 148)" },
  { label: "Cultural Sensibility & Narrative", weight: 25, color: "oklch(0.52 0.12 38)" },
  { label: "Technical Rigor & Feasibility", weight: 20, color: "oklch(0.65 0.14 68)" },
  { label: "Design Quality & Communication", weight: 15, color: "oklch(0.45 0.10 230)" },
];

export default function Prizes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="prizes" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container-max section-padding" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">
            Recognition
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            Prizes & Awards
          </h2>
          <p className="text-muted-foreground text-base">
            Total prize pool of <strong className="text-foreground">₦10,000,000+</strong> awarded
            across all categories, plus publication and exhibition opportunities.
          </p>
        </motion.div>

        {/* Podium — top 3 */}
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 mb-12">
          {topPrizes.map((prize, i) => {
            const Icon = prize.icon;
            const order = prize.place === 1 ? "sm:order-2" : prize.place === 2 ? "sm:order-1" : "sm:order-3";
            return (
              <motion.div
                key={prize.place}
                className={`${order} relative flex flex-col items-center w-full sm:w-72`}
                initial={{ opacity: 0, y: prize.featured ? 60 : 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
              >
                <motion.div
                  className={`w-full rounded-2xl p-6 border-2 transition-shadow ${
                    prize.featured ? "shadow-2xl" : "shadow-md"
                  }`}
                  style={{
                    background: prize.bg,
                    borderColor: prize.border,
                  }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  {prize.featured && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                      style={{ background: prize.color, color: "#fff" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Grand Prize
                    </motion.div>
                  )}

                  <div className="text-center mb-4">
                    <motion.div whileHover={prize.featured ? { rotate: [0, -5, 5, 0] } : {}}>
                      <Icon
                        className={`mx-auto mb-2 ${prize.featured ? "w-12 h-12" : "w-9 h-9"}`}
                        style={{ color: prize.color }}
                      />
                    </motion.div>
                    <div
                      className="text-xs font-bold uppercase tracking-widest mb-1"
                      style={{ color: prize.textColor }}
                    >
                      {prize.label}
                    </div>
                    <div
                      className={`font-black leading-none ${prize.featured ? "text-4xl" : "text-3xl"}`}
                      style={{ color: prize.textColor }}
                    >
                      {prize.amount}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t pt-4" style={{ borderColor: prize.border }}>
                    {prize.extras.map((extra) => (
                      <div key={extra} className="flex items-center gap-2 text-sm text-foreground/70">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: prize.color }} />
                        {extra}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Place badge */}
                <div
                  className="mt-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                  style={{ background: prize.color }}
                >
                  {prize.place}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Other prizes */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {otherPrizes.map((prize, i) => {
            const Icon = prize.icon;
            return (
              <motion.div
                key={prize.label}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{prize.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {prize.count}
                    </span>
                  </div>
                  <div className="text-lg font-black text-primary">{prize.amount}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{prize.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Evaluation criteria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-xl font-bold text-foreground text-center mb-8">Evaluation Criteria</h3>
          <div className="max-w-2xl mx-auto space-y-4">
            {evaluationCriteria.map((criterion, i) => (
              <motion.div
                key={criterion.label}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.0 + i * 0.1 }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{criterion.label}</span>
                  <span className="text-sm font-black" style={{ color: criterion.color }}>{criterion.weight}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full origin-left"
                    style={{ background: criterion.color, width: `${criterion.weight}%` }}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 1.1 + i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Judged by a renowned international jury of architects, engineers, material scientists, and cultural theorists.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
