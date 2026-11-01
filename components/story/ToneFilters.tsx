// SVG filters that give every photo the reference's treatment. Rendered once per page; images use
// them via `filter: url(#tone-…)`. Each maps luminance through a color ramp (a "duotone").

const LUMA =
  "0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0";

export default function ToneFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {/* black → deep crimson → bright crimson → pink-white highlights */}
        <filter id="tone-crimson" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={LUMA} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0.24 0.66 0.9 1" />
            <feFuncG type="table" tableValues="0 0 0.05 0.28 0.86" />
            <feFuncB type="table" tableValues="0 0.03 0.13 0.32 0.86" />
          </feComponentTransfer>
        </filter>
        {/* high-contrast black and white: crushed blacks so backgrounds vanish, crisp whites */}
        <filter id="tone-mono" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={LUMA} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0.03 0.42 0.88 1" />
            <feFuncG type="table" tableValues="0 0.03 0.42 0.88 1" />
            <feFuncB type="table" tableValues="0 0.03 0.42 0.88 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
