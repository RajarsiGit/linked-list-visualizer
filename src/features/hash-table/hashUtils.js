export const BUCKET_COUNT = 8;

export function hashKey(key, bucketCount = BUCKET_COUNT) {
  const str = String(key);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % bucketCount;
}

export function bucketize(entries, bucketCount = BUCKET_COUNT) {
  const buckets = Array.from({ length: bucketCount }, () => []);
  for (const entry of entries) {
    buckets[hashKey(entry.key, bucketCount)].push(entry);
  }
  return buckets;
}
