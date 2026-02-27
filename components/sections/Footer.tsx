"use client";

import { motion } from "framer-motion";
import { Leaf, Mail, ExternalLink, ArrowUp } from "lucide-react";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Core Themes", href: "#themes" },
  { label: "Design Brief", href: "#program" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Schedule", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Apply", href: "#apply" },
  { label: "Submit", href: "#submit" },
];

function handleScroll(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-max section-padding py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black">TROPICAL FUTURES 2026</div>
                <div className="text-sm text-primary-foreground/60">Frank Mbanefo Design Competition</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs mb-4">
              Challenging the next generation of architects to craft zero-carbon cultural habitats
              rooted in indigenous tropical wisdom.
            </p>
            <a
              href="mailto:info@gouni.edu.ng"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@gouni.edu.ng
            </a>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">
              Quick Links
            </div>
            <ul className="space-y-2">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleScroll(link.href); }}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">
              Participate
            </div>
            <ul className="space-y-2">
              {quickLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleScroll(link.href); }}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-primary-foreground/10 space-y-2">
              <a
                href="https://gouni.edu.ng/tropicalfutures2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Official Site <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://oxi-zen.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                OXÏ-ZEN Sponsor <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-xs text-primary-foreground/50">
              © 2026 Godfrey Okoye University. All intellectual property rights remain with the authors.
            </p>
            <p className="text-xs text-primary-foreground/40">
              The organizers retain the right to exhibit and publish all submitted work with full author credit.
            </p>
          </div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-semibold text-primary-foreground/60 hover:text-primary-foreground transition-colors group"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
