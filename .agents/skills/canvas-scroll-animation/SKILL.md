---
name: canvas-scroll-animation
description: >-
  Build Apple-style canvas scroll-driven image sequence animations with smooth 60fps lerp
  interpolation, progressive WebP preloading, aspect-fill cover scaling, and multi-phase
  storytelling overlays. Use this skill whenever the user requests a scroll-driven canvas animation,
  video scrub on scroll, Apple-like product sequence scroll, or interactive timeline hero section.
---

# Canvas Scroll Animation (Apple-Style Video Scrub)

A production-grade guide for building buttery-smooth, 60fps scroll-driven canvas image sequence animations (as seen on Apple product pages, high-end automotive, and architectural showcases).

## Included Resources

- Frame Extraction Script: [extract_frames.py](./scripts/extract_frames.py)
- React Component Example: [CanvasScrollHero.tsx](./examples/CanvasScrollHero.tsx)
- Styling & Layout Example: [CanvasScrollHero.module.css](./examples/CanvasScrollHero.module.css)

---

## 1. Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│  Scroll Container (height: 400vh)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Sticky Viewport (position: sticky; top: 0; 100vh)│  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  <canvas> (covers viewport, aspect-fill)    │ │  │
│  │  ├──────────────────────────────────────────────┤ │  │
│  │  │  Vignette & Gradient Overlays                │ │  │
│  │  ├──────────────────────────────────────────────┤ │  │
│  │  │  Text Storytelling Layer (Phases 1..N)       │ │  │
│  │  ├──────────────────────────────────────────────┤ │  │
│  │  │  HUD Telemetry Bar (Scrubber & Cue Arrow)    │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

1. **Scroll Length**: A wrapper container with large height (e.g., `350vh`–`500vh`) defines the scrub timeline.
2. **Sticky Viewport**: Stays locked at `top: 0` for `100vh` while the user scrolls through the container.
3. **Canvas Aspect-Fill**: Dynamically centers and crops the image to fill the screen (`object-fit: cover` algorithm).
4. **Preloading Queue**: Loads Frame 0 immediately, then every 8th keyframe for instant responsiveness, then fills in-between frames via a multi-worker queue.
5. **Lerp Interpolation**: Softens mousewheel / touch impulses at 60fps via `requestAnimationFrame` with linear damping (`current += (target - current) * 0.12`).
6. **Zero-Lag Text Transitions**: Updates phase text directly via DOM style mutations (`opacity` and `transform: translate3d`) in the RAF loop to bypass React render overhead.

---

## 2. Step-by-Step Implementation Workflow

### Step 1: Extract Frames from Source Video

Convert your video into 120–180 compressed WebP frames (720p or 1080p, quality 80–85):

```bash
# Using Python (OpenCV)
python .agents/skills/canvas-scroll-animation/scripts/extract_frames.py \
  --video assets/input.mp4 \
  --output public/frames \
  --frames 150 \
  --quality 85

# OR using FFmpeg:
ffmpeg -i input.mp4 -vf "fps=24,scale=1920:-1" -c:v libwebp -quality 82 public/frames/frame_%03d.webp
```

*Naming Convention*: `frame_000.webp`, `frame_001.webp`, ... `frame_149.webp`.

---

### Step 2: Aspect-Fill Cover Algorithm for HTML5 Canvas

Draw image on canvas preserving aspect ratio without distortion:

```typescript
function drawImageProp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
) {
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const hRatio = cw / iw;
  const vRatio = ch / ih;
  const ratio = Math.max(hRatio, vRatio);

  const nw = iw * ratio;
  const nh = ih * ratio;
  const cx = (cw - nw) * 0.5;
  const cy = (ch - nh) * 0.5;

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
}
```

---

### Step 3: Progressive Frame Preloading with Nearest-Neighbor Fallback

Never show a blank canvas. If target frame isn't cached yet, fallback to the closest neighbor:

```typescript
function getOrFallbackImage(images: (HTMLImageElement | null)[], targetIdx: number, total: number) {
  let img = images[targetIdx];
  if (img && img.complete && img.naturalWidth > 0) return img;

  // Search backward
  for (let i = targetIdx - 1; i >= 0; i--) {
    if (images[i]?.complete && images[i]!.naturalWidth > 0) return images[i];
  }
  // Search forward
  for (let i = targetIdx + 1; i < total; i++) {
    if (images[i]?.complete && images[i]!.naturalWidth > 0) return images[i];
  }
  return null;
}
```

