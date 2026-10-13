// app/page.tsx
//
// Public prices come from the product catalogue (the same records the services
// page and the order flow use), grouped by product category. There is no
// hardcoded price list: an admin price change shows up here (see
// openspec/changes/fix-customer-facing-placeholders/specs/public-pricing).
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Truck, CheckCircle } from "lucide-react";

import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { getActiveProducts } from "@/lib/productService";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  ProductCategory,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_ORDER: ProductCategory[] = [
  ProductCategory.BASIC,
  ProductCategory.PREMIUM,
  ProductCategory.DEEP,
  ProductCategory.TREATMENT,
];

/* ================= PAGE ================= */

export default async function LandingPage() {
  const products = await getActiveProducts();

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    description: CATEGORY_DESCRIPTIONS[category],
    items: products.filter((product) => product.category === category),
  })).filter((group) => group.items.length > 0);

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

          <p className="text-body-lg opacity-90 mb-10 max-w-2xl mx-auto">
            Deep clean profesional + pickup delivery terpercaya.
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

          {groups.length === 0 ? (
            <p className="text-center text-body text-muted-foreground">
              Daftar layanan belum tersedia. Silakan hubungi admin Crazwash.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div key={group.category} className="card-custom p-6">
                  <h3 className="text-body font-semibold mb-1 uppercase tracking-wide text-primary border-b border-border pb-2">
                    {group.label}
                  </h3>
                  <p className="text-caption text-muted-foreground mb-3">
                    {group.description}
                  </p>
                  <div className="space-y-2.5">
                    {group.items.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between py-2 group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-body-sm group-hover:text-primary transition-colors">
                            {product.name}
                          </span>
                          {product.badge && (
                            <Badge
                              variant="secondary"
                              className="text-caption px-2 py-0.5 bg-secondary text-secondary-foreground"
                            >
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="font-bold text-primary tabular-nums text-body-sm">
                          {formatCurrency(Number(product.price))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

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
