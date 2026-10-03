export interface HeroSlideStat {
  label: string;
  value: string;
  description?: string;
  iconName?: "Building2" | "HardHat" | "ShieldCheck" | "Trophy" | "Clock" | "Users" | "Award" | "CheckCircle2";
}

export interface HeroSlideCta {
  text: string;
  href: string;
  variant: "primary" | "secondary" | "glass" | "outline";
  action?: "openQuoteModal" | "openVideoModal" | "scrollToProjects" | "link";
  icon?: string;
}

export interface HeroSlide {
  id: string;
  slug: string;
  categoryBadge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  tagline: string;
  description: string;
  backgroundImage: string;
  location: string;
  projectValue?: string;
  duration?: string;
  primaryCta: HeroSlideCta;
  secondaryCta: HeroSlideCta;
  stats: HeroSlideStat[];
  specs?: {
    architect?: string;
    structuralType?: string;
    safetyScore?: string;
  };
}

export interface HeroConfig {
  autoplayIntervalMs: number;
  enableAutoplay: boolean;
  enableKenBurns: boolean;
  enableSlideProgress: boolean;
  slides: HeroSlide[];
}
