import type { BaseRecord } from '@refinedev/core';

export interface IProductCategory extends BaseRecord {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
