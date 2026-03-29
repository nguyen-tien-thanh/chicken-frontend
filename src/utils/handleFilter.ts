import type { CrudFilter, CrudFilters } from "@refinedev/core";

import { mapRefineOperatorToPrisma } from "./mapOperator";

export const nestFieldPath = (
  field: string,
  leaf: Record<string, unknown>
): Record<string, unknown> => {
  const segments = field.split(".").filter(Boolean);
  if (segments.length === 0) return {};
  let node: Record<string, unknown> = leaf;
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i]!;
    node = { [seg]: node };
  }
  return node;
};

export const crudFilterToPrismaWhere = (
  filter: CrudFilter
): Record<string, unknown> => {
  if (filter.operator === "and" || filter.operator === "or") {
    const clauses = filter.value
      .map(crudFilterToPrismaWhere)
      .filter((c) => Object.keys(c).length > 0);
    if (clauses.length === 0) return {};
    return filter.operator === "and" ? { AND: clauses } : { OR: clauses };
  }

  if (!("field" in filter) || !filter.field || filter.field === "") {
    return {};
  }

  const leaf = mapRefineOperatorToPrisma(filter.operator, filter.value);
  return nestFieldPath(filter.field, leaf);
};

/** Refine filter list → Prisma `where` (siblings combined with `AND`). */
export const filtersToPrismaWhere = (
  filters?: CrudFilters
): Record<string, unknown> | undefined => {
  if (!filters?.length) return undefined;

  const clauses = filters
    .map(crudFilterToPrismaWhere)
    .filter((c) => Object.keys(c).length > 0);

  if (clauses.length === 0) return undefined;
  if (clauses.length === 1) return clauses[0];
  return { AND: clauses };
};