**Worker Preloader Queue**:
1. Load `frame_000.webp` immediately and trigger initial canvas render.
2. Push indices to a queue: priority keyframes `[0, 8, 16, 24, ...]` first, then remaining.
3. Spawn 4 parallel download loops reading from the queue.

---

### Step 4: 60fps RAF Lerp Loop & Scroll Progress Calculation

Calculate scroll progress `[0.0 .. 1.0]`:

```typescript
const handleScroll = () => {
  const rect = containerRef.current.getBoundingClientRect();
  const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
  if (totalScrollable <= 0) return;

  const currentScroll = -rect.top;
  targetProgressRef.current = Math.max(0, Math.min(1, currentScroll / totalScrollable));
};
```

Interpolate smoothly using Linear Interpolation (Lerp):

```typescript
useEffect(() => {
  const lerpLoop = () => {
    const target = targetProgressRef.current;
    const current = currentProgressRef.current;
    const diff = target - current;

    if (Math.abs(diff) > 0.0001) {
      currentProgressRef.current = current + diff * 0.12; // 0.12 = butter-smooth damping
    } else {
      currentProgressRef.current = target;
    }

    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.round(currentProgressRef.current * (totalFrames - 1)))
    );

    renderFrame(frameIndex);
    updateTextPhases(currentProgressRef.current);

    rafId = requestAnimationFrame(lerpLoop);
  };

  rafId = requestAnimationFrame(lerpLoop);
  return () => cancelAnimationFrame(rafId);
}, []);
```

---

### Step 5: Multi-Phase Storytelling Curves

Define narrative milestones along the scroll range `[0.0 .. 1.0]`:

```typescript
interface PhaseConfig {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  start: number;       // Starts fading in
  peakStart: number;   // Full opacity reached
  peakEnd: number;     // Starts fading out
  end: number;         // Fully faded out
}
```

Calculate smooth linear easing without component re-renders:
- `progress < start`: `opacity: 0`, `translateY: +28px`
- `start <= progress < peakStart`: `opacity = (progress - start) / (peakStart - start)`, `translateY = 28 * (1 - opacity)`
- `peakStart <= progress <= peakEnd`: `opacity: 1`, `translateY: 0px`
- `peakEnd < progress <= end`: `opacity = 1 - (progress - peakEnd) / (end - peakEnd)`, `translateY = -28 * (1 - opacity)`
- `progress > end`: `opacity: 0`, `translateY: -28px`

---

## 3. High DPI & Mobile Best Practices

1. **Device Pixel Ratio (DPR)**:
   ```typescript
   const dpr = Math.min(window.devicePixelRatio || 1, 2);
   canvas.width = window.innerWidth * dpr;
   canvas.height = window.innerHeight * dpr;
   ```
   *Cap DPR at 2* to avoid excessive GPU memory usage on mobile devices.
2. **GPU Acceleration**:
   Add `will-change: transform, opacity;` to text blocks and `transform: translate3d(0,0,0)` to avoid paint flashing.
3. **Passive Event Listeners**:
   Always pass `{ passive: true }` to `window.addEventListener('scroll')` and `window.addEventListener('resize')`.
4. **Vignette & Readability**:
   Place radial vignette (`radial-gradient`) and top/bottom linear black fades between the canvas and text layer so text is crisp on any frame.

---

## 4. Verification Checklist

- [ ] All frames exported to WebP (`frame_000.webp` to `frame_N.webp`).
- [ ] Initial Frame 0 renders immediately without white flash.
- [ ] Scrolling forwards and backwards scrubs smoothly without stutter or blank frames.
- [ ] Canvas covers 100% of viewport at all window aspect ratios (ultrawide, desktop, mobile portrait).
- [ ] Text phases fade and slide up/down cleanly without re-rendering React tree.
- [ ] HUD percentage scrubber tracks scroll position accurately.
- [ ] Memory footprint is bounded (reusing single canvas context and image array).
