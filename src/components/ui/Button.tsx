import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "inverse";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}

const base =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-7 py-3.5 u-label !text-[12px] transition-colors duration-300";

const variants: Record<Variant, { outer: string; sweep: string }> = {
  primary: {
    outer: "border-ink bg-ink text-ivory hover:text-ivory",
    sweep: "bg-terracotta",
  },
  ghost: {
    outer: "border-ink/40 bg-transparent text-ink hover:border-ink hover:text-ivory",
    sweep: "bg-ink",
  },
  inverse: {
    outer: "border-ivory/40 bg-transparent text-ivory hover:border-terracotta hover:text-ivory",
    sweep: "bg-terracotta",
  },
};

/**
 * Studio button: pill outline/fill with a background sweep that scales up
 * from the bottom on hover; the arrow nudges right.
 */
export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = true,
}: ButtonProps) {
  const v = variants[variant];
  return (
    <Link href={href} className={`${base} ${v.outer} ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-studio group-hover:scale-y-100 motion-reduce:transition-none ${v.sweep}`}
      />
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span
          aria-hidden
          className="relative z-10 inline-block transition-transform duration-300 ease-studio group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      )}
    </Link>
  );
}
