import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pulsing "+" chip that marks a card as expandable — the visual promise
 * that "there is more here if you're curious".
 *
 * Behaviour:
 *   • At rest a soft ring pings every ~3s, so the affordance reads even
 *     on a still page (and on touch devices, where hover doesn't exist).
 *   • On card hover the plus rotates 90° and a label slides out.
 *
 * It is purely decorative (aria-hidden + pointer-events-none): the whole
 * card remains the real, accessible click target. Requires an ancestor
 * with the `group` class — GlassCard's wrapper already provides one.
 */
export function CardHint({
  label = "Approfondisci",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center overflow-hidden rounded-full border border-petrol/20 bg-white/70 px-1.5 py-1.5 text-petrol backdrop-blur-sm transition-all duration-500 tr-premium group-hover:px-2.5 dark:border-teal-300/25 dark:bg-white/10 dark:text-teal-300",
        className,
      )}
    >
      <span className="hint-ring" />
      <Plus
        size={13}
        strokeWidth={2.75}
        className="shrink-0 transition-transform duration-500 tr-premium group-hover:rotate-90"
      />
      <span className="max-w-0 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider opacity-0 transition-all duration-500 tr-premium group-hover:ml-1.5 group-hover:max-w-[8rem] group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
