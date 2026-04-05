"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Must there be an architecture student in every group?",
    a: "Yes. Every team must include at least one architecture student. The competition is design-focused, and an architecture student is required to anchor the team's design approach.",
  },
  {
    q: "Can it be a solo entry?",
    a: "No. All entries must be team-based, with a minimum of 2 members. This is a collaborative competition.",
  },
  {
    q: "How many members can a group have?",
    a: "Teams must have between 2 and 5 members. Collaboration across disciplines is strongly encouraged.",
  },
  {
    q: "Can 100- and 200-level students participate?",
    a: "Yes. Students from all levels — including 100 and 200 level — are eligible to join a team.",
  },
  {
    q: "How do computer science / software engineering students fit into an architecture competition?",
    a: "Technology and design go hand-in-hand here. Computer science and software engineering students contribute through the use of AI tools, generative design software, parametric modelling, visualisation, and other digital technologies that help bring architectural ideas to life.",
  },
  {
    q: "What does the design really involve?",
    a: "The competition challenges teams to incorporate traditional African and tropical architectural principles into contemporary design solutions. Full details — site, programme, and deliverables — are provided in the brief, which will be available on this website when registration opens.",
  },
  {
    q: "How do I access the brief?",
    a: "The brief will be published on this competition website when registration opens on April 15, 2026. All registered participants will also receive a direct link via email.",
  },
  {
    q: "How will submissions be made?",
    a: "All submissions are made digitally through the competition portal on this website. Registered teams will receive a unique submission code, which is required to upload their design work.",
  },
  {
    q: "Can architecture jurors assist students during the process?",
    a: "Yes — jurors who teach at the university may provide guidance in the classroom as part of normal academic instruction. However, they may not give students the core design idea or solution. Their role is to help teams navigate the problem, not solve it for them.",
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="faq" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container-max section-padding">
        <motion.div
          ref={ref}
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-primary block mb-3">
            Got Questions?
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know before you register.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.45 }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="border border-border rounded-2xl px-5 bg-card data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
