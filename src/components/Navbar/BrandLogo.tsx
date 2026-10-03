"use client";

import React from "react";
import Link from "next/link";
import styles from "./BrandLogo.module.css";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function BrandLogo({ className = "", showTagline = false }: BrandLogoProps) {
  return (
    <Link href="/" className={`${styles.logoLink} ${className}`} aria-label="Global Bau Startseite">
      <div className={styles.logoWrapper}>
        {/* GB Monogramm */}
        <div className={styles.monogram}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgEmblem}>
            <defs>
              <linearGradient id="gbNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="gbOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>

            {/* Kreis-Emblem */}
            <circle cx="50" cy="50" r="46" fill="rgba(8,16,30,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
            
            {/* Buchstabe G */}
            <path
              d="M48 27C34 27 24 37 24 50C24 63 34 73 48 73C57 73 64 68 66 60H48V51H77C77.7 55 78 58 78 61C76 72 65 82 48 82C29 82 15 68 15 50C15 32 29 18 48 18C58 18 67 22 73 28L64 36C60 30 55 27 48 27Z"
              fill="url(#gbNavy)"
              stroke="#38BDF8"
              strokeWidth="1.2"
            />

            {/* Buchstabe B */}
            <path
              d="M46 24H67C75 24 81 29 81 35C81 41 77 45 71 47C77 50 82 55 82 62C82 71 74 76 66 76H46V24ZM56 33V43H65C68.5 43 71 41 71 38C71 35 68.5 33 65 33H56ZM56 51V67H66C70 67 73 64 73 60C73 56 70 51 66 51H56Z"
              fill="url(#gbOrange)"
            />
          </svg>
        </div>

        {/* Textblock */}
        <div className={styles.textContainer}>
          <span className={styles.brandTitle}>GLOBAL</span>
          <span className={styles.brandSubtitle}>BAUUNTERNEHMEN &amp; GENERALBAU</span>
          {showTagline && (
            <span style={{ fontSize: "0.5rem", letterSpacing: "0.12em", color: "#94a3b8", marginTop: 2 }}>
              WIR GESTALTEN DIE SKYLINE VON MORGEN
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
