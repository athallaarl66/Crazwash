// app/admin/customers/types.ts
import {
  CustomerSummary as LibCustomerSummary,
  CustomerStatus,
} from "@/lib/customerService";

export type { CustomerSummary, CustomerStatus } from "@/lib/customerService";
export type Customer = LibCustomerSummary;

// TYPE UNTUK DETAIL PAGE
export type CustomerDetail = {
  phone: string;
  name: string;
  email: string | null;
  address: string;
  city: string;
  totalOrders: number;
  totalSpending: number;
  averageOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  status: CustomerStatus;
  userId: number;
};
