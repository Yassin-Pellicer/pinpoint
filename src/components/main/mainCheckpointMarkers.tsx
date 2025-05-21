import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { Checkpoint } from "../../utils/classes/Checkpoint";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useMapContext } from "../../utils/context/ContextMap";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const Quill = dynamic(() => import("react-quill"), { ssr: false });
import fileURL from "../../utils/funcs/createUrlImage";
import { useEvent } from "../../utils/context/ContextEvent";
import { getCheckpointsHook } from "../../hooks/main/get/getCheckpointsHook";
import { getRatingHook } from "../../hooks/main/get/getRatingHook";
import { usePathname } from "next/navigation";
import { getCheckpointByCode } from "../../hooks/main/get/getCheckpointByCodeHook";

const cpView = () => {
  const map = useMap();
  const {
    checkpoints,
    setCheckpoints,
    focusedCheckpoint,
    setFocusedCheckpoint,
  } = useCheckpoints();
  const [count, setCount] = useState(0);
  const { location, setLocation, zoom, setZoom, originalLocation } =
    useMapContext();
  const { event, setEvent, setMarker } = useEvent();
  const { selectedEvent } = useMapContext();
  const pathname = usePathname();
  const { checkpointCode } = useParams();

  const t = useTranslations("CpInfo");

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

  useEffect(() => {
    if (focusedCheckpoint && map) {
      map.flyTo(
        [
          focusedCheckpoint.marker.position[0] + 0.0007,
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

  useEffect(() => {
    console.log("AOKISMDOIASDIAMSDIMASD");
    getCheckpointsHook(selectedEvent?.id).then((res) => {
      console.log(res);
      if (res) setCheckpoints(res.checkpoints);
    });
    getRatingHook(selectedEvent?.id).then((res) => {});
  }, [selectedEvent]);

  map.on("dragend", () => {
    const center = map.getCenter();
    const { lat, lng } = center;
    setLocation([lat, lng]);
  });

  map.on("zoomend", () => {
    const zoom = map.getZoom();
    setZoom(zoom);
  });

  return (
    <>
      {selectedEvent &&
        Array.isArray(checkpoints) &&
        checkpoints.map((cp, index) => (
          <Marker
            key={cp.id || `checkpoint-${index}`}
            position={cp.marker.position}
            icon={createCustomIcon(cp.order)}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup offset={[10, -30]} className="custom-popup" maxWidth={300}>
              <div className="flex flex-col w-[275px]">
                {cp.banner ? (
                  <img
                    src={cp.banner}
                    className="w-full h-15 rounded-t-xl object-cover "
                    alt="banner"
                  />
                ) : (
                  <></>
                )}
                <div className="flex flex-col px-2 pb-2 pt-2">
                  <h1 className="tracking-tighter text-lg leading-none text-white font-bold">
                    {cp.name}
                  </h1>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2 mt-2 text-white">
                      <i className="material-icons">qr_code</i>
                      <i className="material-icons">tour</i>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default cpView;
