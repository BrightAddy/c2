"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import QuoteModal from "../Modals/QuoteModal";
import { HeroSlide, HeroConfig } from "@/types/hero";
import { heroConfig as defaultHeroConfig } from "@/data/heroData";
import styles from "./Hero.module.css";

interface HeroProps {
  customConfig?: Partial<HeroConfig>;
  slides?: HeroSlide[];
}

export default function Hero({ customConfig, slides }: HeroProps) {
  const activeSlides = slides || customConfig?.slides || defaultHeroConfig.slides;
  const autoplayInterval =
    customConfig?.autoplayIntervalMs || defaultHeroConfig.autoplayIntervalMs || 6000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const handlePrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNextSlide();
    }, autoplayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoplayInterval, handleNextSlide]);

  const handleCtaAction = (action?: string, href?: string) => {
    if (action === "openQuoteModal") {
      setQuoteModalOpen(true);
    } else if (action === "scrollToProjects") {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (href) {
      window.location.hash = href;
    }
  };

  return (
    <section
      id="hero"
      className={styles.heroSection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Construction Projects Hero"
    >
      {/* Background Slides */}
      <div className={styles.slidesWrapper}>
        {activeSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`${styles.slideLayer} ${isActive ? styles.slideActive : ""}`}
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              role="img"
              aria-label={slide.tagline}
            >
              <div className={styles.gradientOverlay} />
            </div>
          );
        })}
      </div>

      {/* Clean Minimalist Hero Content */}
      <div className={styles.heroContainer}>
        <div className={styles.contentWrap} key={currentSlide.id}>
          {/* Subtle Category Pill */}
          <div className={styles.badgePill}>
            <span>{currentSlide.categoryBadge}</span>
          </div>

          {/* Clean Main Headline */}
          <h1 className={styles.heroTitle}>
            <span>{currentSlide.titlePrefix} </span>
            <span className={styles.titleHighlight}>{currentSlide.titleHighlight}</span>
          </h1>

          {/* Subtitle / Tagline */}
          <p className={styles.heroSubtitle}>{currentSlide.tagline}</p>

          {/* Short Description */}
          <p className={styles.heroDescription}>{currentSlide.description}</p>

          {/* Action Buttons */}
          <div className={styles.ctaRow}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() =>
                handleCtaAction(
                  currentSlide.primaryCta.action,
                  currentSlide.primaryCta.href
                )
              }
            >
              <span>{currentSlide.primaryCta.text}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className={styles.outlineBtn}
              onClick={() =>
                handleCtaAction(
                  currentSlide.secondaryCta.action,
                  currentSlide.secondaryCta.href
                )
              }
            >
              <span>{currentSlide.secondaryCta.text}</span>
            </button>
          </div>
        </div>

        {/* Minimal Bottom Slide Navigator */}
        <div className={styles.bottomBar}>
          <div className={styles.slideDots}>
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`${styles.dotBtn} ${idx === currentIndex ? styles.dotActive : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span className={styles.dotBar} />
                <span className={styles.dotLabel}>0{idx + 1}</span>
              </button>
            ))}
          </div>

          <div className={styles.arrowControls}>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={handlePrevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={handleNextSlide}
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </section>
  );
}
