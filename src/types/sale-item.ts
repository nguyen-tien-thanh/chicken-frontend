import type { BaseRecord } from '@refinedev/core';

import type { IProduct } from './product';

export interface ISaleItem extends BaseRecord {
  id: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
  amount: number;
  costAmount: number;
  profitAmount: number;
  note?: string | null;
  saleId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  product?: Pick<IProduct, 'id' | 'name' | 'type'>;
}
