import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060c16",
};

export const metadata: Metadata = {
  title: "Global Bau & Generalunternehmen | Wir gestalten die Skyline von morgen",
  description:
    "Führendes Bauunternehmen für anspruchsvollen Ingenieurbau, gewerblichen Hochhausbau und Brückeninfrastruktur. Höchste Präzision, BIM-Planung und zertifizierte Arbeitssicherheit.",
  keywords: [
    "Bauunternehmen",
    "Generalunternehmer",
    "Hochhausbau",
    "Ingenieurbau",
    "Brückenbau",
    "BIM Planung",
    "Turmdrehkrane",
    "Global Bau",
  ],
  authors: [{ name: "Global Bau & Generalunternehmung" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${montserrat.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
