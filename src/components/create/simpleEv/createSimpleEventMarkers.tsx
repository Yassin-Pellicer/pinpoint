import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEvent } from "../../../utils/context/ContextEvent";
import { useMapContext } from "../../../utils/context/ContextMap";
import { useEffect } from "react";

const PlaceCP = () => {
  const map = useMap();

  const {
    event,
    setMarker,
  } = useEvent();

  const { setLocation, setZoom } = useMapContext();

  useEffect(() => {
    if (event.marker != null) {
      map.flyTo(
        event.marker.position,
        18,
        { animate: true, duration: 0.5 }
      );
      map.setView(event.marker.position, 18);
    }
  }, [event.marker, map]);

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
