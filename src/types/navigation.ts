export interface NavLink {
  id: string;
  label: string;
  href: string;
  badge?: string;
  children?: { title: string; href: string; desc: string }[];
}

export interface HeaderConfig {
  companyName: string;
  shortName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  emergencyHotline: string;
  navLinks: NavLink[];
}
