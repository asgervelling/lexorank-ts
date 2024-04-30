import { describe, it, expect } from "@jest/globals";

import { insert } from "./lexorank";

describe("Rank", () => {
  it("Test success empty prev empty next", async () => {
    let { rank, ok } = insert("", "");
    expect(rank).toStrictEqual("U");
    expect(ok).toStrictEqual(true);
  });

  it("Test success empty prev", async () => {
    let { rank, ok } = insert("", "2");
    expect(rank).toStrictEqual("1");
    expect(ok).toStrictEqual(true);
  });

  it("Test success empty next", async () => {
    let { rank, ok } = insert("x", "");
    expect(rank).toStrictEqual("y");
    expect(ok).toStrictEqual(true);
  });

  it("Test success new digit", async () => {
    let { rank, ok } = insert("aaaa", "aaab");
    expect(rank).toStrictEqual("aaaaU");
    expect(ok).toStrictEqual(true);
  });

  it("Test success mid value", async () => {
    let { rank, ok } = insert("aaaa", "aaac");
    expect(rank).toStrictEqual("aaab");
    expect(ok).toStrictEqual(true);
  });

  it("Test success new digit mid value", async () => {
    let { rank, ok } = insert("az", "b");
    expect(rank).toStrictEqual("azU");
    expect(ok).toStrictEqual(true);
  });

  it("Test fail same prev next", async () => {
    let { rank, ok } = insert("aaaa", "aaaa");
    expect(rank).toStrictEqual("aaaa");
    expect(ok).toStrictEqual(false);
  });

  it("Test fail adjacent", async () => {
    let { rank, ok } = insert("a", "a0");
    expect(rank).toStrictEqual("a");
    expect(ok).toStrictEqual(false);
  });
});
