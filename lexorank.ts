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

export type InsertFunction = (prev: string, next: string) => Rank;

export function createInsertionFunction(
  minChar: number,
  maxChar: number
): InsertFunction {
  return (prev: string, next: string) => insert(prev, next, minChar, maxChar);
}

function insert(
  prev: string,
  next: string,
  minChar: number,
  maxChar: number
): Rank {
  let [_prev, _next] = [prev, next];
  if (_prev === "") {
    _prev = string(minChar);
  }
  if (_next === "") {
    _next = string(maxChar);
  }

  let rank = "";
  let i = 0;

  while (true) {
    let prevChar: number = getChar(_prev, i, minChar);
    let nextChar: number = getChar(_next, i, maxChar);

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
