import type { BaseRecord } from '@refinedev/core';

import type { HttpMethod } from './http-method';
import type { IRolesPermission } from './roles-permission';

export interface IPermission extends BaseRecord {
  id: string;
  path: string;
  method: HttpMethod;
  description?: string | null;
  default: boolean;
  createdAt: string;
  updatedAt: string;
  rolesPermissions?: IRolesPermission[];
}
