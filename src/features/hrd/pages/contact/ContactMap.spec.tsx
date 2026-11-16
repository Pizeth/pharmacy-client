import { act, render, screen, waitFor } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { ContactMap } from "./ContactMap";
import { HRD_SITE } from "../../data/siteInfo";

jest.mock("@googlemaps/js-api-loader", () => ({ importLibrary: jest.fn(), setOptions: jest.fn() }));
const theme = createTheme({ cssVariables: true });
const address = HRD_SITE.contact.address!;
const name = HRD_SITE.name;

it("keeps the existing embedded Google map when no API key is configured", () => {
  render(<ThemeProvider theme={theme}><ContactMap address={address} name={name} apiKey="" /></ThemeProvider>);
  expect(screen.getByTitle("ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស")).toHaveAttribute("src", expect.stringContaining("output=embed"));
  expect(importLibrary).not.toHaveBeenCalled();
});

it("loads on visibility, anchors the branded marker at the office, and cleans up", async () => {
  const originalObserver = globalThis.IntersectionObserver;
  const originalGoogle = globalThis.google;
  let intersect: IntersectionObserverCallback = () => {};
  const disconnect = jest.fn();
  globalThis.IntersectionObserver = jest.fn(callback => {
    intersect = callback;
    return { observe: jest.fn(), disconnect, unobserve: jest.fn() };
  }) as unknown as typeof IntersectionObserver;
  const clear = jest.fn();
  globalThis.google = { maps: { event: { clearInstanceListeners: clear } } } as unknown as typeof google;
  const map = {};
  const Map = jest.fn(() => map);
  const remove = jest.fn();
  const marker = Object.assign(document.createElement("div"), { map, addListener: jest.fn(() => ({ remove })) });
  const AdvancedMarkerElement = jest.fn(() => marker);
  const close = jest.fn();
  const InfoWindow = jest.fn(() => ({ open: jest.fn(), close }));
  jest.mocked(importLibrary).mockImplementation(library => Promise.resolve(
    library === "maps" ? { Map, InfoWindow } : { AdvancedMarkerElement },
  ) as unknown as ReturnType<typeof importLibrary>);
  try {
    const view = render(<ThemeProvider theme={theme}><ContactMap address={address} name={name} apiKey="test-key" mapId="test-map" /></ThemeProvider>);
    expect(importLibrary).not.toHaveBeenCalled();
    act(() => intersect([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    await waitFor(() => expect(AdvancedMarkerElement).toHaveBeenCalled());
    expect(setOptions).toHaveBeenCalledWith({ key: "test-key", v: "weekly" });
    expect(Map).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ mapId: "test-map", center: { lat: 11.5478875, lng: 104.8623906 } }));
    expect(marker.querySelector("img")).toHaveAttribute("src", "/static/svg/hrd-map-marker.svg");
    view.unmount();
    expect(remove).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
    expect(marker.map).toBeNull();
    expect(clear).toHaveBeenCalledWith(map);
  } finally {
    globalThis.IntersectionObserver = originalObserver;
    globalThis.google = originalGoogle;
  }
});
