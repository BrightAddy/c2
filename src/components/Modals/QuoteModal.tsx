"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Building2, HardHat, CheckCircle2, Calculator, Send, Sparkles } from "lucide-react";
import styles from "./QuoteModal.module.css";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const projectCategories = [
  { id: "commercial", label: "Gewerblicher Hochhausbau", rate: 260 },
  { id: "civil", label: "Ingenieurbau & Brücken", rate: 320 },
  { id: "industrial", label: "Industrie- & Logistikbau", rate: 190 },
  { id: "residential", label: "Gehobener Wohnungsbau", rate: 240 },
];

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [category, setCategory] = useState("commercial");
  const [sqm, setSqm] = useState(25000);
  const [timeline, setTimeline] = useState("6-12 Monate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsSubmitted(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRate = projectCategories.find((c) => c.id === category)?.rate || 250;
  const baseEstimate = sqm * currentRate * 10;
  const minEstimate = Math.round((baseEstimate * 0.88) / 1000000);
  const maxEstimate = Math.round((baseEstimate * 1.15) / 1000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `GB-DE-${Math.floor(100000 + Math.random() * 900000)}`;
    setQuoteId(generatedId);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F97316", "#F59E0B", "#38BDF8", "#FFFFFF"],
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.iconCircle}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 className={styles.title}>Projektkalkulation &amp; Vorabstimmung</h3>
              <p className={styles.subtitle}>Direkte Vorplanung &amp; technische Beratung mit unserer Bauingenieurabteilung</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Schritt 1 */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>1. Sektor &amp; Bauvolumen wählen</label>
              <div className={styles.categoryGrid}>
                {projectCategories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.categoryCard} ${category === item.id ? styles.categoryActive : ""}`}
                    onClick={() => setCategory(item.id)}
                  >
                    <Building2 size={18} className={styles.catIcon} />
                    <span className={styles.catText}>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Fläche */}
              <div className={styles.sliderBlock}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderLabel}>Geschätzte Bruttogeschossfläche (BGF)</span>
                  <span className={styles.sliderValue}>{sqm.toLocaleString("de-DE")} m²</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={150000}
                  step={2500}
                  value={sqm}
                  onChange={(e) => setSqm(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.sliderTicks}>
                  <span>5.000 m²</span>
                  <span>75.000 m²</span>
                  <span>150.000+ m²</span>
                </div>
              </div>

              {/* Kostenschätzung */}
              <div className={styles.estimateBanner}>
                <div className={styles.estimateInfo}>
                  <Sparkles size={16} className={styles.sparkleIcon} />
                  <span>Vorläufige Baukostenschätzung:</span>
                </div>
                <div className={styles.estimateFigure}>
                  {minEstimate} Mio. € &ndash; {maxEstimate} Mio. €
                </div>
              </div>
            </div>

            {/* Schritt 2 */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>2. Bauherrschaft &amp; Kontaktdaten</label>
              <div className={styles.inputGrid}>
                <div className={styles.formGroup}>
                  <label>Vollständiger Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Dr. Maximilian Weber"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Geschäftliche E-Mail *</label>
                  <input
                    type="email"
                    required
                    placeholder="weber@immobilien-gruppe.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefonnummer *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+49 (0) 69 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Unternehmen / Auftraggeber</label>
                  <input
                    type="text"
                    placeholder="Weber Projektentwicklung GmbH"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: 12 }}>
                <label>Geplanter Baubeginn</label>
                <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={styles.select}>
                  <option value="Sofort (0-6 Monate)">Unmittelbar (innerhalb der nächsten 0-6 Monate)</option>
                  <option value="6-12 Monate">In 6-12 Monaten (Genehmigungs- &amp; Planungsphase)</option>
                  <option value="12-24 Monate">In 12-24 Monaten (Ausschreibungsphase)</option>
                  <option value="Langfristig (24+ Monate)">Langfristig (über 24 Monate)</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginTop: 12 }}>
                <label>Standort &amp; Spezifische Projektanforderungen</label>
                <textarea
                  rows={2}
                  placeholder="Standortdetails, Baugrundverhältnisse, besondere Anforderungen an Tragwerk oder Zertifizierung..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={styles.textarea}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.disclaimer}>
                <HardHat size={14} />
                <span>Vertrauliche Behandlung gemäß DSGVO und gegenseitiger Geheimhaltungsvereinbarung (NDA).</span>
              </div>
              <button type="submit" className={styles.submitBtn}>
                <span>Projektanfrage absenden</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.successBlock}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={48} />
            </div>
            <h4 className={styles.successTitle}>Projektanfrage erfolgreich übermittelt!</h4>
            <p className={styles.successDesc}>
              Vielen Dank, <strong>{name}</strong>. Unsere Projektleitung wird Ihre Angaben für das Bauvorhaben (<strong>{sqm.toLocaleString("de-DE")} m² {category}</strong>) prüfen und sich innerhalb eines Werktags persönlich bei Ihnen melden.
            </p>
            <div className={styles.quoteBadge}>
              <span>Vorgangsnummer:</span>
              <strong>{quoteId}</strong>
            </div>
            <button type="button" className={styles.doneBtn} onClick={onClose}>
              Zurück zur Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
