import { describe, it, expect } from "@jest/globals";

import * as lexorank from "./lexorank";

const MIN_CHAR = lexorank.byte("0");
const MAX_CHAR = lexorank.byte("z");

const insert: lexorank.InsertFunction =
  lexorank.createInsertionFunction(MIN_CHAR, MAX_CHAR);

describe("Rank", () => {
  it("Test success empty prev empty next", () => {
    let { rank, ok } = insert("", "");
    expect(rank).toStrictEqual("U");
    expect(ok).toStrictEqual(true);
  });

  it("Test success empty prev", () => {
    let { rank, ok } = insert("", "2");
    expect(rank).toStrictEqual("1");
    expect(ok).toStrictEqual(true);
  });

  it("Test success empty next", () => {
    let { rank, ok } = insert("x", "");
    expect(rank).toStrictEqual("y");
    expect(ok).toStrictEqual(true);
  });

  it("Test success new digit", () => {
    let { rank, ok } = insert("aaaa", "aaab");
    expect(rank).toStrictEqual("aaaaU");
    expect(ok).toStrictEqual(true);
  });

  it("Test success mid value", () => {
    let { rank, ok } = insert("aaaa", "aaac");
    expect(rank).toStrictEqual("aaab");
    expect(ok).toStrictEqual(true);
  });

  it("Test success new digit mid value", () => {
    let { rank, ok } = insert("az", "b");
    expect(rank).toStrictEqual("azU");
    expect(ok).toStrictEqual(true);
  });

  it("Test fail same prev next", () => {
    let { rank, ok } = insert("aaaa", "aaaa");
    expect(rank).toStrictEqual("aaaa");
    expect(ok).toStrictEqual(false);
  });

  it("Test fail adjacent", () => {
    let { rank, ok } = insert("a", "a0");
    expect(rank).toStrictEqual("a");
    expect(ok).toStrictEqual(false);
  });
});

describe("Example", () => {
  it("", () => {
    // Start with a "database" with two rows
    // and set their orders to "a", "c" and "z"
    const initialDb = {
      rowA: "a", // Use a longer string for fewer collisions
      rowB: "c",
      rowC: "z",
    };

    // Move row C between row A and row B, without changing
    const db1 = {
      ...initialDb,
      rowC: insert(initialDb["rowA"], initialDb["rowB"]).rank,
    };

    // Row A and row B keep their orders of "a" and "c"
    expect(db1["rowA"]).toStrictEqual("a");
    expect(db1["rowB"]).toStrictEqual("c");

    // Row C gets inserted between A and B
    expect(db1["rowC"]).toStrictEqual("b");

    // Even though the orders "a", "b" and "c" are already taken
    // by rows A, C and B respectively, we can still insert new elements
    // between them
    const db2 = {
      ...db1,
      rowD: insert(db1["rowA"], db1["rowC"]).rank,
    };

    // Rows D is a longer string than "a" or "b".
    // Its order has another letter, which is the letter between '0' and 'z': 'U'
    expect(db2["rowD"]).toStrictEqual("aU");
  });
});
