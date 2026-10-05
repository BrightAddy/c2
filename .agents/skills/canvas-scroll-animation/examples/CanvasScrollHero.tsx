"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import styles from "./CanvasScrollHero.module.css";

export interface PhaseConfig {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  start: number;       // Scroll progress [0..1] where phase begins fading in
  peakStart: number;   // Scroll progress [0..1] where phase reaches full opacity
  peakEnd: number;     // Scroll progress [0..1] where phase starts fading out
  end: number;         // Scroll progress [0..1] where phase is fully gone
  showCtas?: boolean;
}

export interface CanvasScrollHeroProps {
  totalFrames?: number;
  framesPathPattern?: (index: number) => string;
  phases?: PhaseConfig[];
  hudLabel?: string;
  scrollCueText?: string;
  onBoundaryChange?: (passedHero: boolean) => void;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

const DEFAULT_PHASES: PhaseConfig[] = [
  {
    id: "phase-1",
    badge: "PHASE 01 • PLANNING & ARCHITECTURE",
    titlePrefix: "PRECISION FROM",
    titleHighlight: "BLUEPRINT TO REALITY",
    subtitle: "High precision 3D modeling and structural planning before groundbreaking.",
    start: 0.0,
    peakStart: 0.05,
    peakEnd: 0.20,
    end: 0.28,
  },
  {
    id: "phase-2",
    badge: "PHASE 02 • STRUCTURAL FRAMEWORK",
    titlePrefix: "FOUNDATION AND",
    titleHighlight: "CORE ASSEMBLY",
    subtitle: "Heavy-duty engineering with millimeter accuracy and seismic stabilization.",
    start: 0.28,
    peakStart: 0.35,
    peakEnd: 0.48,
    end: 0.55,
  },
  {
    id: "phase-3",
    badge: "PHASE 03 • FACADE & FINISHES",
    titlePrefix: "CRAFTING THE",
    titleHighlight: "ARCHITECTURAL DETAILS",
    subtitle: "Hand-finished materials, climate-grade glazing, and precision elements.",
    start: 0.55,
    peakStart: 0.62,
    peakEnd: 0.75,
    end: 0.82,
  },
  {
    id: "phase-4",
    badge: "PHASE 04 • THE MASTERPIECE",
    titlePrefix: "BUILDING THE",
    titleHighlight: "FUTURE SKYLINE",
    subtitle: "A landmark architectural achievement combining decades of craftsmanship.",
    start: 0.82,
    peakStart: 0.88,
    peakEnd: 0.98,
    end: 1.0,
    showCtas: true,
  },
];

export default function CanvasScrollHero({
  totalFrames = 150,
  framesPathPattern = (i) => `/frames/frame_${String(i).padStart(3, "0")}.webp`,
  phases = DEFAULT_PHASES,
  hudLabel = "PROGRESS",
  scrollCueText = "SCROLL TO EXPLORE",
  onBoundaryChange,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: CanvasScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);

  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Aspect-fill (cover) draw function to maintain aspect ratio on any screen size
  const drawImageProp = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
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
    },
    []
  );

  // Render a specific frame with nearest-neighbor fallback to prevent flashing
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      let img = imagesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        let found = false;
        // Search backwards for the nearest loaded frame
        for (let i = frameIndex - 1; i >= 0; i--) {
          const fallback = imagesRef.current[i];
          if (fallback && fallback.complete && fallback.naturalWidth > 0) {
            img = fallback;
            found = true;
            break;
          }
        }
        // Search forwards if no backwards fallback found
        if (!found) {
          for (let i = frameIndex + 1; i < totalFrames; i++) {
            const fallback = imagesRef.current[i];
            if (fallback && fallback.complete && fallback.naturalWidth > 0) {
              img = fallback;
              break;
            }
          }
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        drawImageProp(ctx, img, canvas);
        lastDrawnFrameRef.current = frameIndex;
      }
    },
    [drawImageProp, totalFrames]
  );

  // Resize canvas for sharp rendering on Retina / HiDPI screens
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    if (lastDrawnFrameRef.current >= 0) {
      renderFrame(lastDrawnFrameRef.current);
    }
  }, [renderFrame]);

  // Preload frames progressively with priority stepping & worker queue
  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Step 1: Preload Frame 0 immediately
    const frame0 = new Image();
    frame0.src = framesPathPattern(0);
    frame0.onload = () => {
      imagesRef.current[0] = frame0;
      renderFrame(0);

      // Step 2: Queue keyframes (every 8th frame) first for fast scrubbing
      const priorityIndices: number[] = [];
      const remainingIndices: number[] = [];

      for (let i = 1; i < totalFrames; i++) {
        if (i % 8 === 0) priorityIndices.push(i);
        else remainingIndices.push(i);
      }

      const queue = [...priorityIndices, ...remainingIndices];

      const loadNextInQueue = () => {
        if (queue.length === 0) return;
        const nextIdx = queue.shift()!;
        const img = new Image();
        img.src = framesPathPattern(nextIdx);
        img.onload = () => {
          imagesRef.current[nextIdx] = img;
          loadNextInQueue();
        };
        img.onerror = () => {
          loadNextInQueue();
        };
      };

      // 4 concurrent download workers
      for (let worker = 0; worker < 4; worker++) {
        loadNextInQueue();
      }
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [totalFrames, framesPathPattern, resizeCanvas, renderFrame]);

  // Direct DOM updates for text opacity and translation (zero React re-renders)
  const updateTextStates = (progress: number) => {
    phases.forEach((phase, idx) => {
      const el = phaseRefs.current[idx];
      if (!el) return;

      let opacity = 0;
      let translateY = 24;

      if (progress < phase.start || progress > phase.end) {
        opacity = 0;
        translateY = progress < phase.start ? 28 : -28;
      } else if (progress >= phase.start && progress < phase.peakStart) {
        const t = (progress - phase.start) / (phase.peakStart - phase.start);
        opacity = t;
        translateY = 28 * (1 - t);
      } else if (progress >= phase.peakStart && progress <= phase.peakEnd) {
        opacity = 1;
        translateY = 0;
      } else if (progress > phase.peakEnd && progress <= phase.end) {
        const t = (progress - phase.peakEnd) / (phase.end - phase.peakEnd);
        opacity = 1 - t;
        translateY = -28 * t;
      }

      el.style.opacity = opacity.toFixed(4);
      el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
      el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
    });

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    if (progressTextRef.current) {
      const pct = Math.round(progress * 100);
      progressTextRef.current.innerText = `${pct}% ${hudLabel}`;
    }

    if (scrollIndicatorRef.current) {
      const indicatorOpacity = Math.max(0, 1 - progress * 4);
      scrollIndicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
    }
  };

  // Scroll listener to calculate current scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const target = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      targetProgressRef.current = target;

      const passedHero = rect.bottom <= window.innerHeight + 10;
      if (onBoundaryChange) {
        onBoundaryChange(passedHero);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onBoundaryChange]);

  // Smooth lerp loop (60fps animation frame)
  useEffect(() => {
    const lerpLoop = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current = current + diff * 0.12;
      } else {
        currentProgressRef.current = target;
      }

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(currentProgressRef.current * (totalFrames - 1)))
      );

      renderFrame(frameIndex);
      updateTextStates(currentProgressRef.current);

      rafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    rafIdRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [totalFrames, renderFrame]);

  return (
    <div
      ref={containerRef}
      className={styles.scrollContainer}
      aria-label="Interactive scroll-driven animation sequence"
    >
      <div className={styles.stickyViewport}>
        {/* Fullscreen Canvas */}
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Cinematic Vignette & Ambient Edge Fades */}
        <div className={styles.vignetteOverlay} />
        <div className={styles.ambientTopFade} />
        <div className={styles.ambientBottomFade} />

        {/* Text Storytelling Layer */}
        <div className={styles.textLayer}>
          <div className={styles.textInnerContainer}>
            {phases.map((phase, idx) => (
              <div
                key={phase.id}
                ref={(el) => {
                  phaseRefs.current[idx] = el;
                }}
                className={styles.phaseBlock}
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  transform: idx === 0 ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
                  pointerEvents: idx === 0 ? "auto" : "none",
                }}
              >
                <div className={styles.badgePill}>
                  <Sparkles size={14} className={styles.badgeIcon} />
                  <span>{phase.badge}</span>
                </div>

                <h1 className={styles.headline}>
                  <span>{phase.titlePrefix} </span>
                  <span className={styles.titleHighlight}>{phase.titleHighlight}</span>
                </h1>

                <p className={styles.subtitle}>{phase.subtitle}</p>

                {phase.showCtas && (
                  <div className={styles.ctaRow}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={onPrimaryCtaClick}
                    >
                      <span>EXPLORE</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      className={styles.outlineBtn}
                      onClick={onSecondaryCtaClick}
                    >
                      <span>LEARN MORE</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HUD Scrubber Progress Bar */}
        <div className={styles.hudBar}>
          <div className={styles.hudLeft}>
            <span ref={progressTextRef} className={styles.telemetryText}>
              0% {hudLabel}
            </span>
            <div className={styles.scrubberTrack}>
              <div ref={progressBarRef} className={styles.scrubberProgress} />
            </div>
          </div>

          <div ref={scrollIndicatorRef} className={styles.scrollCue}>
            <span>{scrollCueText}</span>
            <ArrowDown size={14} className={styles.cueArrow} />
          </div>
        </div>
      </div>
    </div>
  );
}
