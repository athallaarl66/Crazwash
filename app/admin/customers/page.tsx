// app/admin/customers/page.tsx
import { getCustomersSummary } from "@/lib/customerService";
import CustomersClient from "./components/CustomersClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function CustomersPage() {
  let customers;
  try {
    customers = await getCustomersSummary();
  } catch (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading customers:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <CustomersClient customers={customers} />
    </div>
  );
}
