/** Prisma `meta`: chỉ một trong hai — `select` hoặc `include` (không dùng đồng thời). */
export type PrismaIncludeSelectMeta = {
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
};

/**
 * Trả về tối đa một trong `select` / `include`.
 * Nếu cả hai đều có (lỗi cấu hình), ưu tiên `select` giống hạn chế Prisma.
 */
export function resolvePrismaIncludeSelect(meta?: PrismaIncludeSelectMeta): {
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
} {
  const hasSelect = meta?.select != null && Object.keys(meta.select).length > 0;
  const hasInclude =
    meta?.include != null && Object.keys(meta.include).length > 0;

  if (hasSelect && meta?.select) {
    return { select: meta.select };
  }
  if (hasInclude && meta?.include) {
    return { include: meta.include };
  }
  return {};
}
