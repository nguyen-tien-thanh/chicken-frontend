import type { BaseRecord } from "@refinedev/core";

import type { IProduct } from "./product";

export interface IPurchaseItem extends BaseRecord {
  id: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
  amount: number;
  avgWeightPerUnit: number;
  note?: string | null;
  purchaseId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  product?: Pick<IProduct, "id" | "name" | "type">;
}
