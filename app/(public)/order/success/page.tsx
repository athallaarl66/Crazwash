// app/(public)/order/success/page.tsx
//
// URL contract: /order/success?orderNumber=<orderNumber>
// The order number is the only value accepted from the URL. Everything shown is
// read from the stored order, so a hand-edited link cannot fabricate a success
// state (see openspec/changes/fix-customer-facing-placeholders/design.md).
import Link from "next/link";
import { PackageX } from "lucide-react";

import { getOrderByNumber } from "@/lib/orderService";
import { getBusinessConfig } from "@/lib/business-config";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

function OrderNotFound() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto text-center card-custom p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <PackageX className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-h4 mb-2">Pesanan Tidak Ditemukan</h1>
        <p className="text-body text-muted-foreground mb-4">
          Kami tidak menemukan pesanan dengan nomor tersebut. Periksa kembali
          nomor pesanan Anda.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;

  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  if (!order) {
    return <OrderNotFound />;
  }

  // Configuration comes from the environment. A missing contact destination must
  // surface as an operational error, never as a link to an example number.
  let whatsappNumber = "";
  let paymentMethodLabel = order.paymentMethod ?? "";
  try {
    const config = getBusinessConfig();
    whatsappNumber = config.whatsappNumber;
    paymentMethodLabel =
      config.paymentDestinations.find(
        (destination) => destination.method === order.paymentMethod,
      )?.name ?? paymentMethodLabel;
  } catch (configError) {
    console.error("Business configuration unavailable:", configError);
  }

  return (
    <SuccessClient
      order={{
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalPrice: order.totalPrice,
        paymentMethodLabel,
      }}
      whatsappNumber={whatsappNumber}
    />
  );
}
