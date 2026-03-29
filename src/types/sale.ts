import type { BaseRecord } from "@refinedev/core";

import type { ICustomer } from "./customer";
import type { ISaleItem } from "./sale-item";
import type { SaleStatus } from "./sale-status";

export interface ISale extends BaseRecord {
  id: string;
  saleDate: string;
  subtotalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: SaleStatus;
  note?: string | null;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  customer?: Pick<ICustomer, "id" | "name" | "phone">;
  saleItems?: ISaleItem[];
}
