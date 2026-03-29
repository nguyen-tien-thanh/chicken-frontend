/** Khớp Prisma `enum InventoryTransactionType`. */
export type InventoryTransactionType =
  | "PURCHASE"
  | "SALE"
  | "ADJUSTMENT"
  | "TRANSFER"
  | "OTHER";

/** Khớp Prisma `enum InventoryTransactionDirection`. */
export type InventoryTransactionDirection = "IN" | "OUT";

export const INVENTORY_TX_TYPE_LABELS: Record<InventoryTransactionType, string> =
  {
    PURCHASE: "Nhập mua",
    SALE: "Bán hàng",
    ADJUSTMENT: "Điều chỉnh",
    TRANSFER: "Chuyển kho",
    OTHER: "Khác",
  };

export const INVENTORY_TX_DIRECTION_LABELS: Record<
  InventoryTransactionDirection,
  string
> = {
  IN: "Nhập",
  OUT: "Xuất",
};
