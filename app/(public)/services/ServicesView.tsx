// app/(public)/services/ServicesView.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
  },
  {
    id: 2,
    before: "/images/HCL_27.jpg",
    after: "/images/HCL_28.jpg",
    title: "Leather Restoration",
    description: "Perawatan sepatu kulit yang kusam",
  },
  {
    id: 3,
    before: "/images/HCL_35.jpg",
    after: "/images/HCL_37.jpg",
    title: "Unyellow Treatment",
    description: "Menghilangkan warna kuning pada sole",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO SECTION */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 10,000+ Customers
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Layanan Premium Cuci Sepatu
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Profesional • Cepat • Terpercaya
            </p>
          </motion.div>
        </div>
      </section>

      {/* KATALOG PRICE LIST */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Daftar Harga
            </h2>
            <p className="text-gray-600">
              Lihat katalog lengkap layanan kami di bawah
            </p>
          </div>

          {/* KATALOG IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-blue-200 shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative w-full aspect-[3/4] md:aspect-[2/3]">
                  <Image
                    src="/images/crazwashKatalog.jpeg"
                    alt="Katalog Price List Crazwash"
                    fill
                    className="object-contain bg-black"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA BUTTON */}
          <div className="mt-10 text-center">
            <Link href="/order">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 gap-3 group"
              >
                <span className="font-semibold">Pesan Sekarang</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              *Hubungi kami untuk info lebih lanjut
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Kenapa Pilih Kami?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: "⚡",
                  title: "Proses Cepat",
                  desc: "Pengerjaan 1-3 hari kerja",
                },
                {
                  icon: "✨",
                  title: "Hasil Maksimal",
                  desc: "Sepatu kembali seperti baru",
                },
                {
                  icon: "🛡️",
                  title: "Garansi Aman",
                  desc: "100% garansi kepuasan",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white">
                    <div className="text-6xl mb-4">{item.icon}</div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* BEFORE/AFTER CAROUSEL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Portfolio
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Before & After
            </h2>
            <p className="text-gray-600">
              Lihat transformasi sepatu yang kami tangani
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={beforeAfterIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {/* BEFORE */}
                  <Card className="overflow-hidden shadow-2xl border-2 border-gray-200">
                    <div className="relative aspect-square">
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-red-500 text-white border-0 px-5 py-2 text-base font-bold shadow-lg">
                          BEFORE
                        </Badge>
                      </div>
                      <Image
                        src={BEFORE_AFTER[beforeAfterIndex].before}
                        alt="Before"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>

                  {/* AFTER */}
                  <Card className="overflow-hidden shadow-2xl border-2 border-green-200">
                    <div className="relative aspect-square">
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-green-500 text-white border-0 px-5 py-2 text-base font-bold shadow-lg">
                          AFTER
                        </Badge>
                      </div>
                      <Image
                        src={BEFORE_AFTER[beforeAfterIndex].after}
                        alt="After"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                </div>

                {/* DESCRIPTION */}
                <div className="text-center mt-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {BEFORE_AFTER[beforeAfterIndex].title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {BEFORE_AFTER[beforeAfterIndex].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION */}
            <div className="flex justify-center gap-4 mt-10">
              <Button
                onClick={prevBeforeAfter}
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2">
                {BEFORE_AFTER.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBeforeAfterIndex(i)}
                    className={`h-3 rounded-full transition-all ${
                      i === beforeAfterIndex
                        ? "w-10 bg-blue-600"
                        : "w-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={nextBeforeAfter}
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
