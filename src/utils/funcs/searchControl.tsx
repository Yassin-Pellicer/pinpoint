import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const SearchControl = (): JSX.Element => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      retainZoomLevel: false,
      showMarker: false,
      showPopup: false,
      animateZoom: true,
      searchLabel: " ",
    });

    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return <></>;
};