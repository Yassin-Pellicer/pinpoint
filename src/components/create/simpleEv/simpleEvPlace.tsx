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
            font-style: normal;
            font-variant: normal;
            font-weight: 400;
            font-size: 2rem;
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
          <Popup offset={[0, -100]} className="custom-popup" maxWidth={500}>
            <div className="px-6 w-[450px] rounded-l-xl m-2 bg-[#ffffff] pt-6 h-auto">
              <div className="flex flex-col mb-4">
                <h1 className="font-caveat tracking-tight font-bold text-4xl text-left mb-4">
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
              <div className="flex flex-wrap w-full mt-4 gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.name}
                    className={`rounded-md w-fit p-[10px] py-2 text-center
                 text-white bg-[#3F7DEA] font-bold tracking-tight text-white"
              }`}
                  >
                    {tagsTrans(`${tag.name}`)}
                  </div>
                ))}
              </div>
              <div className="pb-6"></div>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default PlaceCP;
