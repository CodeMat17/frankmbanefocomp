"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LayoutGrid,
  Hammer,
  Database,
  Users,
  Coffee,
  Building,
  TreePine,
  MapPin,
  FileText,
} from "lucide-react";

const programItems = [
  { icon: LayoutGrid, title: "Flexible Exhibition & Gallery Spaces", desc: "Cultural exchange and art display" },
  { icon: Hammer, title: "2–3 Traditional Craft Workshops", desc: "Weaving, pottery, woodworking" },
  { icon: Database, title: "Multi-Media Digital Archive / Library", desc: "Preservation of indigenous knowledge" },
  { icon: Users, title: "Communal Courtyard / Auditorium", desc: "Gatherings, performances, events" },
  { icon: Coffee, title: "Café / Kiosk", desc: "Locally sourced produce" },
  { icon: Building, title: "Administrative & Support Spaces", desc: "Offices, storage, toilets" },
  { icon: TreePine, title: "Outdoor Community Spaces", desc: "Ecological demonstration areas" },
];

const boards = [
  {
    title: "Board 01",
    subtitle: "Concept & Site Strategy",
    items: ["Concept narrative", "Site plan with climate analysis", "Thermal, wind & sun path diagrams"],
  },
  {
    title: "Board 02",
    subtitle: "Architectural Design",
    items: ["Plans at min. 1:200", "Sections and elevations", "Material strategy sketches"],
  },
  {
    title: "Board 03",
    subtitle: "Sustainability & Materials",
    items: ["Environmental performance diagrams", "Material sourcing & carbon analysis", "Energy strategy diagrams"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function Program() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="program" className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container-max section-padding">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Header */}
          <motion.div className="text-center max-w-2xl mx-auto mb-16" variants={fadeUp}>
            <span className="text-sm font-bold uppercase tracking-widest text-primary-foreground/60 block mb-3">
              Design Challenge
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-primary-foreground mb-4">
              The Program Brief
            </h2>
            <p className="text-primary-foreground/70 leading-relaxed">
              A Community Cultural Node &amp; Learning Centre — approximately 1,500–2,000 m²,
              designed as a hub for cultural exchange, traditional craft, digital learning, and community.
            </p>
          </motion.div>

          {/* Size callout */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 text-center"
            variants={fadeUp}
          >
            <div className="p-6 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10">
              <div className="text-4xl font-black text-primary-foreground">1,500–2,000</div>
              <div className="text-sm text-primary-foreground font-medium mt-1">Square Metres</div>
            </div>
            <div className="p-6 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10">
              <div className="text-4xl font-black text-primary-foreground flex items-center gap-2">
                <MapPin className="w-8 h-8" /> Nigeria
              </div>
              <div className="text-sm text-primary-foreground font-medium mt-1">Any Real Nigerian Site</div>
            </div>
            <div className="p-6 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10">
              <div className="text-4xl font-black text-primary-foreground">Multi-</div>
              <div className="text-sm text-primary-foreground font-medium mt-1">Purpose Facility</div>
            </div>
          </motion.div>

          {/* Program spaces grid */}
          <motion.div className="mb-16" variants={fadeUp}>
            <h3 className="text-xl font-bold text-primary-foreground mb-6 text-center">Required Spaces</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {programItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 hover:bg-primary-foreground/10 hover:border-primary-foreground/30 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary-foreground/70" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-foreground leading-tight">{item.title}</div>
                      <div className="text-sm text-primary-foreground/50 mt-0.5">{item.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Submission boards */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-primary-foreground/70" />
              <h3 className="text-xl font-bold text-primary-foreground/90">Submission Boards (A1 Landscape)</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {boards.map((board, i) => (
                <motion.div
                  key={board.title}
                  className="p-5 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="text-sm font-bold uppercase tracking-widest text-primary-foreground/40 mb-1">{board.title}</div>
                  <div className="font-bold text-primary-foreground mb-3">{board.subtitle}</div>
                  <ul className="space-y-1.5">
                    {board.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-foreground/40 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-6 p-4 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 text-sm text-primary-foreground/70 space-y-1"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              <p>
                <strong className="text-primary-foreground">Format:</strong> Single PDF (max 20 MB) · 3 A1 boards (landscape) + optional 3D renders + 300-word project summary
              </p>
              <p>
                <strong className="text-primary-foreground">Anonymous:</strong> No names or school insignia on boards — blind review process
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
