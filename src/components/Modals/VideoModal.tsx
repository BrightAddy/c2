"use client";

import React, { useEffect } from "react";
import { X, Play, ShieldAlert, Award, Activity } from "lucide-react";
import styles from "./VideoModal.module.css";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  projectTitle = "Aurora Tower Structural Progress Walkthrough",
}: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.videoHeader}>
          <div className={styles.titleWrap}>
            <span className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              4K SITE TELEMETRY & DRONE INSPECTION
            </span>
            <h4 className={styles.projectHeading}>{projectTitle}</h4>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Video Canvas / Player Area */}
        <div className={styles.videoPlayerContainer}>
          <div className={styles.simulatedVideoBg}>
            <div className={styles.overlayGrid} />
            <div className={styles.telemetryOverlay}>
              <div className={styles.telemetryItem}>
                <Activity size={14} />
                <span>CRANE 04 ELEVATION: +248.5m</span>
              </div>
              <div className={styles.telemetryItem}>
                <ShieldAlert size={14} />
                <span>WIND SPEED: 11.2 KNOTS • SAFE</span>
              </div>
              <div className={styles.telemetryItem}>
                <Award size={14} />
                <span>CONCRETE POUR: PHASE 38 / 100% CURED</span>
              </div>
            </div>

            <div className={styles.centerPlayPrompt}>
              <div className={styles.playButtonGlow}>
                <Play size={28} className={styles.playIcon} />
              </div>
              <span className={styles.playText}>BIM Digital Twin & Aerial Scan</span>
            </div>
          </div>
        </div>

        {/* Video Footer info */}
        <div className={styles.videoFooter}>
          <div className={styles.footerCol}>
            <span className={styles.colLabel}>Survey Frequency</span>
            <span className={styles.colVal}>Daily Autonomous LiDAR Scan</span>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.colLabel}>Structural Tolerances</span>
            <span className={styles.colVal}>±1.5mm Laser Verification</span>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.colLabel}>Site Location</span>
            <span className={styles.colVal}>Midtown Financial Corridor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
