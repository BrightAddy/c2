"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import CanvasScrollHero from "@/components/Hero/CanvasScrollHero";
import QuoteModal from "@/components/Modals/QuoteModal";
import {
  Building2,
  HardHat,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Hammer,
  Truck,
  DraftingCompass,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import styles from "./page.module.css";

const services = [
  {
    icon: Building2,
    title: "Gewerblicher Hochhausbau",
    desc: "Modernste Bürohochhäuser, gemischt genutzte Stadtquartiere und Hotelkomplexe mit Erdbebensicherung und vorgespannten Flachdecken.",
    href: "#projects",
  },
  {
    icon: Hammer,
    title: "Ingenieurbau & Brücken",
    desc: "Weitspannende Schrägseilbrücken, Flussüberquerungen, Verkehrsknotenpunkte und anspruchsvolle Spezialtiefbaugründungen.",
    href: "#projects",
  },
  {
    icon: DraftingCompass,
    title: "Planen & Bauen (BIM 3D)",
    desc: "Durchgängige Verzahnung von Entwurfsplanung, 4D-Bauablaufsimulation, digitaler Kollisionsprüfung und lasergestützter Bauwerksvermessung.",
    href: "#services",
  },
  {
    icon: Truck,
    title: "Eigener Maschinenpark",
    desc: "Über 180 moderne Baumaschinen: Selbstkletternde Turmdrehkrane, Großbagger, Hochleistungsbetonpumpen und Schwerlastlogistik.",
    href: "#about",
  },
];

const featuredProjects = [
  {
    title: "Global Business District Büroturm",
    category: "Großgewerbebau",
    location: "Metropolregion • Sektor 04",
    image: "/images/hero-1.jpg",
    desc: "Ganzheitliches 48 Hektar großes Geschäftsquartier mit hochbewehrten Stahlbetonkernen, energieeffizienter Fassadentechnologie und unterirdischer Logistik.",
    value: "480 Mio. €",
    timeline: "2024 – 2027",
    status: "Rohbau im Ausbau",
  },
  {
    title: "Aurora Tower 72-Geschosser",
    category: "Konstruktiver Hochbau",
    location: "Finanzzentrum • Innenstadt",
    image: "/images/hero-2.jpg",
    desc: "72-geschossiger Landmark-Glasturm mit abgestimmten Schwingungstilgern und Kletterschalungen zur Verkürzung der Rohbauzeit um 38 %.",
    value: "720 Mio. €",
    timeline: "2023 – 2026",
    status: "Fassadenmontage",
  },
  {
    title: "Metro Link Schrägseilbrücke",
    category: "Schwerer Verkehrswegebau",
    location: "Flusskorridor • Autobahntangente",
    image: "/images/hero-3.jpg",
    desc: "3,4 Kilometer lange Schrägseilbrücke zur Verbindung regionaler Wirtschaftsräume mit zwei 180 Meter hohen Pylonen und aerodynamischem Stahldeck.",
    value: "1,15 Mrd. €",
    timeline: "2022 – 2026",
    status: "Stahlfahrbahnmontage",
  },
];

export default function Home() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [isPassedHero, setIsPassedHero] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      {/* Navbar: Transparent im Hero, Feststoff nach Verlassen des Hero-Bereichs */}
      <Navbar
        isSolid={isPassedHero}
        onOpenQuoteModal={() => setQuoteModalOpen(true)}
      />

      <main className={styles.mainContent}>
        {/* Apple-Style Zeitraffer-Scrubbing Hero */}
        <CanvasScrollHero onHeroBoundaryChange={(passed) => setIsPassedHero(passed)} />

        {/* Kennzahlen-Leiste */}
        <section className={styles.statsStrip}>
          <div className={styles.container}>
            <div className={styles.statsGridClean}>
              <div className={styles.statItemClean}>
                <div className={styles.statNumClean}>450+</div>
                <div className={styles.statLblClean}>Realisierte Großprojekte</div>
              </div>
              <div className={styles.statItemClean}>
                <div className={styles.statNumClean}>99,8%</div>
                <div className={styles.statLblClean}>Sicherheitsindex</div>
              </div>
              <div className={styles.statItemClean}>
                <div className={styles.statNumClean}>35+</div>
                <div className={styles.statLblClean}>Jahre Bauerfahrung</div>
              </div>
              <div className={styles.statItemClean}>
                <div className={styles.statNumClean}>180+</div>
                <div className={styles.statLblClean}>Eigene Großgeräte</div>
              </div>
            </div>
          </div>
        </section>

        {/* Kernleistungen */}
        <section id="services" className={`${styles.section} ${styles.sectionDarker}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <HardHat size={14} />
                <span>SPITZENLEISTUNG IM INGENIEURBAU</span>
              </div>
              <h2 className={styles.sectionTitle}>Gebaut für Generationen: Präzision, Sicherheit &amp; Dimension</h2>
              <p className={styles.sectionDesc}>
                Mit über drei Jahrzehnten Bauerfahrung führt die Global Bau &amp; Generalunternehmung komplexe Hochbau- und Infrastrukturprojekte termingerecht und im festen Budgetrahmen aus.
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {services.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceIconBox}>
                      <Icon size={24} />
                    </div>
                    <h3 className={styles.serviceCardTitle}>{item.title}</h3>
                    <p className={styles.serviceCardDesc}>{item.desc}</p>
                    <a href={item.href} className={styles.serviceLink}>
                      <span>Technische Daten ansehen</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ausgewählte Referenzprojekte */}
        <section id="projects" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Building2 size={14} />
                <span>AUSGEWÄHLTE REFERENZEN</span>
              </div>
              <h2 className={styles.sectionTitle}>Baukunst, die Horizonte verändert</h2>
              <p className={styles.sectionDesc}>
                Entdecken Sie unsere anspruchsvollsten Landmark-Bauwerke und Verkehrsinfrastrukturen, realisiert unter lückenloser Einhaltung aller Umwelt- und Sicherheitsauflagen.
              </p>
            </div>

            <div className={styles.projectsGrid}>
              {featuredProjects.map((project, index) => (
                <div key={index} className={styles.projectCard}>
                  <div className={styles.projectImageWrap}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.projectImg}
                    />
                    <div className={styles.projectCategoryTag}>{project.category}</div>
                  </div>

                  <div className={styles.projectBody}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <div className={styles.projectMetaRow}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} color="#f59e0b" />
                        {project.location}
                      </span>
                    </div>
                    <p className={styles.projectDesc}>{project.desc}</p>

                    <div className={styles.projectStatsRow}>
                      <div className={styles.projectStatItem}>
                        <span className={styles.projStatVal}>{project.value}</span>
                        <span className={styles.projStatLbl}>Auftragsvolumen</span>
                      </div>
                      <div className={styles.projectStatItem}>
                        <span className={styles.projStatVal}>{project.timeline}</span>
                        <span className={styles.projStatLbl}>Bauzeitraum</span>
                      </div>
                      <div className={styles.projectStatItem}>
                        <span className={styles.projStatVal} style={{ color: "#38bdf8" }}>
                          {project.status}
                        </span>
                        <span className={styles.projStatLbl}>Bauphase</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section id="contact" className={`${styles.section} ${styles.sectionDarker}`}>
          <div className={styles.container}>
            <div className={styles.bannerBox}>
              <div className={styles.bannerText}>
                <h3>Bereit für Ihr nächstes wegweisendes Bauvorhaben?</h3>
                <p>
                  Sprechen Sie direkt mit unserer technischen Direktion. Wir bieten fundierte Machbarkeitsprüfungen, strukturierte Terminpläne und verlässliche Kostenermittlungen.
                </p>
              </div>
              <div className={styles.bannerActions}>
                <button
                  type="button"
                  className={styles.bannerBtn}
                  onClick={() => setQuoteModalOpen(true)}
                >
                  PROJEKTANGEBOT ANFORDERN
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <p className={styles.footerDesc}>
                Global Bau &amp; Generalunternehmung ist ein führendes Konsortium für anspruchsvollen Hoch- und Ingenieurbau. Wir gestalten die Skyline von morgen durch statische Meisterschaft, digitale Zwillinge und zertifizierte Arbeitssicherheit.
              </p>
            </div>

            <div className={styles.footerCol}>
              <h4>Navigation</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="#hero">Startseite</Link></li>
                <li><Link href="#projects">Flaggschiff-Projekte</Link></li>
                <li><Link href="#services">Hoch- &amp; Brückenbau</Link></li>
                <li><Link href="#about">Maschinenpark</Link></li>
                <li><Link href="#contact">Ausschreibungen &amp; Kontakt</Link></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4>Fachbereiche</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="#projects">Wolkenkratzer &amp; Hochhäuser</Link></li>
                <li><Link href="#projects">Schrägseilbrücken &amp; Viadukte</Link></li>
                <li><Link href="#services">BIM 4D &amp; Digitaler Zwilling</Link></li>
                <li><Link href="#about">ISO 45001 Arbeitssicherheitskultur</Link></li>
                <li><Link href="#services">Spezialtiefbau &amp; Baugrund</Link></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4>Hauptsitz</h4>
              <ul className={styles.footerLinks}>
                <li style={{ display: "flex", gap: 8, color: "#94a3b8" }}>
                  <MapPin size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>Skyline-Allee 742, 60311 Frankfurt am Main</span>
                </li>
                <li style={{ display: "flex", gap: 8, color: "#94a3b8" }}>
                  <Phone size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>+49 (0) 800 482 9011 (Zentrale Auftragsvergabe)</span>
                </li>
                <li style={{ display: "flex", gap: 8, color: "#94a3b8" }}>
                  <Mail size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>anfragen@global-bau.de</span>
                </li>
                <li style={{ display: "flex", gap: 8, color: "#22c55e" }}>
                  <ShieldCheck size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>Zugelassener Generalunternehmer #GB-98421-DE</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div>
              &copy; {new Date().getFullYear()} Global Bau &amp; Generalunternehmung GmbH. Alle Rechte vorbehalten. Wir gestalten die Skyline von morgen.
            </div>
            <div>
              Zertifiziert nach ISO 9001:2015 • ISO 14001 • ISO 45001 • VPP Star Site
            </div>
          </div>
        </div>
      </footer>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
