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
