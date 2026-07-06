"use client";

import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: number | string;
  name: string;
  role?: string;
  avatar: string;
  description: string;
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[];
  showArrows?: boolean;
  showDots?: boolean;
}

const TestimonialCarousel = React.forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  ({ className, testimonials, showArrows = true, showDots = true, ...props }, ref) => {
    const [index, setIndex] = React.useState(0);
    const [exitX, setExitX] = React.useState(0);
    const count = testimonials.length;

    const paginate = (dir: 1 | -1) => {
      setExitX(dir * 320);
      window.setTimeout(() => {
        setIndex((prev) => (prev + dir + count) % count);
        setExitX(0);
      }, 180);
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 100) {
        paginate(info.offset.x > 0 ? -1 : 1);
      }
    };

    return (
      <div ref={ref} className={cn("relative flex flex-col items-center", className)} {...props}>
        <div className="relative h-[300px] w-full max-w-md">
          {testimonials.map((testimonial, i) => {
            const offset = (i - index + count) % count;
            // Only render the current card and the two behind it.
            if (offset > 2) return null;

            const isCurrent = offset === 0;

            return (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0 select-none"
                style={{ zIndex: count - offset }}
                drag={isCurrent ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={isCurrent ? handleDragEnd : undefined}
                initial={false}
                animate={{
                  x: isCurrent ? 0 : offset * 16,
                  y: offset * 14,
                  scale: 1 - offset * 0.05,
                  rotate: isCurrent ? 0 : offset % 2 === 0 ? 3 : -3,
                  opacity: offset > 1 ? 0.4 : 1,
                }}
                exit={{ x: exitX, opacity: 0, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                whileTap={isCurrent ? { cursor: "grabbing" } : undefined}
              >
                <div className="glass-strong testimonial-card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7">
                  <div className="absolute -right-3 -top-3 text-petrol/10">
                    <Quote size={96} strokeWidth={1} />
                  </div>

                  {showArrows && isCurrent && (
                    <div className="absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 justify-between">
                      <button
                        type="button"
                        aria-label="Testimonianza precedente"
                        onClick={() => paginate(-1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-petrol shadow-md backdrop-blur transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Testimonianza successiva"
                        onClick={() => paginate(1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-petrol shadow-md backdrop-blur transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  <p className="relative z-10 text-base leading-relaxed text-foreground/90">
                    “{testimonial.description}”
                  </p>

                  <div className="relative z-10 mt-6 flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      draggable={false}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-petrol/30"
                    />
                    <div>
                      <div className="font-display font-semibold text-petrol dark:text-teal-100">
                        {testimonial.name}
                      </div>
                      {testimonial.role && (
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {showDots && (
          <div className="mt-6 flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Vai alla testimonianza ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-petrol dark:bg-teal-300"
                    : "w-2 bg-petrol/30 hover:bg-petrol/50 dark:bg-teal-300/40 dark:hover:bg-teal-300/70",
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
TestimonialCarousel.displayName = "TestimonialCarousel";

export { TestimonialCarousel };
