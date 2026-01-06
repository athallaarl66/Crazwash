export type CustomerStatus = "ACTIVE" | "IDLE" | "DORMANT";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;

  totalOrders: number;
  totalSpending: number;

  firstOrderDate: Date;
  lastOrderDate: Date;

  status: CustomerStatus;
};
