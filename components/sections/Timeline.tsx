"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarDays, CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    date: "Mar 1, 2026",
    label: "Competition Launch",
    desc: "Official launch of Tropical Futures 2026. Brief and registration portal go live.",
    status: "upcoming",
  },
  {
    date: "Apr 15, 2026",
    label: "Early Registration",
    highlight: "Fee: NGN 10,000",
    desc: "Register early to save. All registered teams gain access to the Q&A portal.",
    status: "upcoming",
  },
  {
    date: "May 15, 2026",
    label: "Standard Registration",
    highlight: "Fee: NGN 25,000",
    desc: "Final deadline for new registrations.",
    status: "upcoming",
  },
  {
    date: "Until Jul 1",
    label: "Q&A Period",
    desc: "FAQs updated bi-weekly. Submit clarification questions through the portal.",
    status: "upcoming",
  },
  {
    date: "Jul 31, 2026",
    label: "Submission Deadline",
    highlight: "23:59 WAT",
    desc: "Final PDF submissions due. No extensions will be granted.",
    status: "upcoming",
    important: true,
  },
  {
    date: "Nov 2026",
    label: "Jury Deliberation",
    desc: "International jury reviews all submissions. Scores are tabulated.",
    status: "future",
  },
  {
    date: "Dec 15, 2026",
    label: "Winners Announced",
    desc: "Results published on the competition website and sent to all participants.",
    status: "future",
  },
  {
    date: "Feb / Mar 2027",
    label: "Exhibition & Symposium",
    desc: "Winners present at a symposium. All shortlisted work exhibited and published.",
    status: "future",
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="timeline" className="py-24 md:py-32 bg-muted/40 overflow-hidden">
      <div className="container-max section-padding">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-primary block mb-3">
            Key Dates
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            Competition Schedule
          </h2>
          <p className="text-muted-foreground text-base">
            Mark your calendar. All times in West Africa Time (WAT, UTC+1).
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <motion.div
            className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-border"
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />

          <div className="space-y-6">
            {events.map((event, i) => {
              const isRight = i % 2 === 0;
              return (
                <motion.div
                  key={event.label}
                  className={cn(
                    "relative flex items-start gap-4 sm:gap-8",
                    "pl-14 sm:pl-0",
                    isRight ? "sm:flex-row" : "sm:flex-row-reverse"
                  )}
                  initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                >
                  {/* Content box */}
                  <div className={cn("flex-1 sm:max-w-[45%]", isRight ? "sm:text-right" : "sm:text-left")}>
                    <motion.div
                      className={cn(
                        "p-4 rounded-xl border bg-card hover:shadow-md transition-all",
                        event.important
                          ? "border-primary/40 bg-primary/5 shadow-sm"
                          : "border-border"
                      )}
                      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                    >
                      <div className={cn("flex items-center gap-2 mb-1 flex-wrap", isRight ? "sm:justify-end" : "sm:justify-start")}>
                        <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs font-bold text-primary">{event.date}</span>
                        {event.highlight && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                            {event.highlight}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-foreground text-sm mb-1">{event.label}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{event.desc}</div>
                    </motion.div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-4 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 400 }}
                    >
                      {event.status === "past" ? (
                        <CheckCircle2 className="w-5 h-5 text-primary fill-primary" />
                      ) : event.important ? (
                        <div className="w-5 h-5 rounded-full bg-primary ring-4 ring-primary/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-border fill-background" />
                      )}
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden sm:block flex-1 sm:max-w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Registration note */}
        <motion.div
          className="mt-12 text-center p-6 rounded-2xl border border-primary/20 bg-primary/5 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
        >
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground mb-1">Early Bird Advantage</p>
          <p className="text-sm text-muted-foreground">
            Register by <strong className="text-foreground">April 15</strong> to save NGN 15,000 and gain
            early access to the FAQ portal.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
