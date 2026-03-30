import type { BaseRecord } from "@refinedev/core";

export interface ISupplier extends BaseRecord {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  bankAccount?: string | null;
  bankName?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
