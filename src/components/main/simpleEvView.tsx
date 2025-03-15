import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useEvent } from "../../utils/context/eventContext";
import { useTranslations } from "next-intl";
import { useMapContext } from "../../utils/context/mapContext";

const PlaceCP = () => {
  const map = useMap();

  const t = useTranslations("SimplePopup");
  const tagsTrans = useTranslations("Tags");

  const {
    events,
    selectedEvent,
    setSelectedEvent
  } = useEvent();

  const { location, setLocation, zoom, setZoom, originalLocation } = useMapContext();

  /**
   * Creates a custom icon for the map markers with a marquee animation in the text.
   * @param {string} name - The name of the event to be displayed in the icon.
   * @returns {L.DivIcon} The custom icon.
   */
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
      {!selectedEvent &&
        events.map((event) => (
          <Marker
            position={event.marker.position}
            icon={createCustomIcon(event.name)}
            eventHandlers={{}}
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
                  {event.tags?.map((tag) => (
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
                <button
                  onClick={(e) => {
                    setSelectedEvent(event);
                    e.preventDefault();
                  }}
                  className="font-bold bg-transparent border-2 text-sm border-black 
            text-black rounded-xl p-2 hover:bg-blue-500
            hover:border-blue-500 hover:text-white 
            transition duration-300 mb-4"
                >
                  TODO - Select event
                </button>
                <div className="pb-6"></div>
              </div>
            </Popup>
          </Marker>
        ))}

      {selectedEvent && (
        <Marker
          position={selectedEvent.marker.position}
          icon={createCustomIcon(selectedEvent.name)}
          eventHandlers={{}}
        >
          <Popup offset={[0, -100]} className="custom-popup" maxWidth={500}>
            <div className="px-6 w-[450px] rounded-l-xl m-2 bg-[#ffffff] pt-6 h-auto">
              <div className="flex flex-col mb-4">
                <h1 className="font-caveat tracking-tight font-bold text-4xl text-left mb-4">
                  {t("title")}
                </h1>
                {selectedEvent.banner ? (
                  <img
                    src={selectedEvent.banner}
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
                  {selectedEvent.name}
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
                value={selectedEvent.description}
              ></Quill>
              <div className="flex flex-wrap w-full mt-4 gap-2">
                {selectedEvent.tags?.map((tag) => (
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
              <button
                  onClick={(e) => {
                    setSelectedEvent(null);
                    e.preventDefault();
                  }}
                  className="font-bold bg-transparent border-2 text-sm border-black 
            text-black rounded-xl p-2 hover:bg-blue-500
            hover:border-blue-500 hover:text-white 
            transition duration-300 mb-4"
                >
                  TODO - deselect event
                </button>
              <div className="pb-6"></div>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default PlaceCP;
