import type { BaseRecord } from "@refinedev/core";

import type { IPurchaseItem } from "./purchase-item";
import type { ISupplier } from "./supplier";

export interface IPurchase extends BaseRecord {
  id: string;
  purchaseDate: string;
  cagesCount: number;
  cagesWeight: number;
  averageWeight: number;
  totalAmount: number;
  note?: string | null;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  supplier?: Pick<ISupplier, "id" | "name" | "phone">;
  purchaseItems?: IPurchaseItem[];
}
