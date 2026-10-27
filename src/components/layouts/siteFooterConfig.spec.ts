import { getSiteFooterConfig } from "./siteFooterConfig";
import { HRD_SITE } from "@/features/hrd/data/siteInfo";

it("preserves HRD contact details on nested routes", () => {
  expect(getSiteFooterConfig("/hrd/about/director").site).toBe(HRD_SITE);
});

it("uses the super admin contact and real admin destinations", () => {
  const config = getSiteFooterConfig("/admin/i18n/edit/123", { email: "admin@example.com" });
  expect(config.site.contact.email).toBe("admin@example.com");
  expect(config.site.contact.address).toEqual(HRD_SITE.contact.address);
  expect(config.site.contact.hours).toBe(HRD_SITE.contact.hours);
  expect(config.links?.map(link => link.href)).toEqual(["/admin/dashboard", "/admin/social-provider", "/admin/documents", "/admin/i18n"]);
});

it("does not leak department or admin contacts into unrelated routes", () => {
  for (const path of ["/login", "/admin-other", "/hrd-other"]) {
    expect(getSiteFooterConfig(path).site.contact.person).toBeUndefined();
    expect(getSiteFooterConfig(path).site.contact.address).toEqual(HRD_SITE.contact.address);
    expect(getSiteFooterConfig(path).site.contact.phones).toBeUndefined();
  }
});

it("uses the secretariat identity and its navigation links", () => {
  const config = getSiteFooterConfig("/mcsgs/about");
  expect(config.site.name).toBe("អគ្គលេខាធិការដ្ឋាន");
  expect(config.links?.every(link => link.href.startsWith("/mcsgs"))).toBe(true);
});
