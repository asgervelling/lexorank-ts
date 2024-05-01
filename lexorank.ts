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

export const MIN_CHAR = byte("0");
export const MAX_CHAR = byte("z");

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

export function mid(prev: number, next: number): number {
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

export function string(byte: number): string {
  return String.fromCharCode(byte);
}

