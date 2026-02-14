// components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/crazwash.svg"
                alt="Crazwash"
                width={42}
                height={42}
              />
              <span className="text-h5 text-foreground">
                Crazwash<span className="text-accent">.</span>
              </span>
            </div>

            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Layanan cuci sepatu profesional dengan hasil maksimal dan harga
              terjangkau.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-body">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-body-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-body-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Layanan
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-body-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Pesan Sekarang
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-body">
              Layanan
            </h3>
            <ul className="space-y-2.5">
              <li className="text-body-sm text-muted-foreground">Basic Wash</li>
              <li className="text-body-sm text-muted-foreground">
                Premium Clean
              </li>
              <li className="text-body-sm text-muted-foreground">
                Deep Cleaning
              </li>
              <li className="text-body-sm text-muted-foreground">
                Treatment Khusus
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-body">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-body-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>Bandung, Arcamanik</span>
              </li>
              <li className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent" />
                <a
                  href="tel:+6285863884877"
                  className="hover:text-accent transition-colors"
                >
                  +62 858-6388-4877
                </a>
              </li>
              {/* <li className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent" />
                <a 
                  href="mailto:info@crazwash.com"
                  className="hover:text-accent transition-colors"
                >
                  info@crazwash.com
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-sm text-muted-foreground">
              © {currentYear} Crazwash. All rights reserved.
            </p>

            <div className="flex gap-6">
              <Link
                href="#"
                className="text-body-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-body-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
