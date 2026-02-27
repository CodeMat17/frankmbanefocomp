"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, MapPin, Calendar, Trophy, Users } from "lucide-react";

const floatingShapes = [
  { size: 320, left: "3%", top: "8%", delay: 0, duration: 8 },
  { size: 180, left: "88%", top: "5%", delay: 1.5, duration: 10 },
  { size: 240, left: "75%", top: "55%", delay: 0.8, duration: 9 },
  { size: 160, left: "15%", top: "72%", delay: 2.2, duration: 7 },
  { size: 200, left: "50%", top: "80%", delay: 1, duration: 11 },
  { size: 120, left: "35%", top: "15%", delay: 3, duration: 8 },
];

const stats = [
  { icon: Trophy, label: "First Prize", value: "₦5M" },
  { icon: Calendar, label: "Deadline", value: "Jul 31" },
  { icon: MapPin, label: "Site", value: "Nigeria" },
  { icon: Users, label: "Team Size", value: "Up to 4" },
];

const titleWords = ["Tropical", "Futures", "2026"];

function handleScroll(id: string) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden w-full"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-[oklch(0.25_0.10_148)] dark:from-primary/70 dark:via-[oklch(0.20_0.06_148)] dark:to-background" />

      {/* Animated mesh overlay */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.68 0.17 148 / 0.5) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, oklch(0.80 0.17 85 / 0.4) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, oklch(0.52 0.12 38 / 0.3) 0%, transparent 40%)`
        }}
      />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.left,
              top: shape.top,
              background: `radial-gradient(circle, oklch(0.95 0.01 86 / 0.08) 0%, transparent 70%)`,
              border: "1px solid oklch(0.95 0.01 86 / 0.1)",
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 12, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(oklch(0.95 0.01 86) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95 0.01 86) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center section-padding py-32 pt-28"
        style={{ y, opacity }}
      >
        <div className="container-max w-full">
          {/* Competition badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold uppercase tracking-widest mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.80_0.17_85)] animate-pulse" />
            International Architecture Competition · 2026
          </motion.div>

          {/* Organizer */}
          <motion.p
            className="text-white/70 text-sm mb-4 font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Organized by Godfrey Okoye University, Nigeria
          </motion.p>

          {/* Competition name */}
          <motion.h2
            className="text-white/90 text-lg sm:text-xl font-semibold mb-2 tracking-widest uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The Frank Mbanefo Design Competition
          </motion.h2>

          {/* Main title */}
          <div className="overflow-hidden mb-6">
            <motion.div
              className="flex flex-wrap justify-center gap-x-4 gap-y-0"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
            >
              {titleWords.map((word) => (
                <motion.span
                  key={word}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white dark:text-white/80 leading-none tracking-tight block "
                  variants={{
                    hidden: { y: 80, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
                  }}
                >
                  {word === "2026" ? (
                    <span style={{ color: "oklch(0.80 0.17 85)" }}>{word}</span>
                  ) : word}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.p
            className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium mb-3 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Excellence &amp; Innovation Rooted in Indigenous Wisdom
          </motion.p>

          <motion.p
            className="text-white/85 text-sm sm:text-base max-w-xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            Crafting Zero-Carbon Cultural Habitats for the Tropics
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-white/90 font-bold px-8 h-12 text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105 rounded-full"
              onClick={() => handleScroll("#apply")}
            >
              Apply Now — Free Until Apr 15
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:border-white/70 font-semibold px-8 h-12 text-base backdrop-blur-sm rounded-full"
              onClick={() => handleScroll("#about")}
            >
              Explore the Brief
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="relative z-10 w-full border-t border-white/10 bg-white/5 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <div className="container-max section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-5 px-4 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1 }}
              >
                <stat.icon className="w-4 h-4 opacity-60 mb-0.5" />
                <span className="text-xl sm:text-2xl font-black">{stat.value}</span>
                <span className="text-xs font-medium opacity-60 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors"
        onClick={() => handleScroll("#about")}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to learn more"
      >
        <ArrowDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
