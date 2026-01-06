// src/components/layout/Footer.tsx
import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                ShoesWash<span className="text-blue-600">.</span>
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Layanan cuci sepatu profesional di Bandung dengan hasil maksimal
              dan harga terjangkau.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Layanan
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Pesan Sekarang
                </Link>
              </li>
              <li></li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Layanan</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">Basic Wash</li>
              <li className="text-sm text-gray-600">Premium Clean</li>
              <li className="text-sm text-gray-600">Deep Cleaning</li>
              <li className="text-sm text-gray-600">Treatment Khusus</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Jl. Contoh No. 123, Bandung, Jawa Barat</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@shoeswash.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {currentYear} ShoesWash. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600"
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
