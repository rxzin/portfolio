import { useSyncExternalStore } from "react";

// Pixel densities for WebGL canvases on touch devices. Phones vary too much for one fixed value, so
// start at the first and step down, for the rest of the visit, whenever the page can't keep up.
const LEVELS = [1, 0.75, 0.5];
const MIN_FPS = 24;
const WINDOW_MS = 1000;

let level = 0;
let watching = false;
const listeners = new Set<() => void>();

const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

function watchFrameRate() {
  if (watching) return;
  watching = true;

  let start = 0;
  let last = 0;
  let frames = 0;
  let slowWindows = 0;
  const tick = (now: number) => {
    // a long gap is a backgrounded tab or a shader compiling, not the frame rate
    if (now - last > WINDOW_MS) {
      start = now;
      frames = 0;
    }
    last = now;
    frames++;

    if (now - start >= WINDOW_MS) {
      // two slow windows in a row, so one hiccup (hydration, a shader compiling) can't lower quality for good
      const slow = (frames * 1000) / (now - start) < MIN_FPS;
      slowWindows = slow ? slowWindows + 1 : 0;
      if (slowWindows === 2) {
        slowWindows = 0;
        level++;
        for (const notify of listeners) notify();
      }
      start = now;
      frames = 0;
    }
    if (level < LEVELS.length - 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (isTouch()) watchFrameRate();
  return () => listeners.delete(onChange);
}

/** The `dpr` to give a WebGL canvas: reduced on touch devices, undefined (the component's default) elsewhere. */
export function useRenderDpr() {
  return useSyncExternalStore(
    subscribe,
    () => (isTouch() ? LEVELS[level] : undefined),
    () => undefined,
  );
}
