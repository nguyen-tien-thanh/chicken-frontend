import type { BaseRecord } from "@refinedev/core";

/** Khớp Prisma `enum Method` (HTTP verb). */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IRole extends BaseRecord {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  /** Gửi kèm body create/update role để đồng bộ quyền (API tự xử lý bảng nối). */
  permissionIds?: string[];
  users?: IUser[];
  rolesPermissions?: IRolesPermission[];
}

export interface IUser extends BaseRecord {
  id: string;
  email: string;
  name: string;
  roleId: string;
  /** Chỉ có khi tạo/cập nhật; API list/show thường không trả về. */
  password?: string;
  createdAt: string;
  updatedAt: string;
  role?: Pick<IRole, "id" | "name" | "description">;
}

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

export interface IRolesPermission extends BaseRecord {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: string;
  updatedAt: string;
  role?: Pick<IRole, "id" | "name" | "description">;
  permission?: Pick<IPermission, "id" | "path" | "method" | "description">;
}
