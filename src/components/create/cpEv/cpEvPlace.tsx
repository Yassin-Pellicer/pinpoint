import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { Checkpoint } from "../../../utils/classes/cpClass";
import { useCheckpoints } from "../../../utils/context/cpContext"; 

const CreateEvents = () => {
  const map = useMap();
  const {checkpoints, setCheckpoints} = useCheckpoints();
  const [count, setCount] = useState(0);
  const [expanded, setExpandedToggle] = useState(false);

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
        ""
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
          <Popup offset={[0, -40]} maxWidth={600}>
            <div
              className={`overflow-auto w-[600px] h-[380px] rounded-2xl bg-[#e6e6e6] px-2 pt-6 ${
                expanded ? "h-auto" : "max-h-[380px]"
              }`}
            >
              <div className="flex flex-col justify-center items-center mb-4">
                <h1 className="font-caveat font-bold text-3xl text-left px-6 mb-6">
                  Details of the Checkpoint
                </h1>
                <div className="cursor-pointer hover:bg-[#b6b6b6] bg-[#d6d6d6] rounded-full p-20 mb-2">
                  <img
                    src="/add.svg"
                    alt="Description of image"
                    className="scale-[3]"
                  />
                </div>
                <p className="text-xs mb-2">Click to add a banner!</p>
                <div className="flex flex-col items-center max-w-[80%]">
                  <h1 className="font-caveat text-center text-5xl bold">
                    {cp.name}
                  </h1>
                </div>
              </div>
              <Quill
                readOnly={true}
                modules={{ toolbar: false }}
                style={{
                  maxHeight: "fit-content",
                  overflowY: "auto",
                  margin: "20px",
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
                    src="/arrow.svg"
                    alt="Description of image"
                    className="cursor-pointer scale-[1] p-2"
                  />
                ) : (
                  <img
                    src="/arrow.svg"
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

export default CreateEvents;
