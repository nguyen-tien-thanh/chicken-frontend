/**
 * Shapes compatible with @nestjsx/crud-request joins (Refine `meta.join`).
 * Prisma uses `include` with nested `include` / `select` instead of SQL joins.
 */
export type PrismaQueryJoin = {
  field: string;
  select?: string[];
};

export type PrismaQueryJoinArr = [string, string[]?];

export type JoinInput =
  | PrismaQueryJoin
  | PrismaQueryJoinArr
  | Array<PrismaQueryJoin | PrismaQueryJoinArr>;

const normalizeJoinItem = (
  item: PrismaQueryJoin | PrismaQueryJoinArr
): PrismaQueryJoin => {
  if (Array.isArray(item)) {
    return { field: item[0], select: item[1] };
  }
  return item;
};

const flattenJoinList = (join: JoinInput): PrismaQueryJoin[] => {
  if (Array.isArray(join)) {
    if (
      join.length === 2 &&
      typeof join[0] === "string" &&
      (join[1] === undefined || Array.isArray(join[1]))
    ) {
      return [normalizeJoinItem(join as PrismaQueryJoinArr)];
    }
    return (join as Array<PrismaQueryJoin | PrismaQueryJoinArr>).map(
      normalizeJoinItem
    );
  }
  return [normalizeJoinItem(join)];
};

const setNestedInclude = (
  target: Record<string, unknown>,
  path: string[],
  leaf: true | { select: Record<string, true> }
): void => {
  const [head, ...rest] = path;
  if (!head) return;

  if (rest.length === 0) {
    if (leaf === true) {
      target[head] = true;
    } else {
      target[head] = { select: leaf.select };
    }
    return;
  }

  const existing = target[head];
  let branch: Record<string, unknown>;

  if (
    existing &&
    typeof existing === "object" &&
    !Array.isArray(existing) &&
    "include" in existing
  ) {
    branch = (existing as { include: Record<string, unknown> }).include;
  } else {
    branch = {};
    target[head] = { include: branch };
  }

  setNestedInclude(branch, rest, leaf);
};

/** Nestjsx-style joins → Prisma `include` tree. */
export const joinToPrismaInclude = (
  join?: JoinInput
): Record<string, unknown> | undefined => {
  if (join == null) return undefined;

  const root: Record<string, unknown> = {};

  for (const item of flattenJoinList(join)) {
    const segments = item.field.split(".").filter(Boolean);
    if (segments.length === 0) continue;

    const leaf =
      item.select && item.select.length > 0
        ? {
            select: Object.fromEntries(
              item.select.map((f) => [f, true])
            ) as Record<string, true>,
          }
        : true;

    setNestedInclude(root, segments, leaf);
  }

  return Object.keys(root).length > 0 ? root : undefined;
};
