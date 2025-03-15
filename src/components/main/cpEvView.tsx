import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { Checkpoint } from "../../utils/classes/cpClass";
import { useCheckpoints } from "../../utils/context/cpContext"; 
import { useMapContext } from "../../utils/context/mapContext"; 
import { useTranslations } from "next-intl";
import CheckpointInfo from "./cpInfo";

const Quill = dynamic(() => import("react-quill"), { ssr: false });
import fileURL from "../../utils/funcs/createUrlImage";
import { useEvent }  from "../../utils/context/eventContext";
import { getCheckpointsHook } from "../../hooks/main/getCheckpointsHook";

const PlaceCP = () => {
  const map = useMap();
  const { checkpoints, setCheckpoints, focusedCheckpoint, setFocusedCheckpoint } = useCheckpoints();
  const [count, setCount] = useState(0);
  const { location, setLocation, zoom, setZoom, originalLocation } = useMapContext();
  const { event, setEvent, setMarker, selectedEvent} = useEvent();

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
    }
  );
  
  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  useEffect(() => {
    getCheckpointsHook(selectedEvent?.id).then((res) => {
      console.log(res)
      setCheckpoints(res.checkpoints);
    })
  }, [selectedEvent]);

  map.on('dragend', () => {
    const center = map.getCenter(); 
    const { lat, lng } = center;
    setLocation([lat, lng]);
  });

  map.on('zoomend', () => {
    const zoom = map.getZoom();
    setZoom(zoom);
  });

  return (
    <>
    {selectedEvent && Array.isArray(checkpoints) && checkpoints.map((cp, index) => (
        <Marker
          key={index}
          position={cp.marker.position}
          icon={createCustomIcon(cp.order)}
        >
          <Popup offset={[10, -40]} className="custom-popup" maxWidth={600}>
            <div
              className="px-6 w-[500px] rounded-l-xl m-2 p-2 pt-4 pb-6 bg-[#ffffff] h-auto"
            >
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
