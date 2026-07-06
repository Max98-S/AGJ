"use client";

import { useId } from "react";
import { useReducedMotion } from "motion/react";
import Particles, { ParticlesProvider, useParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

type SparklesProps = {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  color?: string;
  background?: string;
  options?: Partial<ISourceOptions>;
};

const init = async (engine: Engine) => {
  await loadSlim(engine);
};

function SparklesInner({
  className,
  size = 1.2,
  minSize = null,
  density = 200,
  speed = 1,
  minSpeed = null,
  opacity = 0.9,
  opacitySpeed = 2,
  minOpacity = null,
  color = "#0d4a5c",
  background = "transparent",
  options = {},
}: SparklesProps) {
  const { loaded } = useParticlesProvider();
  const reduce = useReducedMotion();
  const id = useId();

  const defaultOptions: ISourceOptions = {
    background: { color: { value: background } },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 60,
    particles: {
      color: { value: color },
      move: {
        enable: true,
        direction: "none",
        speed: { min: minSpeed || speed / 10, max: speed },
        straight: false,
      },
      number: { value: density },
      opacity: {
        value: { min: minOpacity || opacity / 10, max: opacity },
        animation: { enable: true, sync: false, speed: opacitySpeed },
      },
      size: { value: { min: minSize || size / 2.5, max: size } },
    },
    detectRetina: true,
  };

  if (!loaded || reduce) return null;
  return <Particles id={id} options={{ ...defaultOptions, ...options }} className={className} />;
}

export function Sparkles(props: SparklesProps) {
  return (
    <ParticlesProvider init={init}>
      <SparklesInner {...props} />
    </ParticlesProvider>
  );
}
