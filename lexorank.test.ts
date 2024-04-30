import { describe, it, expect } from "@jest/globals";

import { insert } from "./lexorank";

describe("Lexorank Calculation", () => {
  it("Middle of 'a' and 'c' is 'b'", () => {
    const { rank, ok } = insert("a", "c");
    expect(rank).toStrictEqual("b");
    expect(ok).toStrictEqual(true);
  });

  it("Middle of 'a' and 'z' is 'm'", () => {
    const { rank, ok } = insert("a", "z");
    expect(rank).toStrictEqual("m");
    expect(ok).toStrictEqual(true);
  });

  it("Middle of 'a' and 'b' is 'am'", () => {
    const { rank, ok } = insert("a", "b");
    expect(rank).toStrictEqual("am");
    expect(ok).toStrictEqual(true);
  });

  it("Middle of 'x' and 'z' is 'y'", () => {
    const { rank, ok } = insert("x", "z");
    expect(rank).toStrictEqual("y");
    expect(ok).toStrictEqual(true);
  });

  it("Middle of 'aaaa' and 'aaab' is aaaam", () => {
    const { rank, ok } = insert("aaaa", "aaab");
    expect(rank).toStrictEqual("aaaam");
    expect(ok).toStrictEqual(true);
  });

  it("Middle of 'aaaa' and 'aaac' is aaaab", () => {
    const { rank, ok } = insert("aaaa", "aaac");
    expect(rank).toStrictEqual("aaab");
    expect(ok).toStrictEqual(true);
  });

  it("Middle of 'az' and 'b' is azm", () => {
    const { rank, ok } = insert("az", "b");
    expect(rank).toStrictEqual("azm");
    expect(ok).toStrictEqual(true);
  });

  it("Cannot insert between 'aaaa' and 'aaaa'", () => {
    const { rank, ok } = insert("aaaa", "aaaa");
    expect(rank).toStrictEqual("aaaa");
    expect(ok).toStrictEqual(false);
  });

  it("Cannot insert between 'f' and 'fa'", () => {
    const { rank, ok } = insert("f", "fa");
    expect(rank).toStrictEqual("f");
    expect(ok).toStrictEqual(false);
  });

  it("Should default to a and z", () => {
    expect(insert("", "")).toStrictEqual(insert("a", "z"));
  });
});
