import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The studio button: a solid block whose hover state sweeps a tilted colour
 * panel up from below while the trailing arrow marches one slot to the right.
 *
 * Structure and the three-arrow trick are ported from the reference's
 * `btn-icon-link`; all colours come from the nearest `theme-*` ancestor.
 */

const ARROW_PATH =
  "M0 6.75758L0 5.24242L9.09091 5.24242L4.92424 1.07576L6 0L12 6L6 12L4.92424 10.9242L9.09091 6.75758L0 6.75758Z";

function Arrow() {
  return (
    <svg
      className="btn-icon-icon__arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path d={ARROW_PATH} fill="currentColor" />
    </svg>
  );
}

interface BtnIconProps {
  label: string;
  /** Omit together with `onClick` for a plain, non-interactive block. */
  href?: string;
  onClick?: () => void;
  /** `secondary` is the inverted (dark-on-light / light-on-dark) variant. */
  variant?: "primary" | "secondary";
  className?: string;
}

function Inner({
  label,
  variant = "secondary",
}: Pick<BtnIconProps, "label" | "variant">) {
  const secondary = variant === "secondary";
  const mod = secondary ? " is-secondary" : "";
  return (
    <div className={`btn-icon-content${mod}`}>
      <div className="btn-icon-content__mask">
        <span className="btn-icon-content__text">{label}</span>
      </div>
      <div className="btn-icon-icon">
        <div className={`btn-icon-icon__bg${mod}`} />
        <div className={`btn-icon-icon__wrap${mod}`}>
          <div className="btn-icon-icon__list">
            <Arrow />
            <Arrow />
            <Arrow />
          </div>
        </div>
      </div>
      <div className={`btn-icon-content__bg${mod}`} />
    </div>
  );
}

export default function BtnIcon({
  label,
  href,
  onClick,
  variant = "secondary",
  className = "",
}: BtnIconProps) {
  const inner: ReactNode = <Inner label={label} variant={variant} />;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`btn-icon-link ${className}`}
      >
        {inner}
      </button>
    );
  }

  if (!href) {
    return <span className={`btn-icon-link ${className}`}>{inner}</span>;
  }

  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={`btn-icon-link ${className}`}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`btn-icon-link ${className}`}>
      {inner}
    </Link>
  );
}
