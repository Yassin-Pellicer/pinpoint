import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { Checkpoint } from "../../../utils/classes/cpClass";
import { useCheckpoints } from "../../../utils/context/cpContext"; 
import { useTranslations } from "next-intl";

const PlaceCP = () => {
  const map = useMap();
  const {checkpoints, setCheckpoints, focusedCheckpoint} = useCheckpoints();
  const [count, setCount] = useState(0);
  const [expanded, setExpandedToggle] = useState(false);

  const t = useTranslations("CPpopup");

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
  
  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  useMapEvents({
    dblclick: (e) => {
      map.closePopup();
      const { lat, lng } = e.latlng;
      const newMarker = { position: [lat, lng], draggable: true };
      const newCheckpoint = new Checkpoint(
        newMarker,
        count,
        "",
        checkpoints.length + 1,
        "Checkpoint"
      );
      setCount(count + 1);
      setCheckpoints([...checkpoints, newCheckpoint]); 
    },
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
      map.flyTo(focusedCheckpoint.marker.position, 15);
    }
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
          <Popup offset={[10, -40]} className="custom-popup" maxWidth={600}>
            <div
              className={`px-6 overflow-auto w-[400px] h-[380px] rounded-l-xl m-4 bg-[#ffffff] pt-6 ${
                !expanded ? "h-auto" : "max-h-[380px]"
              }`}
            >
              <div className="flex flex-col mb-4">
                <h1 className="font-caveat tracking-tight font-bold text-4xl text-left mb-6">
                  {t("title")}
                </h1>
                <h1 className="tracking-tight text-3xl font-bold">
                  {cp.name}
                </h1>
              </div>
              <Quill
                readOnly={true}
                modules={{ toolbar: false }}
                style={{
                  maxHeight: "fit-content",
                  overflowY: "auto",
                  border: "none",
                }}
                value={cp.description}
              ></Quill>
              <button
                className="flex justify-center mx-auto mb-5 sticky bottom-2"
                onClick={() => {
                  setExpandedToggle(!expanded);
                }}
              >
                {!expanded ? (
                  <img
                    src="/svg/arrow.svg"
                    alt="Description of image"
                    className="cursor-pointer scale-[1] p-2"
                  />
                ) : (
                  <img
                    src="/svg/arrow.svg"
                    alt="Description of image"
                    className="rotate-180 cursor-pointer scale-[1] p-2"
                  />
                )}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default PlaceCP;
