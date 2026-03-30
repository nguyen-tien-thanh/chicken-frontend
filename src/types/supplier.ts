import type { BaseRecord } from "@refinedev/core";
import { BankName } from "./bank-name-enum";

export interface ISupplier extends BaseRecord {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  bankAccount?: string | null;
  bankName?: BankName | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
