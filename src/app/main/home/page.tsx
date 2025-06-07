"use client";
export const dynamic = 'force-dynamic'; // Tells Next.js this page is dynamic

import "react-quill/dist/quill.snow.css";
import React, { useEffect, useRef } from "react";

import { useMapContext } from "../../../utils/context/ContextMap";
import EventCarousel from "../../../components/main/mainEventCarousel";
import { useSession } from "../../../utils/context/ContextSession";

import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";
import Feed from "../../../components/main/feed";
import Banner from "../../../components/profile/simplifiedBanner";


export default function Create() {
  
  const {
    selectedEvent,
    location,
    zoom,
    recommendations,
    modifiedEvent,
    loadEvents,
  } = useMapContext();

  const { user } = useSession();
  const { setSelectedEvent } = useMapContext();
  const router = useRouter();

  useEffect(() => {
    setSelectedEvent(null);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [zoom, location, modifiedEvent, selectedEvent]);

  useEffect(() => {
    if (!selectedEvent) {
      router.push("/main/home");
    }
    if (selectedEvent) {
      router.push("/main/event/" + selectedEvent?.id);
    }
  }, [selectedEvent]);

  return (
    <>
      <div>
      {user && <Banner></Banner>}
        <div className="h-auto bg-blue-400 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-0 top-0 bottom-0 w-1/2 h-3/4 transform rotate-[5deg] z-0 m-5"
              style={{
                backgroundImage: "url('/img/recommended.png')",
              }}
            ></div>

            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center">
                <i
                  className="material-icons text-white text-4xl mr-5"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  star
                </i>
                <h1
                  className="text-2xl tracking-tighter font-bold text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Eventos recomendados
                </h1>
              </div>
            </div>
          </div>
        </div>

        {recommendations.length === 0 && (
          <>
            <div className="bg-blue-500 w-full h-[450px] flex flex-col p-4 mb-9 items-center align-center justify-center text-white">
              <div className="animate-spin rounded-full h-[150px] w-[150px] border-b-4 border-white p4"></div>
            </div>
          </>
        )}
      <div className="mb-6">
          <EventCarousel events={recommendations} />
        </div>
      </div>

      <Feed></Feed>

      <div className="grid gap-4">
        <div className="h-fit bg-blue-500 relative hover:cursor-pointer hover:bg-blue-600 transition duration-100">
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute inset-0"
              style={{
                backgroundImage: "url('/img/QR.png')",
                filter: "brightness(0.9)",
              }}
            ></div>
            <div className="relative z-10 p-5 pl-[125px]">
              <h1
                className="text-2xl tracking-tighter font-bold mb-2 text-white text-right"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                Escanea los QR de los eventos con la aplicación de Pinpoint
              </h1>
              <p
                className="text-sm tracking-tighter font-bold text-white text-right"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Eleva tu experiencia con nuestra app.
              </p>
            </div>
          </div>
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
      </LocalizationProvider>
    </>
  );
}

