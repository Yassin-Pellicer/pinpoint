"use client";

import "react-quill/dist/quill.snow.css";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";

import { useMapContext } from "../../../utils/context/ContextMap";
import EventCarousel from "../../../components/main/mainEventCarousel";
import { useSession } from "../../../utils/context/ContextSession";

import { CssBaseline, setRef } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";

export default function Create() {
  const {
    selectedEvent,
    location,
    zoom,
    filterTags,
    search,
    searchResults,
    recommendations,
    modifiedEvent,
    loadEvents,
    loadSearchEvents,
    loadRecommendations,
    setSearch,
  } = useMapContext();

  const { user } = useSession();

  const [openTags, setOpenTags] = useState(false);
  const { username, setUser } = useSession();
  const { setSelectedEvent } = useMapContext();

  const router = useRouter();

  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

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
      <div className="grid grid-cols-2">
        <div className="h-fit bg-red-500 relative hover:cursor-pointer hover:bg-red-600 transition duration-100">
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute w-1/2 inset-0 top-2"
              style={{
                backgroundImage: "url('/img/cpcreate.png')",
                transform: "rotate(-5deg)",
              }}
            ></div>
            <div className="relative z-10 p-5 h-full bg-black/20">
              <h1
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                className="text-2xl tracking-tighter font-bold mb-2 text-white"
              >
                ¡Crea un evento ahora!
              </h1>
              <p
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                className="text-md tracking-tighter font-bold text-white"
              >
                Crea tu evento y comparte planes con la comunidad
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => router.push("/main/user/" + user?.id)}
          className="h-auto bg-green-400 relative hover:cursor-pointer hover:bg-green-500 transition duration-100"
        >
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-0 bottom-0 w-1/2 h-3/4 transform top-2"
              style={{
                backgroundImage: "url('/img/comment.png')",
                transform: "rotate(5deg)",
              }}
            ></div>
            <div className="relative z-10 p-5 h-full bg-black/20">
              <h1
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                className="text-2xl tracking-tighter font-bold mb-2 text-white"
              >
                Entra a tu perfil
              </h1>
              <p
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                className="text-md tracking-tighter font-bold text-white"
              >
                Accede a tu perfil y revisa tus eventos, comentarios y signups.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
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
                  className="material-icons text-white text-7xl mr-5"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  star
                </i>
                <h1
                  className="text-5xl tracking-tighter font-caveat font-bold text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Eventos recomendados
                </h1>
              </div>
              <p
                className="text-md tracking-tighter font-bold text-white"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Explora eventos que podrían interesarte, basados en tu ubicación
                y preferencias.
              </p>
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
        <EventCarousel events={recommendations} />
      </div>

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
