// src/app/(public)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  Shield,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

// Layout
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-32 animate-fade-in">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-500/20 text-white border-blue-400">
              Trusted by 1000+ Customers in Bandung
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Cuci Sepatu Profesional dengan Hasil Maksimal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Layanan cuci sepatu terpercaya di Bandung. Pickup & delivery
              gratis untuk area tertentu.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {/* Primary */}
              <Link href="/order">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 font-semibold cursor-pointer hover:text-blue-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                >
                  Pesan Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Layanan Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in delay-100">
              Pilih paket sesuai kebutuhan sepatu kamu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Basic Wash",
                price: "Rp 25.000",
                icon: Sparkles,
                iconBg: "bg-blue-100 text-blue-600",
                items: ["Cuci luar dalam", "Sikat lembut", "Pengering"],
              },
              {
                title: "Premium Clean",
                price: "Rp 45.000",
                icon: Sparkles,
                iconBg: "bg-purple-100 text-purple-600",
                items: [
                  "Deep cleaning",
                  "Polish & shine",
                  "Deodorizer",
                  "Waterproof spray",
                ],
                badge: "Most Popular",
                badgeColor: "bg-blue-600 text-white", // sekarang senada biru
              },
              {
                title: "Deep Cleaning",
                price: "Rp 65.000",
                icon: Sparkles,
                iconBg: "bg-green-100 text-green-600",
                items: [
                  "Ultrasonic clean",
                  "Premium polish",
                  "UV protection",
                  "Box cleaning",
                ],
              },
              {
                title: "Treatment Khusus",
                price: "Rp 85.000",
                icon: Shield,
                iconBg: "bg-orange-100 text-orange-600",
                items: [
                  "Suede treatment",
                  "Leather care",
                  "Canvas restoration",
                  "Color restoration",
                ],
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card
                  key={idx}
                  className="group relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in"
                >
                  {service.badge && (
                    <Badge
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 z-10 font-bold ${service.badgeColor}`}
                    >
                      {service.badge}
                    </Badge>
                  )}
                  <CardHeader className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-6`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center font-semibold">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900 mt-2">
                      {service.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {service.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors duration-300"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja</h2>
            <p className="text-gray-600 text-lg">
              Simple dan mudah dalam 4 langkah
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {["Pesan Online", "Pickup Gratis", "Proses Cuci", "Delivery"].map(
              (step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step}</h3>
                  <p className="text-gray-600 text-sm">
                    {
                      {
                        0: "Pilih layanan dan isi form pemesanan",
                        1: "Kami jemput sepatu di lokasi kamu",
                        2: "Sepatu dicuci profesional 2-3 hari",
                        3: "Sepatu bersih diantar kembali",
                      }[idx]
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kenapa Pilih Kami?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Cepat & Tepat Waktu",
                desc: "Proses 2-3 hari kerja dengan hasil maksimal",
                bg: "bg-blue-100 text-blue-600",
              },
              {
                icon: Shield,
                title: "Garansi 100%",
                desc: "Jaminan uang kembali jika tidak puas",
                bg: "bg-purple-100 text-purple-600",
              },
              {
                icon: Truck,
                title: "Pickup & Delivery",
                desc: "Gratis untuk area Bandung tertentu",
                bg: "bg-green-100 text-green-600",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div
                    className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Siap Membuat Sepatu Kamu Bersih Kembali?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl">
            Pesan sekarang dan dapatkan sepatu bersih maksimal dalam 2-3 hari!
          </p>

          <Link href="/order">
            <Button
              size="lg"
              className="
          bg-white text-blue-600 flex items-center justify-center gap-2 
          hover:bg-gray-200 hover:shadow-lg hover:-translate-y-1 
          transition-all duration-200 ease-in-out cursor-pointer
        "
            >
              Pesan Sekarang
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
