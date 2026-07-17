import FadeUp from "@/components/motion/FadeUp";

/**
 * Editorial index label that opens every section:
 * `(01) — SERVICES ©` — mono, uppercase, letter-spaced.
 */
export default function SectionLabel({
  text,
  tone = "terracotta",
  className = "",
}: {
  text: string;
  tone?: "terracotta" | "stone";
  className?: string;
}) {
  return (
    <FadeUp className={className}>
      <p className={`u-label ${tone === "terracotta" ? "text-terracotta" : "text-stone"}`}>
        {text}
      </p>
    </FadeUp>
  );
}
