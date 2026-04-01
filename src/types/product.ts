import type { BaseRecord } from '@refinedev/core';

import type { IProductCategory } from './product-category';
import type { ProductType } from './product-type';

export interface IProduct extends BaseRecord {
  id: string;
  name: string;
  type: ProductType;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  category?: Pick<IProductCategory, 'id' | 'name'>;
}
