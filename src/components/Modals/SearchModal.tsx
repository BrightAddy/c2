"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Building, Hammer, Shield, MapPin } from "lucide-react";
import styles from "./SearchModal.module.css";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (slug: string) => void;
}

const searchableData = [
  {
    title: "Global Towers Bauabschnitt 1 & 2",
    category: "Gewerblicher Hochhausbau",
    location: "Metropolregion Innenstadt",
    icon: Building,
    href: "#projects",
  },
  {
    title: "Metro Link Schrägseilbrücke",
    category: "Schwerer Ingenieurbau",
    location: "Flusskorridor Autobahndreieck",
    icon: Hammer,
    href: "#projects",
  },
  {
    title: "Aurora 72-Geschosser Glasturm",
    category: "Konstruktiver Stahlbau",
    location: "Finanzdistrikt",
    icon: Building,
    href: "#projects",
  },
  {
    title: "Erdbebensicherheit & ISO 45001 Standards",
    category: "Sicherheitszertifizierung",
    location: "Konzernzentrale Qualitätssicherung",
    icon: Shield,
    href: "#about",
  },
  {
    title: "Eigener Maschinenpark & Turmdrehkrane",
    category: "Baulogistik & Fuhrpark",
    location: "Zentraler Bauhof",
    icon: Hammer,
    href: "#about",
  },
  {
    title: "Planen & Bauen mit BIM 3D Modellierung",
    category: "Ingenieurleistungen",
    location: "Planungsbüro Frankfurt",
    icon: Building,
    href: "#services",
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResults = searchableData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <Search size={22} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Projekte, Leistungen, Großgeräte oder Spezifikationen durchsuchen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className={styles.quickTags}>
          <span className={styles.quickTagLabel}>Häufig gesucht:</span>
          {["Hochhäuser", "Schrägseilbrücken", "BIM 3D", "Maschinenpark", "ISO-Zertifikate"].map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.tagPill}
              onClick={() => setQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className={styles.resultsContainer}>
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className={styles.resultItem}
                  onClick={onClose}
                >
                  <div className={styles.itemIconWrap}>
                    <Icon size={18} />
                  </div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <span className={styles.itemDot}>•</span>
                      <span className={styles.itemLocation}>
                        <MapPin size={12} style={{ marginRight: 3 }} />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className={styles.itemArrow} />
                </a>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <p>Keine Einträge für &bdquo;{query}&ldquo; gefunden</p>
              <span>Probieren Sie Begriffe wie &bdquo;Hochhäuser&ldquo;, &bdquo;Brücken&ldquo; oder &bdquo;BIM&ldquo;.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <span>Drücken Sie <strong>ESC</strong> zum Schließen</span>
          <span>{filteredResults.length} Suchtreffer gefunden</span>
        </div>
      </div>
    </div>
  );
}
