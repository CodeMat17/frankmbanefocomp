"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Themes", href: "#themes" },
  { label: "Program", href: "#program" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Schedule", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-sm"
            : "bg-transparent"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary origin-left"
          style={{ scaleX: scrollYProgress }}
        />

        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-shadow">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold leading-none text-foreground">
                  TROPICAL FUTURES
                </div>
                <div className="text-xs text-muted-foreground leading-none mt-0.5">
                  2026
                </div>
              </div>
            </motion.a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                variant="outline"
                className="hidden md:flex"
                onClick={() => handleNavClick("#submit")}
              >
                Submit Work
              </Button>
              <Button
                size="sm"
                className="hidden md:flex"
                onClick={() => handleNavClick("#apply")}
              >
                Apply Now
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-16 left-0 right-0 glass border-t border-border shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="section-padding py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="pt-4 flex flex-col gap-2 border-t border-border">
                  <Button variant="outline" onClick={() => handleNavClick("#submit")}>
                    Submit Work
                  </Button>
                  <Button onClick={() => handleNavClick("#apply")}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
