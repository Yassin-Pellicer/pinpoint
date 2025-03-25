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

const evView = () => {
  const map = useMap();

  const t = useTranslations("SimplePopup");
  const tagsTrans = useTranslations("Tags");

  const { events, selectedEvent, setSelectedEvent } = useEvent();
  const { checkpoints } = useCheckpoints();

  const { location, setLocation, zoom, setZoom, originalLocation } =
    useMapContext();

    const createCustomIcon = (title: string) =>
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
          ">
            <div style="
              position: absolute;
              left: 110%;
              top: 50%;
              transform: translateY(-50%);
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: bold;
              width: 200px;
              word-wrap: break-word; /* Allow breaking text */
              white-space: normal; /* Ensure wrapping works */
              text-align: left;
            ">
              ${title}
            </div>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });
    
  useEffect(() => {
    map.setView(originalLocation, 14);
  }, []);

  map.on("dragend", () => {
    const center = map.getCenter();
    setLocation([center.lat, center.lng]);
  });

  map.on("zoomend", () => {
    setZoom(map.getZoom());
  });

  // Determine whether to show all events or just the selected one
  const filteredEvents = !selectedEvent || checkpoints.length === 0 ? events : [];

  return (
    <>
      {filteredEvents.map((event) => (
        <Marker
          key={event.id} // Ensure unique keys for React
          position={event.marker.position}
          icon={createCustomIcon(event.name)}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
            click: () => setSelectedEvent(event),
          }}
        >
          <Popup offset={[13, -30]} className="custom-popup" maxWidth={250}>
            <div className="flex flex-col">
              {event.banner ? (
                <img
                  src={event.banner}
                  className="w-full h-15 rounded-t-xl object-cover"
                  alt="banner"
                />
              ) : (
                <div className="w-full h-15 p-20 flex justify-center items-center rounded-xl bg-[#e6e6e6] border border-gray-400">
                  <i className="text-gray-400 material-icons text-8xl">image</i>
                </div>
              )}
              <div className="flex flex-col px-2 pb-2 pt-2">
                <h1 className="tracking-tighter text-lg leading-none text-white font-bold">
                  {event.name}
                </h1>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className={`material-icons text-yellow-500 text-lg`}>
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

export default evView;
