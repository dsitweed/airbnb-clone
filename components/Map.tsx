'use client';

import L, { LatLngTuple } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

const iconUrl = (url: string | { src: string }) =>
  typeof url === 'string' ? url : url.src;

L.Icon.Default.mergeOptions({
  iconUrl: iconUrl(markerIcon),
  iconRetinaUrl: iconUrl(markerIcon2x),
  shadowUrl: iconUrl(markerShadow),
});

interface MapProps {
  center?: LatLngTuple;
}

const DEFAULT_POSITION: LatLngTuple = [52, -0.09];

function ChangeView({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

function LocationMarker() {
  const [position, setPosition] = useState<LatLngTuple | null>(null);

  const map = useMapEvents({
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationerror(e) {
      console.error(e.message);
    },
  });

  useEffect(() => {
    map.locate({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 60000,
    });
  }, [map]);

  return position ? <Marker position={position} /> : null;
}

export default function Map({ center }: MapProps) {
  const position = center ?? DEFAULT_POSITION;
  const zoom = center ? 4 : 2;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full rounded-lg"
    >
      <ChangeView center={position} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center ? <Marker position={position} /> : <LocationMarker />}
    </MapContainer>
  );
}
