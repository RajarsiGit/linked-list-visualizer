// Synthetic "memory addresses" for visual flavor only - not real addresses,
// don't need to be unique across remounts or across features.
export function createAddressCounter(start) {
  let counter = start;
  return function nextAddress() {
    counter += 8;
    return "0x" + counter.toString(16).padStart(4, "0");
  };
}
