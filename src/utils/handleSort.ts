import type { CrudSorting, SortOrder } from '@refinedev/core';

const nestOrderPath = (
  field: string,
  order: SortOrder,
): Record<string, unknown> => {
  const segments = field.split('.').filter(Boolean);
  if (segments.length === 0) return {};
  let node: Record<string, unknown> = {
    [segments[segments.length - 1]!]: order,
  };
  for (let i = segments.length - 2; i >= 0; i--) {
    const seg = segments[i]!;
    node = { [seg]: node };
  }
  return node;
};

/** Refine sorters → Prisma `orderBy` (array form, matches multi-field sorts). */
export const crudSortingToPrismaOrderBy = (
  sorters?: CrudSorting,
): Record<string, unknown>[] | undefined => {
  if (!sorters?.length) return undefined;

  const items = sorters
    .filter((s) => s.field && s.order)
    .map((s) => nestOrderPath(s.field, s.order));

  if (items.length === 0) return undefined;
  return items;
};
