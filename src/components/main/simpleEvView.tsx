import { useEffect, useState, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useEvent } from "../../utils/context/eventContext";
import { useTranslations } from "next-intl";
import { useMapContext } from "../../utils/context/mapContext";
import { useCheckpoints } from "../../utils/context/cpContext";
import Logo from "../ui/logo";

const PlaceCP = () => {
  const map = useMap();

  const t = useTranslations("SimplePopup");
  const tagsTrans = useTranslations("Tags");

  const { events, selectedEvent, setSelectedEvent } = useEvent();
  const { checkpoints } = useCheckpoints();

  const { location, setLocation, zoom, setZoom, originalLocation } =
    useMapContext();

  /**
   * Creates a custom icon for the map markers with a marquee animation in the text.
   * @param {string} name - The name of the event to be displayed in the icon.
   * @returns {L.DivIcon} The custom icon.
   */
  const createCustomIcon = (number: string) =>
    L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          position: relative;
          width: 200px;
          height: 100px;
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
        <div style="color: white; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
          transform: translateX(+70%);">${number}</div>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [20, 50],
    });

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

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
      {(!selectedEvent)&&
        events.map((event) => (
          <Marker
            position={event.marker.position}
            icon={createCustomIcon(event.name)}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
              click: (e) => {
                setSelectedEvent(event);
              },
            }}
          >
            <Popup offset={[55, -30]} className="custom-popup" maxWidth={250}>
              <div className="flex flex-col">
                {event.banner ? (
                  <img
                    src={event.banner}
                    className="w-full h-15 rounded-t-xl object-cover "
                    alt="banner"
                  />
                ) : (
                  <div className="w-full h-15 p-20 flex justify-center items-center rounded-xl bg-[#e6e6e6] border border-gray-400">
                    <i className="text-gray-400 material-icons text-8xl">
                      image
                    </i>
                  </div>
                )}
                <div className="flex flex-col px-2 pb-2 pt-2">
                  <h1 className="tracking-tighter text-lg leading-none text-white font-bold">
                    {event.name}
                  </h1>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i
                        key={i}
                        className={`material-icons text-yellow-500 text-lg ${
                          i <= Math.floor(3.5)
                            ? "star"
                            : i - 0.5 === 3.5
                            ? "star_half"
                            : "star_border"
                        }`}
                      >
                        {i <= Math.floor(3.5)
                          ? "star"
                          : i - 0.5 === 3.5
                          ? "star_half"
                          : "star_border"}
                      </i>
                    ))}
                    <p className="text-white text-md tracking-tighter">{3.5}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm tracking-tighter font-bold">
                      Click for more details
                    </p>
                    <div className="flex space-x-2 text-white">
                      <i className="material-icons">public</i>
                      {/* <i className="material-icons">lock</i> */}
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

export default PlaceCP;
