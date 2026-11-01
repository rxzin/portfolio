# Variant "newui": images

All images are real photographs from [Unsplash](https://unsplash.com), each verified as **free under the
[Unsplash License](https://unsplash.com/license)** (not Unsplash+): free for commercial and personal use, no
permission needed. Attribution isn't required, but the footer credits Unsplash and the photographers are listed below.

## How they get the reference's look (no manual editing)

- **Crop**: downloaded at each slot's exact aspect ratio via Unsplash's image service (`fit=crop&crop=entropy`).
- **Tone**: SVG duotone filters in `components/story/ToneFilters.tsx`. `crimson` maps luminance to black → deep
  crimson → pink-white; `mono` is high-contrast black and white with crushed blacks.
- **Cutout effect**: the photos have dark backgrounds; `mix-blend-mode: screen` (on each image's Parallax wrapper)
  makes black disappear into the page, and a soft radial edge mask in `Art.tsx` hides the rectangle.

## Files (`public/newui/`)

| File | Where | Tone | Photographer | Source |
|---|---|---|---|---|
| `hero-hand.jpg` | Hero | crimson | Mathew Schwartz | [Unsplash](https://unsplash.com/photos/a-close-up-of-a-red-bike-with-a-black-background-zIIXVa5BwvM) |
| `robot-head.jpg` | 05 Projects | crimson | Gabriele Malaspina | [Unsplash](https://unsplash.com/photos/a-white-robot-is-standing-in-front-of-a-black-background-CjWsslYVnPI) |
| `server-rack.jpg` | 03 Experience | crimson | Domaintechnik | [Unsplash](https://unsplash.com/photos/server-rack-with-blinking-green-lights-VHmBX7FnXw0) |
| `satellite.jpg` | 04 Internships | crimson | Mara F | [Unsplash](https://unsplash.com/photos/satellite-orbiting-earth-with-clouds-below--KkCYytNb1s) |
| `cable-tangle.jpg` | Finale | mono | Felipe Correia | [Unsplash](https://unsplash.com/photos/grayscale-photography-of-strings-jG0Y-aDts5s) |
| `debris-1.jpg` | 06 Stack margin | mono | David Farkas | [Unsplash](https://unsplash.com/photos/medical-iv-bags-are-hanging-in-a-row-RcfSYf4r0lE) |
| `debris-2.jpg` | 06 Stack margin | mono | Igor Omilaev | [Unsplash](https://unsplash.com/photos/a-close-up-of-a-multicolored-rope-on-a-black-background-R4xgDZ8jtKo) |
| `debris-3.jpg` | 06 Stack margin | mono | Rutwik Deshmukh | [Unsplash](https://unsplash.com/photos/black-and-white-iphone-case-SvS3fVHArM4) |
| `debris-4.jpg` | 06 Stack margin | mono | Dennis Brekke | [Unsplash](https://unsplash.com/photos/white-coated-wire-Z0tB7Rr4xx4) |

## Swapping an image

Replace the file in `public/newui/` (same name, a photo on a **dark background** so the blend works), then rebuild.
Delete a file and that slot shows a labeled placeholder of the same size. Aspect ratios: hero-hand and satellite 3:2,
robot-head 4:5, server-rack 2:3, cable-tangle and debris 1:1.
