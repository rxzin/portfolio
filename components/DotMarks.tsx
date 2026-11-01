import { Dotm3x3_11 } from "@/components/ui/dotm-3x3-11";
import { DotmSquare12 } from "@/components/ui/dotm-square-12";

// Animated dot-matrix marks (from dotmatrix.zzzzshawn.cloud) used in place of the "RC" initials.
// The loaders announce themselves as "Loading" status regions, so they're wrapped in aria-hidden:
// here they are decoration next to the name, not a loading state.
// Sizing: boxSize scales the grid uniformly into a smaller box. The vendor wrapper lets the grid
// flex-shrink horizontally before scaling (squashing it left-to-right), so [&_.dmx-root]:shrink-0
// below keeps its width; only the uniform scale applies.
// Color: "solid-theme" reads --color-dot-on (defined in globals.css from --ink), so it follows the theme.

/** Small mark beside the name in the nav. */
export function NavMark() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 [&_.dmx-root]:shrink-0"
    >
      <Dotm3x3_11
        size={72}
        dotSize={17}
        speed={1.25}
        colorPreset="solid-theme"
        pattern="full"
        dotShape="circle"
        animated
        hoverAnimated={false}
        muted={false}
        bloom={false}
        halo={0}
        opacityBase={0.06}
        opacityMid={0.38}
        opacityPeak={1}
        cellPadding={1}
        // boxSize scales the whole grid into a 28px box (same look, sized to sit beside the nav text)
        boxSize={28}
        minSize={0}
      />
    </span>
  );
}

/** Large mark beside the name in the intro. */
export function HeroMark() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 [&_.dmx-root]:shrink-0"
    >
      <DotmSquare12
        size={108}
        dotSize={16}
        speed={1.35}
        colorPreset="solid-theme"
        pattern="full"
        dotShape="circle"
        animated
        hoverAnimated={false}
        muted={false}
        bloom={false}
        halo={0}
        opacityBase={0.12}
        opacityMid={0.42}
        opacityPeak={1}
        cellPadding={0}
        // boxSize scales the whole grid into a 64px box (fits the intro panel)
        boxSize={64}
        minSize={0}
      />
    </span>
  );
}
