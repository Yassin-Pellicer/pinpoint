import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useEvent } from "../../../utils/context/eventContext";
import { useTranslations } from "next-intl";
import { useMapContext } from "../../../utils/context/mapContext";

const PlaceCP = () => {
  const map = useMap();

  const t = useTranslations("SimplePopup");
  const tagsTrans = useTranslations("Tags");

  const {
    event,
    setEvent,
    name,
    setName,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    marker,
    setMarker,
    banner,
    setBanner,
    tags,
    setTags,
  } = useEvent();

  const { location, setLocation, zoom, setZoom, originalLocation } = useMapContext();

  const createCustomIcon = (number: string) =>
    L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          position: relative;
          width: 50px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/svg/pin.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          font-size: 14px;
          font-weight: bold;
          color: black;
        ">
      `,
      iconSize: [50, 62],
      iconAnchor: [25, 42],
    });
  
  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  useMapEvents({
    dblclick: (e) => {
      map.closePopup();
      const { lat, lng } = e.latlng;
      const newMarker = { position: [lat, lng], draggable: true };
      setMarker(newMarker);
      setLocation([lat + 0.0010, lng]);
      map.flyTo(
        [
          lat + 0.0010,
          lng
        ],
        18,
        { animate: true, duration: 0.5 }
      );
      const zoom = map.getZoom();
      setZoom(zoom);
    },
  });

  map.on('dragend', () => {
    const center = map.getCenter();
    const { lat, lng } = center;
    setLocation([lat, lng]);
  });

  map.on('zoomend', () => {
    const zoom = map.getZoom();
    setZoom(zoom);
  });

  const handleMarkerDragEnd = (e : L.DragEndEvent) => {
    map.closePopup();
    let location = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    const newMarker = { position: location, draggable: true };
    setMarker(newMarker);
  };

  return (
    <>
      {event.marker != null && (
        <Marker
          position={event.marker.position}
          icon={createCustomIcon(event.name)}
          draggable={true}
          eventHandlers={{
            dragend: (e) => handleMarkerDragEnd(e),
          }}
        >
        </Marker>
      )}
    </>
  );
}

export default PlaceCP;
