// Motion tokens for JS animations — keep in sync with the CSS vars in app/globals.css.
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuint: [0.83, 0, 0.17, 1],
} as const;

export const dur = {
  fast: 0.16,
  base: 0.32,
  slow: 0.7,
} as const;

export const spring = {
  /** snappy: buttons, magnetic pulls */
  snappy: { type: "spring", stiffness: 260, damping: 18, mass: 0.6 },
  /** soft: progress bars, layout shifts */
  soft: { type: "spring", stiffness: 120, damping: 24 },
} as const;
