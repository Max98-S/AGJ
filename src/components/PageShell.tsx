import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { GeometricBackground } from "./GeometricBackground";
import { TextEffect } from "./ui/text-effect";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <GeometricBackground />
      <Nav />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32"
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 text-center relative">
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass rounded-full text-xs uppercase tracking-[0.2em] text-violet-glow mb-6"
        >
          {eyebrow}
        </motion.span>
      )}
      <TextEffect
        as="h1"
        per="word"
        preset="blur"
        delay={0.1}
        className="text-5xl md:text-7xl font-bold text-petrol dark:text-teal-100 leading-[1.05] max-w-5xl mx-auto"
      >
        {title}
      </TextEffect>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </section>
  );
}
