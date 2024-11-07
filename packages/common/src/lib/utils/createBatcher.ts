export function createBatcher<K>(batchSize: number) {
  let currentBatch: {
    number: number;
    items: K[];
  } = { number: 1, items: [] };

  const getBatch = () => structuredClone(currentBatch);
  const addToBatch = (item: K) => {
    currentBatch.items.push(item);
    const isFull = currentBatch.items.length === batchSize;

    if (isFull) {
      const batch = getBatch();
      currentBatch = {
        number: batch.number + 1,
        items: [],
      };
      return { isFull, batch };
    }

    return { isFull, batch: currentBatch };
  };

  return { addToBatch, getBatch };
}
