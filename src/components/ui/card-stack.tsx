"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SquareArrowOutUpRight } from "lucide-react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 420,
  cardHeight = 280,
  overlap = 0.48,
  spreadDeg = 36,
  perspectivePx = 1100,
  depthPx = 120,
  tiltXDeg = 10,
  activeLiftPx = 18,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = true,
  intervalMs = 3500,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;
  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);
  // Touch/pointer swipe: record the gesture start, and if it travels far
  // enough horizontally, advance the deck. `swipedRef` then suppresses the
  // synthetic click so a swipe never doubles as a tap-to-open.
  const pointerStart = React.useRef<{ x: number; y: number } | null>(null);
  const swipedRef = React.useRef(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);
  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;
  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);
  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;
    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;
  const activeItem = items[active]!;

  return (
    <div
      className={cn("relative w-full select-none outline-none overflow-hidden", className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onPointerDown={(e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
        swipedRef.current = false;
      }}
      onPointerUp={(e) => {
        const s = pointerStart.current;
        pointerStart.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          swipedRef.current = true;
          if (dx < 0) next();
          else prev();
        }
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
      onClickCapture={(e) => {
        if (swipedRef.current) {
          e.preventDefault();
          e.stopPropagation();
          swipedRef.current = false;
        }
      }}
    >
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ height: cardHeight + 80, perspective: perspectivePx }}
      >
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const off = signedOffset(i, active, len, loop);
            const abs = Math.abs(off);
            if (abs > maxOffset) return null;
            const rotateZ = off * stepDeg;
            const x = off * cardSpacing;
            const y = abs * 10;
            const z = -abs * depthPx;
            const isActive = off === 0;
            const scale = isActive ? activeScale : inactiveScale;
            const lift = isActive ? -activeLiftPx : 0;
            const rotateX = isActive ? 0 : tiltXDeg;
            const zIndex = 100 - abs;

            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transformStyle: "preserve-3d",
                  zIndex,
                }}
                initial={false}
                animate={{ x, y: y + lift, z, rotateZ, rotateX, scale, opacity: 1 }}
                transition={{ type: "spring", stiffness: springStiffness, damping: springDamping }}
                onClick={() => setActive(i)}
              >
                <div className="w-full h-full">
                  {renderCard ? (
                    renderCard(item, { active: isActive })
                  ) : (
                    <DefaultFanCard item={item} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {showDots ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    on ? "bg-foreground w-6" : "bg-foreground/30 hover:bg-foreground/50",
                  )}
                  aria-label={`Vai a ${it.title}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              {activeItem.ctaLabel ?? "Scopri di più"}
              <SquareArrowOutUpRight size={12} />
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem }) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {item.tag && (
          <span className="inline-block px-2 py-0.5 mb-2 rounded-full text-[10px] uppercase tracking-wider bg-white/15 backdrop-blur">
            {item.tag}
          </span>
        )}
        <h3 className="text-xl font-display font-semibold leading-tight">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-white/85 line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}
