"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import SearchModal from "../Modals/SearchModal";
import QuoteModal from "../Modals/QuoteModal";
import { siteHeaderConfig } from "@/data/navigationData";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onOpenQuoteModal?: () => void;
  isSolid?: boolean;
}

export default function Navbar({ onOpenQuoteModal, isSolid = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [internalQuoteOpen, setInternalQuoteOpen] = useState(false);

  const handleOpenQuote = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal();
    } else {
      setInternalQuoteOpen(true);
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isSolid ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Hauptnavigation">
            {siteHeaderConfig.navLinks.map((link, index) => (
              <React.Fragment key={link.id}>
                {index > 0 && <span className={styles.navSeparator}>|</span>}
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* Aktionen: Suche + ANGEBOT ANFORDERN */}
          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => setSearchModalOpen(true)}
              aria-label="Website durchsuchen"
              title="Suche"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className={styles.quoteBtn}
              onClick={handleOpenQuote}
              aria-label="Unverbindliches Angebot anfordern"
            >
              ANGEBOT ANFORDERN
            </button>

            {/* Mobiler Menübutton */}
            <button
              type="button"
              className={styles.mobileToggleBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü umschalten"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ""}`}>
        <div className={styles.drawerBackdrop} onClick={() => setMobileMenuOpen(false)} />
        <div className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Menü schließen"
            >
              <X size={22} />
            </button>
          </div>

          <nav className={styles.mobileNavList}>
            {siteHeaderConfig.navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.drawerFooter}>
            <button
              type="button"
              className={styles.drawerQuoteBtn}
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenQuote();
              }}
            >
              ANGEBOT ANFORDERN
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <QuoteModal
        isOpen={internalQuoteOpen}
        onClose={() => setInternalQuoteOpen(false)}
      />
    </>
  );
}
