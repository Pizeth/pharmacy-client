import {
  isExternalUrl,
  toGoogleMapsUrl,
  toTelegramUrl,
  toTelUrl,
} from "./contactLinks";

describe("toTelUrl", () => {
  it("strips formatting but keeps the leading plus", () => {
    expect(toTelUrl("+855 97 824 2255")).toBe("tel:+855978242255");
    expect(toTelUrl("(012) 345-678")).toBe("tel:012345678");
  });
});

describe("toTelegramUrl", () => {
  it.each([
    ["https://t.me/some_user", "https://t.me/some_user"],
    ["http://t.me/some_user", "http://t.me/some_user"],
    ["t.me/some_user", "https://t.me/some_user"],
    ["telegram.me/some_user", "https://telegram.me/some_user"],
    ["@some_user", "https://t.me/some_user"],
    ["some_user", "https://t.me/some_user"],
    ["  @some_user  ", "https://t.me/some_user"],
    ["+855 97 824 2255", "https://t.me/+855978242255"],
  ])("resolves %s", (input, expected) => {
    expect(toTelegramUrl(input)).toBe(expected);
  });

  it.each([
    "",
    "   ",
    "ab", // too short for a username
    "1starts_with_digit",
    "has spaces in it",
    "javascript:alert(1)",
    "tg://resolve?domain=x",
    "+12", // too few digits
  ])("rejects %j", (input) => {
    expect(toTelegramUrl(input)).toBeNull();
  });
});

describe("toGoogleMapsUrl", () => {
  it("uses an explicit http(s) map link as written", () => {
    expect(
      toGoogleMapsUrl({
        text: "Somewhere",
        mapUrl: "https://maps.app.goo.gl/abc123",
      }),
    ).toBe("https://maps.app.goo.gl/abc123");
  });

  it("falls back to a Google Maps search of the address text", () => {
    expect(toGoogleMapsUrl({ text: "Office A, 4th floor & room 401" })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Office%20A%2C%204th%20floor%20%26%20room%20401",
    );
  });

  it("ignores a non-http map link and falls back to search", () => {
    expect(
      toGoogleMapsUrl({ text: "Somewhere", mapUrl: "javascript:alert(1)" }),
    ).toBe("https://www.google.com/maps/search/?api=1&query=Somewhere");
  });

  it("treats a blank map link as missing", () => {
    expect(toGoogleMapsUrl({ text: "Somewhere", mapUrl: "   " })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Somewhere",
    );
  });
});

describe("isExternalUrl", () => {
  it("is true only for http(s) links", () => {
    expect(isExternalUrl("https://example.com")).toBe(true);
    expect(isExternalUrl("HTTP://example.com")).toBe(true);
    expect(isExternalUrl("tel:+85512345678")).toBe(false);
    expect(isExternalUrl("mailto:a@b.co")).toBe(false);
  });
});
