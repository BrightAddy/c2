import { HeroConfig, HeroSlide } from "@/types/hero";

export const heroSlidesData: HeroSlide[] = [
  {
    id: "slide-1",
    slug: "future-skyline",
    categoryBadge: "COMMERCIAL & CIVIL INFRASTRUCTURE",
    titlePrefix: "CREATING THE",
    titleHighlight: "FUTURE SKYLINE",
    titleSuffix: "",
    tagline: "Global Builders & Contractors",
    description:
      "Delivering landmark skyscrapers, heavy civil projects, and sustainable master developments with engineering precision and uncompromising safety standards.",
    backgroundImage: "/images/hero-1.jpg",
    location: "Metro Downtown District",
    primaryCta: {
      text: "EXPLORE PROJECTS",
      href: "#projects",
      variant: "primary",
      action: "scrollToProjects",
    },
    secondaryCta: {
      text: "REQUEST A QUOTE",
      href: "#quote",
      variant: "glass",
      action: "openQuoteModal",
    },
    stats: [
      { value: "450+", label: "Delivered Landmarks", iconName: "Building2" },
      { value: "99.8%", label: "Safety Compliance", iconName: "ShieldCheck" },
      { value: "35+", label: "Years Experience", iconName: "Trophy" },
      { value: "180+", label: "Equipment Fleet", iconName: "HardHat" },
    ],
  },
  {
    id: "slide-2",
    slug: "aurora-tower",
    categoryBadge: "HIGH-RISE STRUCTURAL ENGINEERING",
    titlePrefix: "ENGINEERING",
    titleHighlight: "MODERN TOWERS",
    titleSuffix: "",
    tagline: "Aurora 72-Floor Skyscraper",
    description:
      "Pushing the boundaries of vertical architecture. Precision structural steel, self-climbing formwork, and high-performance reflective curtain facades.",
    backgroundImage: "/images/hero-2.jpg",
    location: "Financial Center",
    primaryCta: {
      text: "VIEW SKYSCRAPER",
      href: "#projects",
      variant: "primary",
      action: "scrollToProjects",
    },
    secondaryCta: {
      text: "REQUEST A QUOTE",
      href: "#quote",
      variant: "glass",
      action: "openQuoteModal",
    },
    stats: [
      { value: "72", label: "Storey High-Rise", iconName: "Building2" },
      { value: "0.0", label: "Lost-Time Frequency", iconName: "CheckCircle2" },
      { value: "LEED", label: "Platinum Standard", iconName: "Award" },
      { value: "38%", label: "Faster Delivery", iconName: "Clock" },
    ],
  },
  {
    id: "slide-3",
    slug: "metro-link-bridge",
    categoryBadge: "HEAVY CIVIL INFRASTRUCTURE",
    titlePrefix: "CONNECTING WITH",
    titleHighlight: "MASSIVE BRIDGES",
    titleSuffix: "",
    tagline: "Metro Link Cable-Stayed Bridge",
    description:
      "Tackling complex geotechnical terrain and deep-water foundations to build trans-regional transit networks and iconic cable-stayed bridges.",
    backgroundImage: "/images/hero-3.jpg",
    location: "River Gateway Corridor",
    primaryCta: {
      text: "VIEW INFRASTRUCTURE",
      href: "#projects",
      variant: "primary",
      action: "scrollToProjects",
    },
    secondaryCta: {
      text: "REQUEST A QUOTE",
      href: "#quote",
      variant: "glass",
      action: "openQuoteModal",
    },
    stats: [
      { value: "3.4 km", label: "Spanned Waterway", iconName: "HardHat" },
      { value: "140k", label: "Tons High-Tensile Steel", iconName: "Building2" },
      { value: "1,450", label: "Specialist Workforce", iconName: "Users" },
      { value: "100+", label: "Years Design Life", iconName: "Award" },
    ],
  },
];

export const heroConfig: HeroConfig = {
  autoplayIntervalMs: 6000,
  enableAutoplay: true,
  enableKenBurns: true,
  enableSlideProgress: true,
  slides: heroSlidesData,
};
