"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Wind, Leaf, Zap, Globe, Droplets } from "lucide-react";

const themes = [
  {
    number: "01",
    icon: Wind,
    title: "Tropical Architecture",
    color: "oklch(0.37 0.12 148)",
    lightBg: "oklch(0.37 0.12 148 / 0.08)",
    description:
      "Demonstrate mastery of passive design strategies for hot-humid climates. Respond to solar orientation, rain, humidity, and wind patterns to ensure thermal comfort, natural ventilation, and daylighting — without mechanical reliance.",
    tags: ["Passive Cooling", "Natural Ventilation", "Daylighting"],
  },
  {
    number: "02",
    icon: Leaf,
    title: "Sustainable Materials & Zero Carbon",
    color: "oklch(0.52 0.12 38)",
    lightBg: "oklch(0.52 0.12 38 / 0.08)",
    description:
      "Prioritize low-embodied carbon and regenerative material cycles. Explore locally sourced, bio-based materials — bamboo, certified timber, mycelium composites, rammed earth — and innovative reuse of waste streams. Target cradle-to-cradle carbon neutrality.",
    tags: ["Bamboo", "Mycelium", "Rammed Earth", "Cradle-to-Cradle"],
  },
  {
    number: "03",
    icon: Zap,
    title: "Energy Efficiency & Renewables",
    color: "oklch(0.65 0.14 68)",
    lightBg: "oklch(0.65 0.14 68 / 0.10)",
    description:
      "Design for ultra-low energy demand. Integrate renewable energy generation — solar, micro-wind, hydro-kinetic — seamlessly into the design. Outline a clear energy balance strategy aiming for Net Positive Energy.",
    tags: ["Solar PV", "Net Positive", "Micro-Wind"],
  },
  {
    number: "04",
    icon: Globe,
    title: "Traditional Cultural Aspects",
    color: "oklch(0.45 0.10 230)",
    lightBg: "oklch(0.45 0.10 230 / 0.08)",
    description:
      "Engage deeply with the cultural context of your chosen site. Investigate and reinterpret traditional spatial organization, social structures, craftsmanship, symbolism, and the relationship between built form and nature. Tell a story of cultural continuity.",
    tags: ["Vernacular Wisdom", "Symbolism", "Craftsmanship"],
  },
  {
    number: "05",
    icon: Droplets,
    title: "Holistic Sustainability",
    color: "oklch(0.55 0.12 200)",
    lightBg: "oklch(0.55 0.12 200 / 0.08)",
    description:
      "Consider water harvesting, management, and recycling; ecosystem integration; biodiversity enhancement; and social sustainability through community engagement and functional adaptability. Design for the whole system.",
    tags: ["Water Harvesting", "Biodiversity", "Community"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function Themes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="themes" className="py-24 md:py-32 bg-muted/40 overflow-hidden">
      <div className="container-max section-padding">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-primary block mb-3">
            Competition Framework
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            Five Core Themes
          </h2>
          <p className="text-muted-foreground  leading-relaxed">
            Entries must comprehensively address all five interlinked themes. Together they form an
            integrated vision for a resilient, beautiful, zero-carbon tropical future.
          </p>
        </motion.div>

        {/* Themes grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        >
          {themes.map((theme, i) => {
            const Icon = theme.icon;
            return (
              <motion.div
                key={theme.number}
                className={`group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Background accent */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at top left, ${theme.lightBg}, transparent 60%)` }}
                />

                {/* Number */}
                <div className="absolute top-4 right-5 text-5xl font-black opacity-[0.06] text-foreground select-none">
                  {theme.number}
                </div>

                {/* Icon */}
                <motion.div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: theme.lightBg }}
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                >
                  <Icon className="w-6 h-6" style={{ color: theme.color }} />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">
                  {theme.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {theme.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {theme.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border border-border text-muted-foreground group-hover:border-primary/20 group-hover:text-primary/70 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Weight callout */}
        <motion.div
          className="mt-10 p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-4xl font-black text-primary">40%</div>
          <div>
            <div className="font-bold text-foreground">Depth of Response to Themes</div>
            <div className="text-sm text-muted-foreground">
              The largest evaluation criterion — holistic and innovative integration of all five themes is paramount.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
