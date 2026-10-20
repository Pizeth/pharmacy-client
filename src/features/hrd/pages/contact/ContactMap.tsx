/// <reference types="google.maps" />
"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import type { PublicDocumentsAddress } from "../../types/publicDocuments.types";
import { toGoogleMapsUrl } from "../../utils/contactLinks";
import * as S from "./HrdContactPage.styles";

const mapTitle = "ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស";
let libraries: Promise<[google.maps.MapsLibrary, google.maps.MarkerLibrary]> | undefined;

function loadLibraries(apiKey: string) {
  if (!libraries) {
    setOptions({ key: apiKey, v: "weekly" });
    libraries = Promise.all([
      importLibrary("maps") as Promise<google.maps.MapsLibrary>,
      importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
    ]);
  }
  return libraries;
}

export interface ContactMapProps {
  readonly address: PublicDocumentsAddress;
  readonly name: string;
  readonly apiKey?: string;
  readonly mapId?: string;
}

function EmbeddedMap({ address }: Pick<ContactMapProps, "address">) {
  return <S.Map title={mapTitle}
    src={`https://www.google.com/maps?q=${encodeURIComponent(address.text)}&output=embed`}
    loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />;
}

/** A real geographic marker, rather than a fixed overlay over an iframe. */
function BrandedGoogleMap({ address, name, apiKey, mapId }: ContactMapProps & { apiKey: string }) {
  const canvas = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const coordinates = address.coordinates;
    if (!element || !coordinates) return;
    let disposed = false;
    let release: (() => void) | undefined;
    const initialize = async () => {
      try {
        const [{ Map, InfoWindow }, { AdvancedMarkerElement }] = await loadLibraries(apiKey);
        if (disposed) return;
        const position = { lat: coordinates.latitude, lng: coordinates.longitude };
        const map = new Map(element, {
          center: position, zoom: 17, mapId: mapId || "DEMO_MAP_ID",
          gestureHandling: "cooperative", streetViewControl: true, mapTypeControl: false,
        });
        const image = document.createElement("img");
        image.src = "/static/svg/hrd-map-marker.svg";
        image.alt = "";
        image.width = 48;
        image.height = 63;
        image.dataset.hrdMapMarker = "true";
        const marker = new AdvancedMarkerElement({
          map, position, title: name, anchorLeft: "-50%", anchorTop: "-100%",
        });
        marker.append(image);
        const details = document.createElement("div");
        const heading = document.createElement("strong");
        heading.textContent = name;
        const location = document.createElement("p");
        location.textContent = address.street || address.text;
        const directions = document.createElement("a");
        directions.textContent = "បើកក្នុង Google Maps";
        directions.href = toGoogleMapsUrl(address);
        directions.target = "_blank";
        directions.rel = "noopener noreferrer";
        details.append(heading, location, directions);
        const info = new InfoWindow({ content: details });
        const click = marker.addListener("click", () => info.open({ map, anchor: marker }));
        release = () => {
          click.remove();
          info.close();
          marker.map = null;
          google.maps.event.clearInstanceListeners(map);
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    };
    // Load Google only when the visitor approaches this section.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        void initialize();
      }
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); release?.(); };
  }, [address, name, apiKey, mapId]);

  if (failed) return <EmbeddedMap address={address} />;
  return <S.MapCanvas ref={canvas} title={mapTitle} aria-label={mapTitle} />;
}

export function ContactMap({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  ...props
}: ContactMapProps) {
  if (!apiKey || !props.address.coordinates) return <EmbeddedMap address={props.address} />;
  return <BrandedGoogleMap {...props} apiKey={apiKey} mapId={mapId} />;
}
