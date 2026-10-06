import { getActiveNavIndex, getDynamicNavItems, matchesNavRoute, ROUTE_NAV_MAP } from "./navConfig";

describe("route navigation", () => {
  it.each(["/hrd", "/hrd/about/director", "/hrd/news/article-slug"])(
    "uses the HRD menu for %s", (pathname) => {
      expect(getDynamicNavItems(pathname)).toBe(ROUTE_NAV_MAP["/hrd"]);
    },
  );

  it("matches complete route segments and preserves other sections", () => {
    expect(matchesNavRoute("/hrd-other", "/hrd")).toBe(false);
    expect(getDynamicNavItems("/mcsgs/fts")).toBe(ROUTE_NAV_MAP["/mcsgs"]);
    expect(getDynamicNavItems("/")).toBe(ROUTE_NAV_MAP["/"]);
    expect(getDynamicNavItems("/fts")).toBe(ROUTE_NAV_MAP["/"]);
    expect(getDynamicNavItems("/hrd-other")).not.toBe(ROUTE_NAV_MAP["/hrd"]);
  });

  it("selects specific items rather than the section home link", () => {
    const items = ROUTE_NAV_MAP["/hrd"];
    expect(getActiveNavIndex("/hrd", items)).toBe(0);
    expect(getActiveNavIndex("/hrd/about/director", items)).toBe(1);
    expect(getActiveNavIndex("/hrd/documents", items)).toBe(2);
    expect(getActiveNavIndex("/hrd/news/article-slug", items)).toBe(3);
    expect(getActiveNavIndex("/unrelated", items)).toBe(-1);
  });
});
