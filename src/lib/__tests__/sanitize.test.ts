import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "../sanitize";

describe("sanitizeHtml", () => {
  it("should allow safe HTML tags", () => {
    const input = "<p>Hello <strong>World</strong></p>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
  });

  it("should remove script tags", () => {
    const input = '<script>alert("XSS")</script><p>Safe content</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script>");
    expect(result).toContain("Safe content");
  });

  it("should remove onclick handlers", () => {
    const input = '<a href="#" onclick="alert()">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onclick");
  });

  it("should allow safe link attributes", () => {
    const input = '<a href="https://example.com" target="_blank">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).toContain('href="https://example.com"');
  });
});
