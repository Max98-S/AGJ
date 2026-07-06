"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React from "react";

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
  dotColor = "rgba(13,74,92,0.18)",
  dotColorHover = "rgba(13,74,92,0.45)",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  dotColor?: string;
  dotColorHover?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const dots = (color: string) => `radial-gradient(circle, ${color} 1px, transparent 1px)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative h-full w-full flex items-center bg-transparent justify-center group",
        containerClassName,
      )}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: dots(dotColor), backgroundSize: "16px 16px" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: dots(dotColorHover),
          backgroundSize: "16px 16px",
          WebkitMaskImage: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
          maskImage: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block px-1 pb-1 rounded-lg bg-gradient-to-r from-[#0d4a5c]/20 to-[#2a8aa0]/30 dark:from-[#2a8aa0]/45 dark:to-[#4fb1c4]/55",
        className,
      )}
    >
      {children}
    </motion.span>
  );
};
