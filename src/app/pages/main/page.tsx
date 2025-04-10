"use client";

import Layout from "../home/layout";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import MapMain from "../../../components/main/mainMap";

import { useCheckpoints } from "../../../utils/context/cpContext";
import { useEvent } from "../../../utils/context/eventContext";
import Logo from "../../../components/ui/logo_btn";
import { useMapContext } from "../../../utils/context/mapContext";
import { Event } from "../../../utils/classes/EventClass";
import Tags from "../../../components/create/tags";
import { Tag } from "../../../utils/classes/Tag";
import { getEventsHook } from "../../../hooks/main/getEventsHook";
import { getTagsHook } from "../../../hooks/main/getTagsHook";
import EventInfo from "../../../components/main/evInfo";
import EventCarousel from "../../../components/main/eventCarousel";
import EventCarouselSearch from "../../../components/main/eventCarouselSearch";
import debounce from "lodash.debounce";
import { useSessionContext } from "../../../utils/context/sessionContext";

export default function Create() {
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { event, setEvent, setEvents, setMarker, setAuthor, selectedEvent, events} = useEvent();
  const { location, setLocation, zoom, setZoom, originalLocation, filterTags, setFilterTags, search, setSearch, searchResults, setSearchResults } = useMapContext();
  const [openTags, setOpenTags] = useState(false);
  const [localTags, setLocalTags] = useState(filterTags);
  const { username } = useSessionContext();

  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const loadEvents = async () => {
    const newEvents = await getEventsHook(undefined, undefined, undefined, location?.[0], location?.[1], zoom, events);
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
    setEvents((prevEvents) => {
      const newEventIds = new Set(prevEvents.map(event => event.id));
      const nonDuplicateEvents = updatedEvents.filter(event => !newEventIds.has(event.id));
      return [...prevEvents, ...nonDuplicateEvents];
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

  useEffect(() => {
    setCheckpoints([]);
    setEvent(new Event());
  }, []);

  useEffect(() => {
    loadEvents();
  }, [zoom, location]);

  useEffect(() => {
    const handler = debounce(async () => {
      await loadSearchEvents(filterTags, search);
    }, 500);
  
    handler();
  
    return () => handler.cancel && handler.cancel();
  }, [filterTags, search]);

  useEffect(() => {
    if (selectedEvent != null) return;
    setCheckpoints([]);
  }, [selectedEvent]);

  return (
    <Layout>
      <div className="flex flex-col overflow-auto bg-blue-500 h-screen px-6 min-w-[560px] max-w-[560px]">
        {/* Event type */}
        {!selectedEvent && (
          <div className="flex px-6 flex-col mb-6 mt-6 rounded-2xl bg-white">
            <div className="flex mt-6 flex-row justify-between items-center align-center">
              <div className=" w-[100px] flex items-center justify-center">
                <Logo />
              </div>
              <div className="flex flex-row items-center align-center">
                <i className="material-icons w-[40px] h-[40px] text-2xl bg-gray-400 items-center justify-center flex rounded-full mr-4">
                  person
                </i>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{username}</p>
                </div>
              </div>
              <div className="flex flex-row items-center align-center gap-2">
                <div className="rounded-full border border-black h-fit flex items-center justify-center">
                  <i className="material-icons text-xl px-2 py-1 ">bookmark</i>
                </div>
                <div className="rounded-full border border-black h-fit flex items-center justify-center">
                  <i className="material-icons text-xl px-2 py-1 ">add</i>
                </div>
                <div className="rounded-full border border-black h-fit flex items-center justify-center">
                  <i className="material-icons text-xl px-2 py-1 ">more_vert</i>
                </div>
              </div>
            </div>

            <div className=" mt-6">
              <EventCarousel />
            </div>

            <div className="mb-6">
              <div className="flex flex-row justify-center items-center align-center gap-2 mb-4">
                <input
                  type="text"
                  className="outline-none border-2 border-gray-500 rounded-full px-4 py-2 w-full text-xs"
                  placeholder={t("write")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  onClick={(e) => {
                    setOpenTags(!openTags);
                    e.preventDefault();
                  }}
                  className="font-bold bg-transparent border-2 text-sm border-gray-500 
              text-gray-500 rounded-full px-2 h-[34px] hover:bg-blue-500
                hover:border-blue-500 hover:text-white w-fit
                transition duration-300"
                >
                  Tags
                </button>
                <button
                  className="font-bold bg-transparent border-2 text-sm border-gray-500 
              text-gray-500 rounded-full px-2 h-[34px] hover:bg-blue-500
                hover:border-blue-500 hover:text-white w-fit
                transition duration-300"
                >
                  <i className="material-icons text-xl">lock</i>
                </button>
              </div>
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
              <EventCarouselSearch />
            </div>
            <Tags open={openTags} setOpen={setOpenTags} />
          </div>
        )}
        {selectedEvent && <EventInfo />}
      </div>
      {/* Map */}
      <MapMain />
    </Layout>
  );
}