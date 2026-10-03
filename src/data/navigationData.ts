import { HeaderConfig } from "@/types/navigation";

export const siteHeaderConfig: HeaderConfig = {
  companyName: "GLOBAL BAU & GENERALUNTERNEHMEN",
  shortName: "GB GLOBAL",
  tagline: "WIR GESTALTEN DIE SKYLINE VON MORGEN",
  phone: "+49 (0) 800 482 9011",
  email: "anfragen@global-bau.de",
  address: "Skyline-Allee 742, 60311 Frankfurt am Main",
  emergencyHotline: "+49 (0) 800 911 228",
  navLinks: [
    {
      id: "home",
      label: "STARTSEITE",
      href: "#hero",
    },
    {
      id: "projects",
      label: "PROJEKTE",
      href: "#projects",
      children: [
        { title: "Gewerblicher Hochhausbau", href: "#projects", desc: "Bürotürme, multifunktionale Quartiere und Hotelkomplexe" },
        { title: "Ingenieurbau & Brücken", href: "#projects", desc: "Schrägseilbrücken, Viadukte und Verkehrsinfrastruktur" },
        { title: "Industrie- & Logistikbau", href: "#projects", desc: "Produktionsstätten, Hangars und moderne Logistikzentren" },
      ],
    },
    {
      id: "services",
      label: "LEISTUNGEN",
      href: "#services",
      children: [
        { title: "Generalunternehmung", href: "#services", desc: "Schlüsselfertiges Bauen mit transparenter Budgetsteuerung" },
        { title: "Planen & Bauen (Design-Build)", href: "#services", desc: "Integrierte Architektur- und Statikleistungen" },
        { title: "BIM 3D & Digitaler Zwilling", href: "#services", desc: "Virtuelle Kollisionsprüfung und lasergestützte Bauvermessung" },
      ],
    },
    {
      id: "about",
      label: "ÜBER UNS",
      href: "#about",
      children: [
        { title: "Tradition & Werte", href: "#about", desc: "Über 35 Jahre Spitzenleistung im konstruktiven Ingenieurbau" },
        { title: "Arbeitssicherheit & ISO", href: "#about", desc: "Zertifiziert nach ISO 9001, ISO 14001 und ISO 45001" },
        { title: "Eigener Maschinenpark", href: "#about", desc: "Über 180 moderne Großbaumaschinen und Turmdrehkrane" },
      ],
    },
    {
      id: "news",
      label: "AKTUELLES",
      href: "#news",
    },
    {
      id: "contact",
      label: "KONTAKT",
      href: "#contact",
    },
  ],
};
