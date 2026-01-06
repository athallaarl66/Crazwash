// src/app/(public)/services/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ServicesPage() {
  const services = [
    {
      title: "Basic Wash",
      price: "Rp 25.000",
      iconColor: "bg-blue-100 text-blue-600",
      features: ["Cuci luar dalam", "Sikat lembut", "Pengering"],
    },
    {
      title: "Premium Clean",
      price: "Rp 45.000",
      iconColor: "bg-purple-100 text-purple-600",
      features: [
        "Deep cleaning",
        "Polish & shine",
        "Deodorizer",
        "Waterproof spray",
      ],
      popular: true,
    },
    {
      title: "Deep Cleaning",
      price: "Rp 65.000",
      iconColor: "bg-green-100 text-green-600",
      features: [
        "Ultrasonic clean",
        "Premium polish",
        "UV protection",
        "Box cleaning",
      ],
    },
    {
      title: "Treatment Khusus",
      price: "Rp 85.000",
      iconColor: "bg-orange-100 text-orange-600",
      features: [
        "Suede treatment",
        "Leather care",
        "Canvas restoration",
        "Color restoration",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Dewi Rahayu",
      before: "/images/HCL_25.jpg",
      after: "/images/HCL_26.jpg",
    },
    {
      name: "Rizky Firmansyah",
      before: "/images/HCL_27.jpg",
      after: "/images/HCL_28.jpg",
    },
    {
      name: "Sinta Amelia",
      before: "/images/HCL_35.jpg",
      after: "/images/HCL_37.jpg",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Layanan Cuci Sepatu Profesional
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Pilih paket sesuai kebutuhan sepatu kamu dan lihat hasilnya langsung!
        </p>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Layanan Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Pilih paket yang cocok untuk sepatu kamu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {services.map((service, idx) => (
              <Card
                key={idx}
                className={`hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 ${
                  service.popular ? "border-2 border-blue-500" : ""
                }`}
              >
                <CardHeader className="flex flex-col items-center">
                  <div
                    className={`${service.iconColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="text-2xl font-bold mt-2">
                    {service.price}
                  </CardDescription>
                  {service.popular && (
                    <Badge className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-full">
                      Most Popular
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Single CTA Button di bawah grid */}
          <div className="flex justify-center">
            <Link href="/order">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center gap-2 px-6 py-3 cursor-pointer">
                Pesan Sekarang
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Before-After Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Hasil Layanan Kami
          </h2>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            loop
            className="relative"
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-15 mb-18">
                  {/* Before */}
                  <div className="relative w-full md:w-1/2 group">
                    <img
                      src={t.before}
                      alt="Before"
                      className="rounded-xl shadow-lg object-cover w-full h-64 md:h-80 transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Before
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative w-full md:w-1/2 group">
                    <img
                      src={t.after}
                      alt="After"
                      className="rounded-xl shadow-lg object-cover w-full h-64 md:h-80 transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      After
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Pagination customization */}
            <div className="swiper-pagination !bottom-0 mt-6"></div>
          </Swiper>
        </div>
      </section>
    </div>
  );
}
