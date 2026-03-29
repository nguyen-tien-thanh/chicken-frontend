import type { BaseRecord } from "@refinedev/core";

import type {
  InventoryTransactionDirection,
  InventoryTransactionType,
} from "./inventory-enums";
import type { IProduct } from "./product";

export interface IInventoryTransaction extends BaseRecord {
  id: string;
  transactionDate: string;
  refType: InventoryTransactionType;
  refId: string;
  direction: InventoryTransactionDirection;
  quantity: number;
  quantityUnit: string;
  unitCost: number;
  totalCost: number;
  note?: string | null;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product?: Pick<IProduct, "id" | "name" | "type">;
}
