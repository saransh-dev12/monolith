/** Fetch bounded pages until all rows are returned; callers must supply a stable unique order. */
export async function fetchAll<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  context: string,
): Promise<T[]> {
  const pageSize = 500;
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await fetchPage(from, from + pageSize - 1);
    if (error) throw new Error(`${context}: ${error.message}`);
    if (!data) throw new Error(`${context}: no data returned`);
    rows.push(...data);
    if (data.length < pageSize) return rows;
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
