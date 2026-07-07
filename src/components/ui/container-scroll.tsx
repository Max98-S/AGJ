"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useScroll, useTransform, motion } from "motion/react";

/**
 * Container Scroll — la card ruota da una prospettiva 3D inclinata a piatta
 * mentre si scorre, con il titolo che sale. (Pattern "container scroll".)
 */
export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: ReactNode;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.8, 1] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -110]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[44rem] items-center justify-center p-2 md:h-[56rem] md:p-16"
    >
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }} className="mx-auto max-w-4xl text-center">
          {titleComponent}
        </motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow: "0 30px 80px rgba(13,58,73,0.22)",
          }}
          className="mx-auto -mt-2 w-full max-w-5xl"
        >
          <div className="glass-strong rounded-[28px] border border-white/40 p-2 dark:border-white/10 md:p-3">
            <div className="flex h-[22rem] w-full items-center justify-center overflow-hidden rounded-[22px] md:h-[30rem]">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
