import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Checkpoint } from "../../../utils/classes/Checkpoint";
import { useCheckpoints } from "../../../utils/context/ContextCheckpoint";
import { useMapContext } from "../../../utils/context/ContextMap";
import { useTranslations } from "next-intl";
import { useEvent } from "../../../utils/context/ContextEvent";
import CheckpointInfo from "./createCheckpointInfo";

const PlaceCP = () => {
  const map = useMap();
  const {
    checkpoints,
    setCheckpoints,
    focusedCheckpoint,
    setFocusedCheckpoint,
  } = useCheckpoints();
  const [count, setCount] = useState(0);
  const { setLocation, setZoom } = useMapContext();
  const { event, setMarker } = useEvent();

  const t = useTranslations("CpInfo");

  useEffect(() => {
    if (event.marker != null) {
      map.flyTo(event.marker.position, 18, { animate: true, duration: 0.5 });
      map.setView(event.marker.position, 18);
    }
  }, [event.marker, map]);

  const createCustomIcon = (number: number) =>
    L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          position: relative;
          width: 60px;
          height: 72px;
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
          <div style="margin-bottom: 10px">${number}</div>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [20, 50],
    });

  useMapEvents({
    dblclick: (e) => {
      map.closePopup();
      const { lat, lng } = e.latlng;
      const newMarker = { position: [lat, lng], draggable: true };
      const newCheckpoint = new Checkpoint(
        newMarker,
        count,
        "",
        "",
        checkpoints.length + 1,
        null,
        "New Checkpoint"
      );
      setCount(count + 1);
      setCheckpoints([...checkpoints, newCheckpoint]);
      const zoom = map.getZoom();
      setZoom(zoom);
      if (checkpoints.length === 0) setMarker(newCheckpoint.marker);
    },
  });

  useEffect(() => {
    if (checkpoints.length > 0) {
      const newCheckpoint = checkpoints.find((checkpoint) => checkpoint.order === 1);
      setMarker(newCheckpoint.marker);
    }
  }, [checkpoints])

  map.on("dragend", () => {
    const center = map.getCenter();
    const { lat, lng } = center;
    setLocation([lat, lng]);
  });

  map.on("zoomend", () => {
    const zoom = map.getZoom();
    setZoom(zoom);
  });

  const handleMarkerDragEnd = (index: number, e: L.DragEndEvent) => {
    map.closePopup();
    const newCheckpoints = [...checkpoints];
    newCheckpoints[index].marker.position = [
      e.target.getLatLng().lat,
      e.target.getLatLng().lng,
    ];
    setCheckpoints(newCheckpoints);
  };

  useEffect(() => {
    if (focusedCheckpoint && map) {
      map.flyTo(
        [
          focusedCheckpoint.marker.position[0] + 0.0015,
          focusedCheckpoint.marker.position[1],
        ],
        18,
        { animate: true, duration: 0.5 }
      );
      map.eachLayer((layer) => {
        if (
          layer instanceof L.Marker &&
          layer.getLatLng().equals(focusedCheckpoint.marker.position)
        ) {
          layer.openPopup();
        }
      });
    }
    const zoom = map.getZoom();
    setZoom(zoom);
    setFocusedCheckpoint(null);
  }, [focusedCheckpoint, map]);

  return (
    <>
      {checkpoints.map((cp, index) => (
        <Marker
          key={index}
          position={cp.marker.position}
          icon={createCustomIcon(cp.order)}
          draggable={true}
          eventHandlers={{
            dragend: (e) => handleMarkerDragEnd(index, e),
          }}
        >
          <Popup offset={[10, -40]} className="custom-popup" maxWidth={550}>
            <div className="px-6 w-[500px] rounded-l-xl m-2 p-2 pt-4 pb-6 bg-[#ffffff] h-fit">
              <CheckpointInfo
                key={index}
                id={cp.id}
                index={index}
                closeMap={() => map.closePopup()}
                mode={"edit"}
              />
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default PlaceCP;
