/** Fetch bounded pages until all rows are returned; callers must supply a stable unique order. */
export async function fetchAll<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null; count: number | null }>,
  context: string,
): Promise<T[]> {
  const pageSize = 500;
  const rows: T[] = [];
  for (;;) {
    const from = rows.length;
    const { data, error, count } = await fetchPage(from, from + pageSize - 1);
    if (error) throw new Error(`${context}: ${error.message}`);
    if (!data || count === null) throw new Error(`${context}: missing page or exact count`);
    rows.push(...data);
    if (rows.length >= count) return rows;
    if (data.length === 0) throw new Error(`${context}: incomplete page`);
  }
}

/** Bound URL size when applying project filters to large accounts. */
export async function fetchByProjectBatches<T>(
  ids: string[],
  fetchBatch: (ids: string[]) => Promise<T[]>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; offset < ids.length; offset += 100) {
    rows.push(...await fetchBatch(ids.slice(offset, offset + 100)));
  }
  return rows;
}
