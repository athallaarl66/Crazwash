// app/(public)/order/success/page.tsx
import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
