"use client";

import Layout from "../home/layout";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import MapMain from "../../../components/main/mainMap";

import { useCheckpoints } from "../../../utils/context/cpContext";
import { useEvent } from "../../../utils/context/eventContext";
import Logo from "../../../components/ui/logo";
import { useMapContext } from "../../../utils/context/mapContext";
import { Event } from "../../../utils/classes/EventClass";
import Tags from "../../../components/create/tags";
import { Tag } from "../../../utils/classes/Tag";
import { getEventsHook } from "../../../hooks/main/getEventsHook";
import { getTagsHook } from "../../../hooks/main/getTagsHook";
import EventInfo from "../../../components/main/evInfo";
import EventCarousel from "../../../components/main/eventCarousel";

export default function Create() {
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { event, setEvent, setEvents, setMarker, setAuthor, selectedEvent } =
    useEvent();
  const { location, setLocation, zoom, setZoom, originalLocation } =
    useMapContext();
  const [openTags, setOpenTags] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  useEffect(() => {
    setCheckpoints([]);
    setEvent(new Event());

    getEventsHook().then(async (events) => {
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
      setEvents(updatedEvents);
      console.log(updatedEvents);
    });
  }, []);

  useEffect(() => {
    if (selectedEvent != null) return;
    setCheckpoints([]);
  }, [selectedEvent]);

  return (
    <Layout>
      <div className="flex flex-col overflow-auto bg-blue-500 h-screen px-6 min-w-[560px] max-w-[560px]">
        {/* Event type */}
        {!selectedEvent && (
          <div className="flex flex-col">
            <div className="flex flex-col items-center align-center">
              <Logo />
            </div>

            <div className="mb-6 mt-6 rounded-2xl bg-white p-6 pt-4 pb-0">
              <h1 className="font-bold font-caveat text-4xl tracking-tighter mb-2">
                Últimos Eventos en tu Zona
              </h1>
              <EventCarousel />
            </div>

            <div className="mb-6 rounded-2xl bg-white p-6 pb-0">
            <button
                onClick={(e) => {
                  setOpenTags(!openTags);
                  e.preventDefault();
                }}
                  className="font-bold bg-transparent border-2 text-sm mb-4 border-black 
              text-black rounded-xl p-2 hover:bg-blue-500
                hover:border-blue-500 hover:text-white w-full
                transition duration-300"
              >
                {t("setTags")}
              </button>

              {tags.length > 0 && (
                <div className="flex flex-wrap w-full mb-4 gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`rounded-md w-fit p-[10px] py-2 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight text-white"
            }`}
                    >
                      {tagsTrans(`${tag.name}`)}
                    </div>
                  ))}
                </div>
              )}

              <EventCarousel />
            </div>

            <div className="mb-6 rounded-2xl bg-white p-6">
              <h1 className="font-bold text-4xl mb-2 tracking-tight font-caveat">
                {t("write")}
              </h1>
              <div className="flex flex-row mt-4 mb-2">
                <input
                  type="text"
                  className="outline-none border-2 border-gray-400 rounded-md px-4 py-2 w-full"
                  placeholder={t("search")}
                />
                <div className="flex items-center">
                  <span className="material-icons ml-4">search</span>
                </div>
              </div>

            </div>
            <Tags
              open={openTags}
              setOpen={setOpenTags}
              parentTags={tags}
              setParentTags={setTags}
            />
          </div>
        )}
        {selectedEvent && <EventInfo />}
      </div>
      {/* Map */}
      <MapMain />
    </Layout>
  );
}
