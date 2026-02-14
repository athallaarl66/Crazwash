// app/admin/customers/page.tsx
import { getCustomersSummary } from "@/lib/customerService";
import CustomersClient from "./components/CustomersClient";

export default async function CustomersPage() {
  const customers = await getCustomersSummary();

  return <CustomersClient customers={customers} />;
}
