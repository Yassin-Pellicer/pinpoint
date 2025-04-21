"use client";

import Layout from "../home/layout";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import MapMain from "../../../components/main/mainMap";

import { useCheckpoints } from "../../../utils/context/ContextCheckpoint";
import { useEvent } from "../../../utils/context/ContextEvent";
import Logo from "../../../components/ui/logo_btn";
import { useMapContext } from "../../../utils/context/ContextMap";
import { Event } from "../../../utils/classes/Event";
import Tags from "../../../components/create/tags";
import { Tag } from "../../../utils/classes/Tag";
import { getEventsHook } from "../../../hooks/main/getEventsHook";
import { getTagsHook } from "../../../hooks/main/getTagsHook";
import EventInfo from "../../../components/main/evInfo";
import EventCarousel from "../../../components/main/eventCarousel";
import EventCarouselSearch from "../../../components/main/eventCarouselSearch";
import debounce from "lodash.debounce";
import { useSessionContext } from "../../../utils/context/ContextSession";

import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Create() {
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { event, setEvent, setEvents, setMarker, setAuthor, selectedEvent, events} = useEvent();
  const { location, setLocation, zoom, setZoom, originalLocation, filterTags, setFilterTags, search, setSearch, searchResults, setSearchResults, recommendations, setRecommendations } = useMapContext();
  const [openTags, setOpenTags] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [localTags, setLocalTags] = useState(filterTags);
  const { username } = useSessionContext();

  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const loadEvents = async () => {
    const newEvents = await getEventsHook(
      undefined,
      undefined,
      undefined,
      location?.[0],
      location?.[1],
      zoom,
      events.filter(event => event.id !== selectedEvent?.id)
    );
  
    const updatedEvents = await Promise.all(
      newEvents.events.map(async (event) => {
        const response = await getTagsHook(event.id);
        const newTags = response.tags.map((tag) => {
          const foundTag = Tag.tags.find((aux) => aux?.id === tag.tag_id);
          return foundTag || tag;
        });
        return { ...event, tags: newTags };
      })
    );
  
    setEvents(() => {
      const updatedMap = new Map(events.filter(event => event.id !== selectedEvent?.id).map(event => [event.id, event]));
      updatedEvents.forEach(event => {
        updatedMap.set(event.id, event); // replace or add
      });
      return Array.from(updatedMap.values());
    });
  };
  
  const loadSearchEvents = async (tags, searchTerm) => {
    if (tags.length === 0 && searchTerm === "") {
      setSearchResults([]);
      return;
    }
    const newEvents = await getEventsHook(tags, searchTerm);
    const updatedEvents = await Promise.all(
      newEvents.events.map(async (event) => {
        const response = await getTagsHook(event.id);
        const newTags = response.tags.map((tag) => {
          const foundTag = Tag.tags.find((aux) => aux?.id === tag.tag_id);
          return foundTag || tag;
        });
        return { ...event, tags: newTags };
      })
    );
    const newEventIds = new Set(events.map(event => event.id));
    const nonDuplicateEvents = updatedEvents.filter(event => !newEventIds.has(event.id));
    setEvents((prev) => [...prev, ...nonDuplicateEvents]);
    setSearchResults(
      updatedEvents
    );
  };

  const loadRecommendations = async (recommendations, userLat, userLon) => {
    const events = await getEventsHook(null, null, recommendations, userLat, userLon);
    const updatedEvents = await Promise.all(
      events.events.map(async (event) => {
        const response = await getTagsHook(event.id);
        const newTags = response.tags.map((tag) => {
          const foundTag = Tag.tags.find((aux) => aux?.id === tag.tag_id);
          return foundTag || tag;
        });
        return { ...event, tags: newTags };
      })
    );
    setRecommendations(updatedEvents);
  };

  useEffect(() => {
    loadRecommendations(true, originalLocation[0], originalLocation[1]);
  }, []);

  useEffect(() => {
    setCheckpoints([]);
    setEvent(new Event());
  }, []);

  useEffect(() => {
    loadEvents();
  }, [zoom, location, selectedEvent]);

  useEffect(() => {
    const handler = debounce(async () => {
      await loadSearchEvents(filterTags, search);
    }, 500);
  
    handler();
  
    return () => handler.cancel && handler.cancel();
  }, [filterTags, search, selectedEvent]);

  useEffect(() => {
    if (selectedEvent != null) { setOpenDetails(true); return;}
    setCheckpoints([]);
    setOpenDetails(false);
  }, [selectedEvent]);

  return (
    <Layout>
      <div className="flex flex-row">
        <div className="flex flex-col overflow-auto bg-blue-500 h-screen shrink-0 px-6 w-[550px]">
          {/* Event type */}
          <div className="flex px-6 flex-col mb-6 mt-6 rounded-2xl bg-white">
            <div className="flex mt-6 flex-row justify-between items-center align-center">
              <div className=" w-[100px] flex items-center justify-center">
                <Logo />
              </div>
              <div className="flex flex-row items-center align-center"></div>
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
              <div className="h-auto rounded-2xl bg-gray-300 relative hover:cursor-pointer hover:bg-gray-400 transition duration-100">
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
                      Accede a tu perfil y revisa tus eventos, comentarios y
                      signups.
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
                      Explora eventos que podrían interesarte, basados en tu
                      ubicación y preferencias.
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
              <EventCarousel />
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
                      Escanea los QR de los eventos con la aplicación de
                      Pinpoint
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
                      Puedes escribir el título del evento o filtrar por tags
                      ¿Qué aventuras te esperan hoy?
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
                        key={tag.id}
                        className={`rounded-full w-fit px-2 py-1 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight"
            }`}
                      >
                        <p className="text-xs">{tagsTrans(`${tag.name}`)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <EventCarouselSearch />
            </div>
            <Tags open={openTags} setOpen={setOpenTags} />
          </div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
          <EventInfo open={openDetails} setOpen={setOpenDetails} />
          </LocalizationProvider>
        </div>
        {/* Map */}
        <MapMain />
      </div>
    </Layout>
  );
}