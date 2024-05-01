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

function rebalance<T>(ts: Thing<T>[]) {
  const n = ts.length;
  const zip = <T, U>(as: T[], bs: U[]): [T, U][] =>
    as.map((a, i) => [a, bs[i]]);
  return zip(ts, LR.defaultRanks(n)).map(([t, rank]) => ({
    data: t.data,
    order: rank,
  }));
}

/**
 * Insert a value at index i, making it a thing with an order.
 */
function insertValue<T>(value: T, ts: Thing<T>[], i: number): Thing<T>[] {
  function _insertValue(value: T, ts: Thing<T>[], i: number): Thing<T>[] {
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

    const sorted = sortByOrder(ts);

    if (i === 0) {
      const rank = LR.insert("", sorted[0].order).rank;
      return [{ data: value, order: rank }, ...ts];
    }
    if (i === n) {
      // Append to array
      const rank = LR.insert(sorted[n - 1].order, "").rank;
      return [...ts, { data: value, order: rank }];
    }

    // Insert value between two existing things.
    const rank = LR.insert(sorted[i - 1].order, sorted[i].order).rank;
    return [...ts.slice(0, i), { data: value, order: rank }, ...ts.slice(i)];
  }

  const things = _insertValue(value, ts, i);
  const hasCollisions = <T>(ts: T[]) => new Set(ts).size < ts.length;
  if (!hasCollisions(things)) {
    return things;
  }

  const rebalancedThings = rebalance(things);
  if (hasCollisions(rebalancedThings)) {
    throw new Error("This is so unlikely to happen, it must be a bug.");
  }
  return rebalancedThings;
}

{
  // Example: Inserting things
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

  // console.log(sortByOrder(l5)); // [ B, C, A, E, D ]
}

{
  // Example: Rebalancing to avoid collisions
  const dummyValue = "";
  const asThing = (order: string) => ({ data: dummyValue, order: order });
  const f: Thing<string> = asThing("aab");
  const g: Thing<string> = asThing("aac");
  const h: Thing<string> = asThing("aac");
  const i: Thing<string> = asThing("y");
  const j: Thing<string> = asThing("z");

  const unbalanced = [f, g, h, i, j];
  console.log(unbalanced);
  console.log(rebalance(unbalanced));
}
