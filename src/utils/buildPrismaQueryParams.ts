import type { CrudFilters, CrudSorting, Pagination } from "@refinedev/core";

import { filtersToPrismaWhere } from "./handleFilter";
import { paginationToPrismaSkipTake } from "./handlePagination";
import { crudSortingToPrismaOrderBy } from "./handleSort";
import {
  type PrismaIncludeSelectMeta,
  resolvePrismaIncludeSelect,
} from "./resolvePrismaIncludeSelect";

export type PrismaListQueryOptions = PrismaIncludeSelectMeta & {
  filters?: CrudFilters;
  sorters?: CrudSorting;
  pagination?: Pagination;
};

const appendIfPresent = (
  params: URLSearchParams,
  key: string,
  value: unknown
): void => {
  if (value === undefined || value === null) return;
  if (typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value as object).length === 0) return;
    params.set(key, JSON.stringify(value));
    return;
  }
  if (Array.isArray(value) && value.length === 0) return;
  params.set(key, JSON.stringify(value));
};

/** Serializes Prisma-style list query params (`where`, `orderBy`, `include` XOR `select`, `skip`, `take`). */
export const buildPrismaListQueryParams = (
  options: PrismaListQueryOptions
): URLSearchParams => {
  const params = new URLSearchParams();

  const where = filtersToPrismaWhere(options.filters);
  appendIfPresent(params, "where", where);

  const orderBy = crudSortingToPrismaOrderBy(options.sorters);
  appendIfPresent(params, "orderBy", orderBy);

  const { include, select } = resolvePrismaIncludeSelect(options);
  appendIfPresent(params, "select", select);
  appendIfPresent(params, "include", include);

  const { skip, take } = paginationToPrismaSkipTake(options.pagination);
  if (skip != null) params.set("skip", String(skip));
  if (take != null) params.set("take", String(take));

  return params;
};

export const buildPrismaGetManyQueryParams = (
  ids: (string | number)[],
  meta?: PrismaIncludeSelectMeta
): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("where", JSON.stringify({ id: { in: ids } }));

  const { include, select } = resolvePrismaIncludeSelect(meta);
  appendIfPresent(params, "select", select);
  appendIfPresent(params, "include", include);

  return params;
};

export const buildPrismaGetOneQueryParams = (
  meta?: PrismaIncludeSelectMeta
): URLSearchParams => {
  const params = new URLSearchParams();
  const { include, select } = resolvePrismaIncludeSelect(meta);
  appendIfPresent(params, "select", select);
  appendIfPresent(params, "include", include);
  return params;
};
