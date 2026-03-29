import type { BaseRecord } from "@refinedev/core";

export interface ICustomer extends BaseRecord {
  id: string;
  name?: string | null;
  phone: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
