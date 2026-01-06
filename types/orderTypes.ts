// src/types/orderTypes.ts

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

// Enum untuk paymentStatus supaya sinkron dengan Prisma
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  address: string;
  city: string;
  pickupDate?: Date | null;
  notes?: string | null;
  totalPrice: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PICKED_UP"
    | "IN_PROGRESS"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  paymentStatus: PaymentStatus; // <-- updated
  orderItems: OrderItem[];
}
