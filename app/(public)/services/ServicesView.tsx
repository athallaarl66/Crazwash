// app/(public)/services/ServicesView.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Shield,
  Zap,
  Star,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: "BASIC" | "PREMIUM" | "DEEP" | "TREATMENT";
  duration: number;
}

interface ServicesViewProps {
  products: Product[];
}

// BEFORE/AFTER DATA
const BEFORE_AFTER = [
  {
    id: 1,
    before: "/images/HCL_25.jpg",
    after: "/images/HCL_26.jpg",
    title: "Deep Clean Premium",
    description: "Sepatu putih yang menguning kembali bersih",
    category: "Deep Cleaning",
  },
  {
    id: 2,
    before: "/images/HCL_27.jpg",
    after: "/images/HCL_28.jpg",
    title: "Leather Restoration",
    description: "Perawatan sepatu kulit yang kusam",
    category: "Premium Care",
  },
  {
    id: 3,
    before: "/images/HCL_35.jpg",
    after: "/images/HCL_37.jpg",
    title: "Unyellow Treatment",
    description: "Menghilangkan warna kuning pada sole",
    category: "Special Treatment",
  },
];

// WHY CHOOSE US DATA
const BENEFITS = [
  {
    icon: Zap,
    title: "Proses Cepat",
    desc: "Pengerjaan 1-3 hari kerja",
    colorBg: "bg-warning/10",
    colorText: "text-warning",
    colorHoverBg: "group-hover:bg-warning",
    colorHoverText: "group-hover:text-warning-foreground",
  },
  {
    icon: Sparkles,
    title: "Hasil Maksimal",
    desc: "Sepatu kembali seperti baru",
    colorBg: "bg-info/10",
    colorText: "text-info",
    colorHoverBg: "group-hover:bg-info",
    colorHoverText: "group-hover:text-info-foreground",
  },
  {
    icon: Shield,
    title: "Garansi Aman",
    desc: "100% garansi kepuasan",
    colorBg: "bg-success/10",
    colorText: "text-success",
    colorHoverBg: "group-hover:bg-success",
    colorHoverText: "group-hover:text-success-foreground",
  },
];

export default function ServicesView({ products }: ServicesViewProps) {
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);

  const nextBeforeAfter = () =>
    setBeforeAfterIndex((prev) => (prev + 1) % BEFORE_AFTER.length);
  const prevBeforeAfter = () =>
    setBeforeAfterIndex(
      (prev) => (prev - 1 + BEFORE_AFTER.length) % BEFORE_AFTER.length,
    );

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION - Simplified */}
      <section className="relative py-16 lg:py-24 bg-primary text-primary-foreground overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-90"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-h1 mb-4 tracking-tight">
              Layanan Premium Cuci Sepatu
            </h1>

            <p className="text-body-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Profesional • Cepat • Terpercaya
            </p>

            {/* Quick Stats - Compact */}
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {[
                { icon: Clock, label: "1-3 Hari Kerja" },
                { icon: Shield, label: "100% Garansi" },
                { icon: Star, label: "Hasil Premium" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2 bg-card/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-card/20"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-foreground mb-4">Kenapa Pilih Kami?</h2>
            <p className="text-body text-muted-foreground">
              Komitmen kami untuk memberikan layanan terbaik
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className="card-custom p-6 text-center h-full group">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 ${benefit.colorBg} ${benefit.colorText} ${benefit.colorHoverBg} ${benefit.colorHoverText}`}
                    >
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-card-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-body-sm text-muted-foreground leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER CAROUSEL - Enhanced */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-success/10 text-success border-success/20 px-5 py-2 font-semibold">
              <Sparkles className="h-4 w-4 mr-2" />
              Portfolio Kami
            </Badge>
            <h2 className="text-h2 text-foreground mb-4">Before & After</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Transformasi nyata dari setiap sepatu yang kami tangani dengan
              detail maksimal
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={beforeAfterIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Category Badge */}
                <div className="flex justify-center mb-6">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium border-accent text-accent"
                  >
                    {BEFORE_AFTER[beforeAfterIndex].category}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {/* BEFORE */}
                  <div className="relative group">
                    <div className="card-custom p-4 border-2 border-destructive/40 overflow-hidden">
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-destructive text-destructive-foreground border-0 px-4 py-1.5 text-sm font-bold shadow-soft">
                            BEFORE
                          </Badge>
                        </div>
                        <Image
                          src={BEFORE_AFTER[beforeAfterIndex].before}
                          alt="Before"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-destructive/0 group-hover:bg-destructive/10 transition-colors duration-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* AFTER */}
                  <div className="relative group">
                    <div className="card-custom p-4 border-2 border-success/40 overflow-hidden">
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-success text-success-foreground border-0 px-4 py-1.5 text-sm font-bold shadow-soft">
                            AFTER
                          </Badge>
                        </div>
                        <Image
                          src={BEFORE_AFTER[beforeAfterIndex].after}
                          alt="After"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-success/0 group-hover:bg-success/10 transition-colors duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="text-center mt-8 px-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {BEFORE_AFTER[beforeAfterIndex].title}
                  </h3>
                  <p className="text-body text-muted-foreground max-w-xl mx-auto">
                    {BEFORE_AFTER[beforeAfterIndex].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <Button
                onClick={prevBeforeAfter}
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full border-2 border-input hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                {BEFORE_AFTER.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBeforeAfterIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === beforeAfterIndex
                        ? "w-8 bg-accent"
                        : "w-2 bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={nextBeforeAfter}
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full border-2 border-input hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KATALOG PRICE LIST - SUPER COMPACT */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container-custom max-w-lg">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-h2 text-foreground mb-3">Daftar Harga</h2>
              <p className="text-body text-muted-foreground">
                Harga transparan untuk semua layanan
              </p>
            </motion.div>
          </div>

          {/* KATALOG IMAGE - Much Smaller, mobile-friendly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="card-custom p-1.5 border border-border">
              <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden">
                <Image
                  src="/images/crazwashKatalog.jpeg"
                  alt="Katalog Price List Crazwash"
                  fill
                  className="object-contain bg-muted"
                  sizes="(max-width: 640px) 90vw, 512px"
                />
              </div>
            </div>
          </motion.div>

          {/* CTA BUTTON */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link href="/order">
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-primary-foreground px-10 py-6 text-base rounded-xl shadow-soft-lg hover:shadow-xl transition-all duration-300 gap-3 group font-semibold"
              >
                <span>Pesan Sekarang</span>
              </Button>
            </Link>
            <p className="text-body-sm text-muted-foreground mt-4">
              *Hubungi kami untuk info lebih lanjut
            </p>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h2 mb-4">Siap Memberikan Sepatu Terbaik?</h2>
            <p className="text-body-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Percayakan perawatan sepatu Anda pada ahlinya
            </p>
            <Link href="/order">
              <Button
                size="lg"
                className="bg-card text-card-foreground hover:bg-card/90 px-10 py-6 text-base rounded-xl shadow-soft-lg hover:shadow-xl transition-all duration-300 gap-3 group font-semibold"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
