import { describe, it, expect } from "@jest/globals";
import { stripHtml } from "../contentUtils";

describe("stripHtml", () => {
  it("should return an empty string for null or undefined input", () => {
    expect(stripHtml(null)).toBe("");
    expect(stripHtml(undefined)).toBe("");
  });

  it("should return an empty string for an empty string input", () => {
    expect(stripHtml("")).toBe("");
  });

  it("should strip HTML tags and retain text content", () => {
    const html = "<div>Hello, <strong>world</strong>!</div>";
    const expected = "Hello, world!";
    expect(stripHtml(html)).toBe(expected);
  });

  it("should replace <br> tags with newlines", () => {
    const html = "Hello<br>world<br>!";
    const expected = "Hello\nworld\n!";
    expect(stripHtml(html)).toBe(expected);
  });

  it("should collapse consecutive spaces and tabs", () => {
    const html = "<div>Hello,     world! \t</div>";
    const expected = "Hello, world!";
    expect(stripHtml(html)).toBe(expected);
  });
});
