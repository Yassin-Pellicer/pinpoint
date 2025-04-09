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

  useEffect(() => {
    if (selectedEvent && map) {
      map.flyTo(
        [
          selectedEvent.marker.position[0] + 0.0007,
          selectedEvent.marker.position[1],
        ],
        18,
        { animate: true, duration: 0.5 }
      );
    }
    const zoom = map.getZoom();
    setZoom(zoom);
  }, [selectedEvent, map]);

  const filteredEvents = !selectedEvent || checkpoints.length === 0 ? events : [];

  return (
    <>
      {filteredEvents.map((event) => (
        <Marker
          key={event.id}
          position={event.marker.position}
          icon={createCustomIcon(event.name)}
          ref={(ref) => {
            if (ref) {
              if (map.getZoom() > 15) {
                setTimeout(() => ref.openPopup(), 0);
              } else {
                ref.closePopup();
              }
            }
          }}
          eventHandlers={{
            click: () => setSelectedEvent(event),
          }}
        >
          <Popup
            offset={[13, -30]}
            className="custom-popup"
            maxWidth={250}
            autoClose={false}
            closeOnClick={false}
            autoPan={false}
          >
            <div className="flex flex-col">
              {event.banner ? (
                <img
                  src={event.banner}
                  className="w-full h-15 rounded-t-xl object-cover"
                  alt="banner"
                />
              ) : (
                <></>
              )}
              <div className="flex flex-col px-2 pb-2 pt-2">
                <h1 className="tracking-tighter text-lg leading-none text-white font-bold">
                  {event.name}
                </h1>
                <div className="flex items-center mt-2">
                  {event.rating !== null && (
                    <>
                      <p className="text-sm italic pr-2 text-white tracking-tighter">
                        {event.rating}
                      </p>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <i
                          key={i}
                          className={`material-icons text-white text-sm ${
                            i <= Math.floor(event.rating)
                              ? "star"
                              : i - 0.5 === event.rating
                              ? "star_half"
                              : "star_border"
                          }`}
                        >
                          {i <= Math.floor(event.rating)
                            ? "star"
                            : i - 0.5 === event.rating
                            ? "star_half"
                            : "star_border"}
                        </i>
                      ))}
                    </>
                  )}
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
