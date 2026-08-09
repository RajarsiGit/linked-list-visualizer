export const ALGO_INFO = {
  bubble: { label: "bubble_sort", complexity: "O(n²) time · O(1) space" },
  insertion: { label: "insertion_sort", complexity: "O(n²) time · O(1) space" },
  merge: { label: "merge_sort", complexity: "O(n log n) time · O(n) space" },
  quick: { label: "quick_sort", complexity: "O(n log n) avg time · O(log n) space" },
};

function* bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: "compare", indices: [j, j + 1] };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: "swap", indices: [j, j + 1] };
        swapped = true;
      }
    }
    yield { type: "sorted", index: n - i - 1 };
    if (!swapped) break;
  }
  for (let i = 0; i < n; i++) yield { type: "sorted", index: i };
}

function* insertionSort(arr) {
  const n = arr.length;
  yield { type: "sorted", index: 0 };
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { type: "compare", indices: [j - 1, j] };
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        yield { type: "swap", indices: [j - 1, j] };
        j--;
      } else {
        break;
      }
    }
    yield { type: "sorted", index: i };
  }
}

function* mergeSortRange(arr, lo, hi) {
  if (hi - lo <= 1) return;
  const mid = Math.floor((lo + hi) / 2);
  yield* mergeSortRange(arr, lo, mid);
  yield* mergeSortRange(arr, mid, hi);

  const left = arr.slice(lo, mid);
  const right = arr.slice(mid, hi);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    yield { type: "compare", indices: [lo + i, mid + j] };
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      yield { type: "overwrite", index: k, value: left[i] };
      i++;
    } else {
      arr[k] = right[j];
      yield { type: "overwrite", index: k, value: right[j] };
      j++;
    }
    k++;
  }
  while (i < left.length) {
    arr[k] = left[i];
    yield { type: "overwrite", index: k, value: left[i] };
    i++;
    k++;
  }
  while (j < right.length) {
    arr[k] = right[j];
    yield { type: "overwrite", index: k, value: right[j] };
    j++;
    k++;
  }
}

function* mergeSort(arr) {
  yield* mergeSortRange(arr, 0, arr.length);
  for (let i = 0; i < arr.length; i++) yield { type: "sorted", index: i };
}

function* quickSortRange(arr, lo, hi) {
  if (lo > hi) return;
  if (lo === hi) {
    yield { type: "sorted", index: lo };
    return;
  }
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    yield { type: "compare", indices: [j, hi] };
    if (arr[j] < pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { type: "swap", indices: [i, j] };
      }
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  yield { type: "swap", indices: [i + 1, hi] };
  yield { type: "sorted", index: i + 1 };
  yield* quickSortRange(arr, lo, i);
  yield* quickSortRange(arr, i + 2, hi);
}

function* quickSort(arr) {
  yield* quickSortRange(arr, 0, arr.length - 1);
}

export const ALGO_FNS = {
  bubble: bubbleSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
