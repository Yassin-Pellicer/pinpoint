"use client";

import "react-quill/dist/quill.snow.css";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";

import Logo from "../../../components/ui/logo_btn";
import { useMapContext } from "../../../utils/context/ContextMap";
import Tags from "../../../components/create/tags";
import EventCarousel from "../../../components/main/mainEventCarousel";
import EventCarouselList from "../../../components/main/mainEventList";
import debounce from "lodash.debounce";
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
    const handler = debounce(async () => {
      await loadSearchEvents(filterTags, search);
    }, 500);
    handler();
    return () => handler.cancel && handler.cancel();
  }, [filterTags, search]);

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
      <div className="flex mt-6 flex-row justify-between items-center align-center">
        <div className=" w-[100px] flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex flex-row items-center align-center gap-2">
          <i className="material-icons w-[40px] h-[40px] text-2xl bg-gray-300 items-center justify-center flex rounded-full">
            person
          </i>
          <div className="flex flex-col">
            <p className="font-bold text-lg mr-2">{username}</p>
          </div>
          <div className="rounded-full border border-black h-fit flex items-center justify-center">
            <i className="material-icons text-xl px-2 py-1 ">more_vert</i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="h-fit rounded-2xl bg-gray-300 relative hover:cursor-pointer hover:bg-gray-400 transition duration-100">
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute w-1/2 inset-0"
              style={{
                backgroundImage: "url('/img/cpcreate.png')",
                transform: "rotate(-5deg)",
              }}
            ></div>
            <div className="relative z-10 p-5">
              <h1
                className="text-2xl tracking-tighter font-bold mb-2 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                ¡Crea un evento ahora!
              </h1>
              <p
                className="text-sm tracking-tighter font-bold text-white"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Crea tu evento y comparte planes con la comunidad
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => router.push("/main/user/" + user?.id)}
          className="h-auto rounded-2xl bg-gray-300 relative hover:cursor-pointer hover:bg-gray-400 transition duration-100"
        >
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-0 top-0 bottom-0 w-1/2 h-3/4 transform"
              style={{
                backgroundImage: "url('/img/comment.png')",
                transform: "rotate(5deg)",
              }}
            ></div>
            <div className="relative z-10 p-5">
              <h1
                className="text-2xl tracking-tighter font-bold mb-2 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                Entra a tu perfil
              </h1>
              <p
                className="text-sm tracking-tighter font-bold text-white"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Accede a tu perfil y revisa tus eventos, comentarios y signups.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-4">
        <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
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
                  className="text-2xl tracking-tighter font-bold mb-2 text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Eventos recomendados en tu zona
                </h1>
              </div>
              <p
                className="text-sm tracking-tighter font-bold text-white"
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
            <div className="bg-blue-500 rounded-b-2xl w-full h-[350px] flex flex-col p-4 mb-9 items-center align-center justify-center text-white">
              <div className="animate-spin rounded-full h-[150px] w-[150px] border-b-4 border-white p4"></div>
            </div>
          </>
        )}
        <EventCarousel events={recommendations} />
      </div>

      <div className="grid gap-4 mb-4">
        <div className="h-fit rounded-2xl bg-blue-500 relative hover:cursor-pointer hover:bg-blue-600 transition duration-100">
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

      <div className="mb-6 py-4 bg-gray-300 rounded-2xl">
        <div className="h-fit px-4 rounded-2xl mb-4 bg-gray-300 relative p-2">
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute w-1/2 inset-0"
              style={{
                backgroundImage: "url('/img/world.png')",
                transform: "rotate(-5deg)",
                opacity: "0.9",
              }}
            ></div>
            <div className="relative z-10 p-5">
              <h1
                className="text-3xl tracking-tighter font-bold mb-2 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                <i className="material-icons mr-2 text-2xl">search</i>
                Busca un evento
              </h1>
              <p
                className="text-sm tracking-tighter font-bold text-white"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Puedes escribir el título del evento o filtrar por tags ¿Qué
                aventuras te esperan hoy?
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center p-2 bg-blue-500 w-full h-fit items-center align-center gap-2 mb-4">
          <input
            type="text"
            className="outline-none rounded-lg px-4 py-2 w-full text-xs"
            placeholder={t("write")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={(e) => {
              setOpenTags(!openTags);
              e.preventDefault();
            }}
            className="font-bold bg-transparent border-2 text-sm border-white-500  text-white
                text-white-500 rounded-lg px-2 h-[34px] hover:bg-blue-500
                hover:border-white-500 hover:text-white w-fit
                transition duration-300"
          >
            Tags
          </button>
          <button
            className="font-bold bg-transparent border-2 text-sm border-white-500 
                text-white-500 rounded-lg px-2 h-[34px] hover:bg-blue-500
                hover:border-white-500 hover:text-white w-fit
                transition duration-300"
          >
            <i className="material-icons text-white text-xl">lock</i>
          </button>
        </div>
        <div className="px-4                                                                                                                                                                                                                                                                           ">
          {filterTags.length > 0 && (
            <div className="flex flex-wrap w-full mb-4 gap-2">
              {filterTags.map((tag) => (
                <div
                  key={tag.tag_id}
                  className={`rounded-full w-fit px-2 py-1 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight"
              }`}
                >
                  <p className="text-xs">{tagsTrans(`${tag.tag_id}`)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <EventCarouselList events={searchResults} />
      </div>
      <Tags open={openTags} setOpen={setOpenTags} />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
      </LocalizationProvider>
    </>
  );
}
