// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Truck, CheckCircle } from "lucide-react";

import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";

/* ================= TYPES ================= */

type ServiceItem = {
  name: string;
  price: string;
  badge?: string;
};

type CategoryKey = "shoes" | "bags" | "special";

type ServiceCategory = Record<CategoryKey, ServiceItem[]>;

/* ================= DATA ================= */

const services: ServiceCategory = {
  shoes: [
    { name: "Deep Clean", price: "50K", badge: "BEST" },
    { name: "Cuci Express", price: "70K", badge: "FAST" },
    { name: "Leather Care", price: "60K" },
    { name: "Suede Care", price: "65K" },
    { name: "Kids Shoes", price: "35K" },
    { name: "Flatshoes", price: "30K" },
    { name: "Sandal", price: "30K" },
  ],
  bags: [
    { name: "Bag S", price: "30K" },
    { name: "Bag M", price: "40K" },
    { name: "Bag L", price: "60K" },
    { name: "Bag XL", price: "100K" },
    { name: "Bag XXL", price: "170K" },
  ],
  special: [
    { name: "Reglue", price: "100K", badge: "REPAIR" },
    { name: "Repaint Midsole", price: "80K" },
    { name: "Repaint Upper", price: "130K" },
    { name: "Unyellow", price: "90K", badge: "POPULAR" },
  ],
};

const CATEGORY_CONFIG = {
  shoes: { title: "👟 Cleaning Treatment" },
  bags: { title: "👜 Bag Cleaning" },
  special: { title: "✨ Special Treatment" },
} as const;

/* ================= PAGE ================= */

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicNavbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="container-custom mx-auto py-20 lg:py-28 text-center max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-6 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 text-body-sm font-medium"
          >
            Premium Shoe & Bag Cleaning
          </Badge>

          <h1 className="text-h1 mb-6 animate-fade-in">
            Bikin Sepatu & Tas
            <span className="block text-secondary mt-2">
              Kembali Seperti Baru
            </span>
          </h1>

          <p className="text-body-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Deep clean profesional + pickup delivery terpercaya.
          </p>

          <p className="font-semibold text-secondary mb-10 tracking-wide text-body">
            "ANDA PUAS SAYA TEWAS"
          </p>

          <Link href="/order">
            <Button
              size="lg"
              className="
    bg-white
    text-primary
    hover:scale-105
    transition
    duration-200
    shadow-xl
    rounded-full
    px-10
  "
            >
              Pesan Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* ================= PRICE LIST ================= */}
      <section className="py-16 lg:py-20">
        <div className="container-custom mx-auto max-w-4xl">
          <h2 className="text-h2 mb-10 text-center">Price List</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Shoes */}
            <div className="card-custom p-6">
              <h3 className="text-body font-semibold mb-4 uppercase tracking-wide text-primary border-b border-border pb-2">
                {CATEGORY_CONFIG.shoes.title}
              </h3>
              <div className="space-y-2.5">
                {services.shoes.map((service, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm group-hover:text-primary transition-colors">
                        {service.name}
                      </span>
                      {service.badge && (
                        <Badge
                          variant="secondary"
                          className={`text-caption px-2 py-0.5 ${
                            service.badge === "BEST"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="font-bold text-primary tabular-nums text-body-sm">
                      {service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bags */}
            <div className="card-custom p-6">
              <h3 className="text-body font-semibold mb-4 uppercase tracking-wide text-primary border-b border-border pb-2">
                {CATEGORY_CONFIG.bags.title}
              </h3>
              <div className="space-y-2.5">
                {services.bags.map((service, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 group"
                  >
                    <span className="text-body-sm group-hover:text-primary transition-colors">
                      {service.name}
                    </span>
                    <span className="font-bold text-primary tabular-nums text-body-sm">
                      {service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special */}
          <div className="card-custom p-6">
            <h3 className="text-body font-semibold mb-4 uppercase tracking-wide text-primary border-b border-border pb-2">
              {CATEGORY_CONFIG.special.title}
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {services.special.map((service, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm group-hover:text-primary transition-colors">
                      {service.name}
                    </span>
                    {service.badge && (
                      <Badge
                        variant="secondary"
                        className={`text-caption px-2 py-0.5 ${
                          service.badge === "REPAIR"
                            ? "bg-warning text-warning-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-primary tabular-nums text-body-sm">
                    {service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button
                size="lg"
                className="
    bg-primary
    text-white
    hover:scale-105
    transition
    duration-200
    shadow-xl
    rounded-full
    px-10
  "
              >
                Lihat Layanan{" "}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container-custom mx-auto">
          <h2 className="text-h2 mb-12 text-center">Kenapa Pilih Crazwash?</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Cepat & Tepat",
                desc: "Proses 2-3 hari profesional",
                colorBg: "bg-warning/10",
                colorText: "text-warning",
                colorHoverBg: "group-hover:bg-warning",
                colorHoverText: "group-hover:text-warning-foreground",
              },
              {
                icon: Shield,
                title: "Garansi Aman",
                desc: "Dijamin aman untuk material",
                colorBg: "bg-success/10",
                colorText: "text-success",
                colorHoverBg: "group-hover:bg-success",
                colorHoverText: "group-hover:text-success-foreground",
              },
              {
                icon: Truck,
                title: "Pickup Delivery",
                desc: "Gratis area tertentu",
                colorBg: "bg-info/10",
                colorText: "text-info",
                colorHoverBg: "group-hover:bg-info",
                colorHoverText: "group-hover:text-info-foreground",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="text-center group hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${item.colorBg} ${item.colorText} ${item.colorHoverBg} ${item.colorHoverText}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>

                  <h3 className="text-h5 mb-2">{item.title}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative container-custom mx-auto">
          <h2 className="text-h2 mb-6">Siap Bikin Barangmu Bersih Lagi?</h2>

          <p className="text-body-lg opacity-90 mb-10 max-w-2xl mx-auto">
            Kualitas premium, harga UMKM. Gratis pickup untuk area tertentu!
          </p>

          <Link href="/order">
            <Button
              size="lg"
              className="
    bg-white
    text-primary
    hover:scale-105
    transition
    duration-200
    shadow-xl
    rounded-full
    px-10
  "
            >
              Pesan Sekarang
            </Button>
          </Link>

          <div className="mt-10 flex flex-wrap gap-6 justify-center text-body-sm opacity-90">
            {["100% Aman", "Berpengalaman", "Hasil Maksimal"].map((text, i) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
