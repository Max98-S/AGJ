"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type TargetAndTransition, type Variants } from "motion/react";
import React from "react";

type PresetType = "blur" | "shake" | "scale" | "fade" | "slide";

type TextEffectProps = {
  children: string;
  per?: "word" | "char" | "line";
  as?: keyof React.JSX.IntrinsicElements;
  variants?: { container?: Variants; item?: Variants };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  segmentWrapperClassName?: string;
};

const defaultStagger = { char: 0.03, word: 0.05, line: 0.1 } as const;

const defaultContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const defaultItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const presets: Record<PresetType, { container: Variants; item: Variants }> = {
  blur: {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, filter: "blur(12px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(12px)" },
    },
  },
  shake: {
    container: defaultContainer,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
      exit: { x: 0 },
    },
  },
  scale: {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: { container: defaultContainer, item: defaultItem },
  slide: {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const Segment = React.memo(function Segment({
  segment,
  variants,
  per,
  segmentWrapperClassName,
}: {
  segment: string;
  variants: Variants;
  per: "line" | "word" | "char";
  segmentWrapperClassName?: string;
}) {
  const content =
    per === "line" ? (
      <motion.span variants={variants} className="block">
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span aria-hidden="true" variants={variants} className="inline-block whitespace-pre">
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((c, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            variants={variants}
            className="inline-block whitespace-pre"
          >
            {c}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) return content;
  const def = per === "line" ? "block" : "inline-block";
  return <span className={cn(def, segmentWrapperClassName)}>{content}</span>;
});

export function TextEffect({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps) {
  const segments =
    per === "line"
      ? children.split("\n")
      : per === "word"
        ? children.split(/(\s+)/)
        : children.split("");

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const sel = preset ? presets[preset] : { container: defaultContainer, item: defaultItem };
  const containerVariants = variants?.container || sel.container;
  const itemVariants = variants?.item || sel.item;
  const stagger = defaultStagger[per];

  const delayed: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as TargetAndTransition)?.transition,
        staggerChildren:
          (containerVariants.visible as TargetAndTransition)?.transition?.staggerChildren ||
          stagger,
        delayChildren: delay,
      },
    },
    exit: containerVariants.exit,
  };

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-label={per === "line" ? undefined : children}
          variants={delayed}
          className={cn("whitespace-pre-wrap", className)}
          onAnimationComplete={onAnimationComplete}
        >
          {segments.map((s, i) => (
            <Segment
              key={`${per}-${i}-${s}`}
              segment={s}
              variants={itemVariants}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
