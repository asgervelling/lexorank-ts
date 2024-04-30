/**
 * Lexorank is what Jira uses to order list items without
 * having to update more than one database record:
 * https://medium.com/whisperarts/lexorank-what-are-they-and-how-to-use-them-for-efficient-list-sorting-a48fc4e7849f
 *
 * Lexorank implementation taken from here:
 * https://github.com/acadea/lexorank/blob/master/Lexorank.js
 */
export type Rank = {
  rank: string;
  ok: boolean;
};

const MIN_CHAR = byte("0");
const MAX_CHAR = byte("z");

export function insert(prev: string, next: string): Rank {
  let [_prev, _next] = [prev, next];
  if (_prev === "") {
    _prev = string(MIN_CHAR);
  }
  if (_next === "") {
    _next = string(MAX_CHAR);
  }

  let rank = "";
  let i = 0;

  while (true) {
    let prevChar: number = getChar(_prev, i, MIN_CHAR);
    let nextChar: number = getChar(_next, i, MAX_CHAR);

    if (prevChar === nextChar) {
      rank += string(prevChar);
      i++;
      continue;
    }

    let midChar = mid(prevChar, nextChar);
    if (midChar === prevChar || midChar === nextChar) {
      rank += string(prevChar);
      i++;
      continue;
    }

    rank += string(midChar);
    break;
  }

  if (rank >= _next) {
    return {
      rank: _prev,
      ok: false,
    };
  } else {
    return {
      rank: rank,
      ok: true,
    };
  }
}

function mid(prev: number, next: number): number {
  return Math.floor((prev + next) / 2);
}

function getChar(s: string, i: number, defaultChar: number): number {
  if (i >= s.length) {
    return defaultChar;
  } else {
    return byte(s.charAt(i));
  }
}

export function byte(char: string): number {
  return char.charCodeAt(0);
}

function string(byte: number): string {
  return String.fromCharCode(byte);
}

console.log(insert("c", "d"))
console.log(insert("cU", "cU"))
console.log(insert("cU", "cV"))
console.log(insert("bbb", "a"))


/*
Given the list ["A", "B", "C"],
place a new element "D" at index 2.
Then move the last element, "C", to index 1.
Then move "D" to index 0.
Should be:

["A", "B", "C"]
["A", "B", "D", "C"]
["A", "C", "B", "D"]
["D", "A", "C", "B"]
*/

// Example ordered data type
type Thing = {
  data: string;
  order: Rank;
}

/**
 * Insert t into ts at position i.
 */
function insertThing(t: Thing, ts: Thing[], i: number) {
  const n = ts.length;
  if (n === 0) {
    return [t];
  }
  if (i < 0 || i > n - 1) {
    throw new Error("Out of bounds");
  }

  const strings = ts.map((t) => t.data);
  const inserted = [strings.slice(0, i)]
  
}