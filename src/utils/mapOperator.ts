import type { CrudOperators } from "@refinedev/core";

const insensitive = (filter: Record<string, unknown>) => ({
  ...filter,
  mode: "insensitive" as const,
});

/** Maps a Refine conditional operator to a Prisma field filter object (leaf only). */
export const mapRefineOperatorToPrisma = (
  operator: CrudOperators,
  value: unknown
): Record<string, unknown> => {
  switch (operator) {
    case "eq":
    case "eqs":
      return { equals: value };
    case "ne":
    case "nes":
      return { not: value };
    case "lt":
      return { lt: value };
    case "gt":
      return { gt: value };
    case "lte":
      return { lte: value };
    case "gte":
      return { gte: value };
    case "in":
    case "ina":
      return { in: value };
    case "nin":
    case "nina":
      return { notIn: value };
    case "contains":
      return insensitive({ contains: value });
    case "ncontains":
      return { not: insensitive({ contains: value }) };
    case "containss":
      return { contains: value };
    case "ncontainss":
      return { not: { contains: value } };
    case "startswith":
      return insensitive({ startsWith: value });
    case "nstartswith":
      return { not: insensitive({ startsWith: value }) };
    case "startswiths":
      return { startsWith: value };
    case "nstartswiths":
      return { not: { startsWith: value } };
    case "endswith":
      return insensitive({ endsWith: value });
    case "nendswith":
      return { not: insensitive({ endsWith: value }) };
    case "endswiths":
      return { endsWith: value };
    case "nendswiths":
      return { not: { endsWith: value } };
    case "between": {
      const tuple = Array.isArray(value) ? value : [];
      return { gte: tuple[0], lte: tuple[1] };
    }
    case "nbetween": {
      const tuple = Array.isArray(value) ? value : [];
      const a = tuple[0];
      const b = tuple[1];
      return { OR: [{ lt: a }, { gt: b }] };
    }
    case "null":
      return { equals: null };
    case "nnull":
      return { not: null };
    default:
      return { equals: value };
  }
};
