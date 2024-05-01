import * as LR from "./lexorank";

// Example ordered data type
type Thing<T> = {
  data: T;
  order: string;
};

const defaultOrder = LR.string(LR.mid(LR.MIN_CHAR, LR.MAX_CHAR));

function sortByOrder<T>(ts: Thing<T>[]) {
  return [...ts].sort((a, b) => {
    const [_a, _b] = [a.order, b.order];
    if (a < b) return -1;
    else if (a === b) return 0;
    else return 1;
  });
}

/**
 * Insert a value at index i, making it a thing with an order.
 */
function insertValue<T>(value: T, ts: Thing<T>[], i: number): Thing<T>[] {
  const n = ts.length;
  if (i < 0 || i > n) {
    throw new Error("Out of bounds");
  }
  if (n === 0) {
    return [
      {
        data: value,
        order: defaultOrder, // right in the center
      },
    ];
  }

  // The beautiful thing is that this sorting can happen
  // on the frontend, rather than in the database.
  // Naive reordering of elements in a database would have O(n) DB calls,
  // n being the number of elements that have a new list index.
  // Here, it is O(1) - although it has a higher amortized running time,
  // since theoretically we do need to rebalance the ranks at some point
  const sorted = sortByOrder(ts);

  // Find which two things to insert value between.
  // If inserting at the beginning or end of the array
  if (i === 0) {
    // Prepend to array with an order halfway between
    // MIN_CHAR and sorted[0].order, lexicographically.
    // For "a" and "c", it would be "b", and
    // for "a" and "b", it would be "am".
    // However, for "a" and "a" it will not be possible.
    // That is the case, where we need to rebalance all the ranks.
    const rank = LR.insert("", sorted[0].order).rank;
    return [{ data: value, order: rank }, ...ts];
  }
  if (i === n) {
    // Append to array
    const rank = LR.insert(sorted[n - 1].order, "").rank;
    return [...ts, { data: value, order: rank }];
  }

  // Insert value between two existing things.
  // Guarantee: i > 0 && i <= n - 1
  const rank = LR.insert(sorted[i - 1].order, sorted[i].order).rank;
  return [...ts.slice(0, i), { data: value, order: rank }, ...ts.slice(i)];
}

// So far, the implementation does not take into account when a thing cannot be inserted
// between two other things. We'll get there soon enough
const a = "A"; // A at index 0. L1: [ A ]
const b = "B"; // B at index 0. L2: [ B, A ]
const c = "C"; // C at index 1. L3: [ B, C, A ]
const d = "D"; // D at index 3. L4: [ B, C, A, D ]
const e = "E"; // E at index 3. L5: [ B, C, A, E, D ]

const l0: Thing<string>[] = [];
const l1 = insertValue(a, l0, 0);
const l2 = insertValue(b, l1, 0);
const l3 = insertValue(c, l2, 1);
const l4 = insertValue(d, l3, 3);
const l5 = insertValue(e, l4, 3);

console.log(sortByOrder(l5)); // [ B, C, A, E, D ]
