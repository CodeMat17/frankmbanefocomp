"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { scale: 0, rotate: -10, opacity: 0 },
  visible: { scale: 1, rotate: 0, opacity: 1, transition: { duration: 0.5, type: "spring" as const } },
};

const lineGrow = {
  hidden: { width: 0 },
  visible: { width: "80px", transition: { duration: 0.8 } },
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container-max section-padding">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 items-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
        >
          {/* Left — pull quote */}
          <motion.div className="relative" variants={stagger}>
            <motion.div className="text-primary/20 mb-4" variants={scaleIn}>
              <Quote className="w-16 h-16 fill-current" />
            </motion.div>

            <motion.blockquote
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug mb-8"
              variants={fadeUp}
            >
              Design buildings that are{" "}
              <span className="text-primary italic">of their place,</span>{" "}
              for their place — achieving carbon neutrality while{" "}
              <span className="text-primary italic">strengthening culture.</span>
            </motion.blockquote>

            {/* Decorative line */}
            <motion.div
              className="h-1 rounded-full bg-linear-to-r from-primary to-[oklch(0.65_0.14_68)]"
              variants={lineGrow}
            />

            {/* Background decoration */}
            <div className="absolute -left-6 -top-6 w-48 h-48 rounded-full bg-primary/5 -z-10 blur-2xl" />
          </motion.div>

          {/* Right — text */}
          <motion.div className="space-y-6" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
                Competition Vision
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4 leading-tight">
                Reimagining the Built Environment for Equatorial Climates
              </h2>
            </motion.div>

            <motion.p className="text-muted-foreground text-base leading-relaxed" variants={fadeUp}>
              The world&apos;s tropical regions, home to immense biodiversity and rich cultural traditions,
              are on the frontline of the climate crisis. Architecture here faces a dual imperative:
              mitigate environmental impact through zero-carbon strategies, and adapt to unique climatic
              challenges while respectfully engaging with cultural identity.
            </motion.p>

            <motion.p className="text-muted-foreground text-base leading-relaxed" variants={fadeUp}>
              We seek proposals that are not just technically proficient but{" "}
              <strong className="text-foreground">poetically grounded</strong> — where advanced
              sustainable material science and energy modeling converse with vernacular wisdom,
              spatial narratives, and cultural memory.
            </motion.p>

            {/* Key attributes */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" variants={stagger}>
              {[
                { label: "Zero Carbon", desc: "Net Zero Embodied & Operational" },
                { label: "Site-Specific", desc: "Real Nigerian site, real context" },
                { label: "Culturally Rooted", desc: "Authentic vernacular engagement" },
                { label: "1,500–2,000 m²", desc: "Community Cultural Node" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                >
                  <div className="text-lg font-bold text-foreground mb-1">{item.label}</div>
                  <div className="text-muted-foreground">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
