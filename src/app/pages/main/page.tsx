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
    });

  }, []);

  return (
    <Layout>
      {selectedEvent && !checkpoints && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-[400px] w-[400px] border-b-8 border-white m-auto" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1000">
            <div className="mb-5">
              <Logo />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col overflow-auto bg-blue-500 h-screen px-6 min-w-[560px] max-w-[560px]">
        {/* Event type */}
        {!selectedEvent && (
          <>
            <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
              <h1 className="font-bold text-5xl mb-2 tracking-tight font-caveat">
                {t("title")}
              </h1>
              <p className="text-sm mt-4">
                {t.rich("description", {
                  b: (chunks) => <b>{chunks}</b>,
                })}
              </p>
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

              <button
                onClick={(e) => {
                  setOpenTags(!openTags);
                  e.preventDefault();
                }}
                className="font-bold bg-transparent border-2 text-sm border-black 
          text-black rounded-xl p-2 hover:bg-blue-500
          hover:border-blue-500 hover:text-white w-full mt-4
          transition duration-300"
              >
                {t("setTags")}
              </button>

              {tags.length > 0 && (
                <div className="flex flex-wrap w-full mt-4 gap-2">
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
            </div>
            <Tags
              open={openTags}
              setOpen={setOpenTags}
              parentTags={tags}
              setParentTags={setTags}
            />
          </>
        )}
        {selectedEvent && <EventInfo />}
      </div>
      {/* Map */}
      <MapMain />
    </Layout>
  );
}
