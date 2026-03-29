import type { Pagination } from "@refinedev/core";

/** Refine server pagination → Prisma `skip` / `take`. */
export const paginationToPrismaSkipTake = (
  pagination?: Pagination
): { skip?: number; take?: number } => {
  const { currentPage = 1, pageSize = 10, mode = "server" } = pagination ?? {};

  if (mode !== "server") {
    return {};
  }

  return {
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  };
};
