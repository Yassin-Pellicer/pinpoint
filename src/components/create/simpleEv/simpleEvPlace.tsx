import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useEvent } from "../../../utils/context/eventContext";
import { useTranslations } from "next-intl";

const PlaceCP = () => {
  const map = useMap();

  const t = useTranslations("SimplePopup");

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

  const createCustomIcon = (name: string) =>
    L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          position: relative;
          width: 300px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/svg/event.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          font-weight: bold;
          color: black;
          text-align: center;
          overflow: hidden;
          padding:20px;
          "
        >
        <div id="marquee-container" style="
          overflow: hidden;
          display: flex;
          justify-content: center;
        ">
          <div style="
            width: 300px;
            font-family: 'Caveat';
            font-style: normal;
            font-variant: normal;
            font-weight: 400;
            font-size: 3rem;
            line-height: 1.2;
            tracking: tighter;
            text-transform: none;
            font-feature-settings: normal;
            text-decoration: none;
            text-emphasis: none;
            color: currentColor;
            font-variation-settings: normal;
            display: inline-block;
            white-space: nowrap;
            animation: marquee 5s linear infinite;
            margin-bottom: 20px;
          ">
            ${name}
          </div>
        </div>
        </div>
        <style>
          @keyframes marquee {
            0% { transform: translateX(150%); }
            100% { transform: translateX(-300%); }
          }
        </style>
      `,
      iconAnchor: [150, 95],
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

      map.flyTo(newMarker.position as [number, number], 18);
    },
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
        <Popup offset={[0, -100]} className="custom-popup" maxWidth={500}>
            <div
              className="px-6 w-[450px] rounded-l-xl m-4 bg-[#ffffff] pt-6 h-auto"
            >
              <div className="flex flex-col mb-4">
                <h1 className="font-caveat tracking-tight font-bold text-4xl text-left mb-6">
                  {t("title")}
                </h1>
                {event.banner ? (
                  <img
                    src={event.banner}
                    className="w-full h-15 rounded-2xl object-cover border border-gray-400 mb-6"
                    alt="banner"
                  />
                ) : (
                  <div className="w-full h-15 p-20 flex justify-center items-center rounded-2xl bg-[#e6e6e6] mb-6 border border-gray-400">
                    <i className="text-gray-400 material-icons text-8xl">
                      image
                    </i>
                  </div>
                )}
                <h1 className="tracking-tight text-3xl font-bold">
                  {event.name}
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
                value={event.description}
              ></Quill>
              <div className = "pb-6"></div>
            </div>
          </Popup>
      </Marker>
    )}
  </>
  );
};

export default PlaceCP;
