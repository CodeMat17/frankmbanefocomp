"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Shield, Globe, Zap } from "lucide-react";

const oxizenFeatures = [
  {
    icon: Shield,
    title: "IPCC-Grade Science",
    desc: "Verified carbon accounting aligned with the highest scientific standards",
  },
  {
    icon: Globe,
    title: "UN-Aligned Governance",
    desc: "Transparent, traceable carbon balancing with zero double counting",
  },
  {
    icon: Zap,
    title: "Real-Time Verification",
    desc: "Blockchain-based infrastructure connecting emitters with nature-based sequestration",
  },
];

export default function Sponsors() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-20 md:py-28 bg-muted/40 overflow-hidden">
      <div className="container-max section-padding" ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground block mb-2">
            Partners & Sponsors
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground">
            Organized &amp; Sponsored By
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Godfrey Okoye University */}
          <motion.div
            className="p-6 sm:p-8 rounded-2xl border border-border bg-card"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-black text-primary">GU</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Organizer
                </div>
                <h3 className="font-bold text-foreground leading-tight">
                  Godfrey Okoye University
                </h3>
                <p className="text-sm text-muted-foreground">Enugu, Nigeria</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A leading Catholic university in Enugu State, committed to academic excellence,
              innovation, and the development of future-ready professionals rooted in African
              values and global best practices.
            </p>
            <a
              href="https://gouni.edu.ng/tropicalfutures2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2"
            >
              gouni.edu.ng <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* OXÏ-ZEN */}
          <motion.div
            className="p-6 sm:p-8 rounded-2xl border border-primary/20 bg-card relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -3 }}
          >
            {/* Subtle green glow */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-black text-primary">Ö</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Sponsor
                </div>
                <h3 className="font-bold text-foreground leading-tight">
                  OXÏ-ZEN Solutions LLC
                </h3>
                <p className="text-sm text-muted-foreground">Zug, Switzerland</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The world&apos;s first blockchain-based global carbon standard. OXÏ-ZEN unites
              IPCC-grade science with UN-aligned governance and ultra-low-emission digital
              infrastructure — enabling transparent, traceable carbon balancing and real support
              for climate action and indigenous communities.
            </p>

            <div className="space-y-2 mb-4">
              {oxizenFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-foreground">{feature.title}: </span>
                      <span className="text-xs text-muted-foreground">{feature.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="https://oxi-zen.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2"
            >
              oxi-zen.io <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Inspiration banner */}
        <motion.div
          className="mt-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            Inspired by the rigour of ACSA/AISC, UIA International Student Competitions,
            MIT Climate CoLab, Harvard GSD, ETH Zurich, TU Delft, and the Bamboo International Design Competition.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
