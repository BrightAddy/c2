"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, ArrowRight, HardHat } from "lucide-react";
import QuoteModal from "../Modals/QuoteModal";
import styles from "./CanvasScrollHero.module.css";

const TOTAL_FRAMES = 150;

interface PhaseConfig {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  start: number;
  peakStart: number;
  peakEnd: number;
  end: number;
  showCtas?: boolean;
}

const PHASES: PhaseConfig[] = [
  {
    id: "phase-1",
    badge: "PHASE 01 • DIGITALER ZWILLING & BIM",
    titlePrefix: "INGENIEURKUNST VOM",
    titleHighlight: "BAUPLAN ZUM FUNDAMENT",
    subtitle:
      "Präzise 3D-Modellierung, geodätische Kollisionsprüfung und Tiefbauplanung lange vor dem ersten Spatenstich.",
    start: 0.0,
    peakStart: 0.05,
    peakEnd: 0.18,
    end: 0.25,
  },
  {
    id: "phase-2",
    badge: "PHASE 02 • TRAGWERKSBAU & STAHLBAU",
    titlePrefix: "ERRICHTUNG DES",
    titleHighlight: "STAHLTRAGWERKS",
    subtitle:
      "Schwere Turmdrehkrane und millimetergenaue Montage von Stahlstützen, Verbunddecken und Erdbebensicherungen.",
    start: 0.25,
    peakStart: 0.32,
    peakEnd: 0.44,
    end: 0.52,
  },
  {
    id: "phase-3",
    badge: "PHASE 03 • NATURSTEIN & FASSADE",
    titlePrefix: "KLASSISCHES MAUERWERK &",
    titleHighlight: "FASSADENKUNST",
    subtitle:
      "Handbearbeitete Sandsteinbögen, neoklassizistische Ziergiebel und lasergenau montierte Fassadenelemente.",
    start: 0.52,
    peakStart: 0.58,
    peakEnd: 0.72,
    end: 0.80,
  },
  {
    id: "phase-4",
    badge: "PHASE 04 • VOLLENDETES BAUWERK",
    titlePrefix: "WIR GESTALTEN DIE",
    titleHighlight: "SKYLINE VON MORGEN",
    subtitle:
      "Ein vollendetes architektonisches Denkmal. Über 35 Jahre Ingenieurskompetenz, lückenlose Arbeitssicherheit und meisterhafte Handwerkskunst.",
    start: 0.80,
    peakStart: 0.86,
    peakEnd: 0.98,
    end: 1.0,
    showCtas: true,
  },
];

export default function CanvasScrollHero({
  onHeroBoundaryChange,
}: {
  onHeroBoundaryChange?: (passedHero: boolean) => void;
}) {
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

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [frame0Ready, setFrame0Ready] = useState(false);

  // Aspect-fill (object-fit: cover) rendering
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

  // Render a specific frame index
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      let img = imagesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        let found = false;
        for (let i = frameIndex - 1; i >= 0; i--) {
          const fallback = imagesRef.current[i];
          if (fallback && fallback.complete && fallback.naturalWidth > 0) {
            img = fallback;
            found = true;
            break;
          }
        }
        if (!found) {
          for (let i = frameIndex + 1; i < TOTAL_FRAMES; i++) {
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
    [drawImageProp]
  );

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

  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Frame 0 sofort laden
    const frame0 = new Image();
    frame0.src = "/frames/frame_000.webp";
    frame0.onload = () => {
      imagesRef.current[0] = frame0;
      setFrame0Ready(true);
      renderFrame(0);

      // Verbleibende Frames progressiv cachen
      const priorityIndices: number[] = [];
      const remainingIndices: number[] = [];

      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 8 === 0) priorityIndices.push(i);
        else remainingIndices.push(i);
      }

      const queue = [...priorityIndices, ...remainingIndices];

      const loadNextInQueue = () => {
        if (queue.length === 0) return;
        const nextIdx = queue.shift()!;
        const img = new Image();
        const padded = String(nextIdx).padStart(3, "0");
        img.src = `/frames/frame_${padded}.webp`;
        img.onload = () => {
          imagesRef.current[nextIdx] = img;
          loadNextInQueue();
        };
        img.onerror = () => {
          loadNextInQueue();
        };
      };

      for (let worker = 0; worker < 4; worker++) {
        loadNextInQueue();
      }
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas, renderFrame]);

  // Kontinuierliche Text-Interpolation
  const updateTextStates = (progress: number) => {
    PHASES.forEach((phase, idx) => {
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
      progressTextRef.current.innerText = `${pct}% BAUFORTSCHRITT`;
    }

    if (scrollIndicatorRef.current) {
      const indicatorOpacity = Math.max(0, 1 - progress * 4);
      scrollIndicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
    }
  };

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
      if (onHeroBoundaryChange) {
        onHeroBoundaryChange(passedHero);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onHeroBoundaryChange]);

  // 60fps lerp loop
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
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
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
  }, [renderFrame]);

  const handleScrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      id="hero"
      className={styles.scrollContainer}
      aria-label="Interaktiver Baufortschritt im Zeitraffer"
    >
      <div className={styles.stickyViewport}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div className={styles.vignetteOverlay} />
        <div className={styles.ambientTopFade} />
        <div className={styles.ambientBottomFade} />

        <div className={styles.textLayer}>
          <div className={styles.textInnerContainer}>
            {PHASES.map((phase, idx) => (
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
                  <HardHat size={14} className={styles.badgeIcon} />
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
                      onClick={handleScrollToProjects}
                    >
                      <span>PROJEKTE ENTDECKEN</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      className={styles.outlineBtn}
                      onClick={() => setQuoteModalOpen(true)}
                    >
                      <span>ANGEBOT ANFORDERN</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HUD Fortschrittsleiste */}
        <div className={styles.hudBar}>
          <div className={styles.hudLeft}>
            <span ref={progressTextRef} className={styles.telemetryText}>
              0% BAUFORTSCHRITT
            </span>
            <div className={styles.scrubberTrack}>
              <div ref={progressBarRef} className={styles.scrubberProgress} />
            </div>
          </div>

          <div ref={scrollIndicatorRef} className={styles.scrollCue}>
            <span>SCROLLEN ZUM BAUEN</span>
            <ArrowDown size={14} className={styles.cueArrow} />
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
