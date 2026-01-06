// app/(public)/order/OrderView.tsx
import { getAllProducts } from "@/lib/productService"; // ← update import path
import { OrderForm } from "./components/OrderForm";

export default async function OrderView() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pesan Layanan Cuci Sepatu</h1>
          <p className="text-gray-600">
            Isi form di bawah untuk memesan layanan cuci sepatu. Kami akan
            menghubungi Anda untuk konfirmasi.
          </p>
        </div>

        <OrderForm products={products} />
      </div>
    </div>
  );
}
