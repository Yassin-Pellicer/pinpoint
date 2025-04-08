"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEvent } from "../../utils/context/eventContext";
import { getEventsHook } from "../../hooks/main/getEventsHook";
import { getTagsHook } from "../../hooks/main/getTagsHook";
import { Tag } from "../../utils/classes/Tag";
import { useMapContext } from "../../utils/context/mapContext";

export default function SwiperComponent() {

  const { event, setEvent, setEvents, setMarker, setAuthor, selectedEvent } = useEvent();
  const { location, setLocation, zoom, setZoom, originalLocation, filterTags, setFilterTags, search, setSearch, recommendations, setRecommendations } = useMapContext();
  const [openTags, setOpenTags] = useState(false);
  const [localTags, setLocalTags] = useState(filterTags);

  const loadEvents = async (recommendations, userLat, userLon) => {
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
    loadEvents(true, originalLocation[0], originalLocation[1]);
  }, []);

  return (
    <div className="relative">
      <Swiper
        spaceBetween={25}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {recommendations.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="flex justify-center items-center ">
              <div className="bg-blue-500 rounded-2xl w-full h-[350px] flex flex-col p-4 mb-9  text-white">
                <div className="flex items-center justify-center overflow-hidden rounded-t-2xl">
                  <img src={event.banner} alt="example" className="w-full " />
                </div>
                <div className="flex flex-row pt-4 ">
                  <div className="flex flex-row w-full">
                    <h1 className="font-bold text-2xl tracking-tight w-[80%] pr-5 ">
                      {event.name}
                    </h1>
                    <div className="flex flex-end max-w-[10%] mr-2">
                      <div className="rounded-full border border-white  mr-2 h-fit flex items-center justify-center">
                        <i className="material-icons text-xl px-2 py-1 ">
                          print
                        </i>
                      </div>
                      <div className="rounded-full border border-white h-fit flex items-center justify-center">
                        <i className="material-icons text-xl px-2 py-1 ">
                          bookmark
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="flex text-xs items-center w-[70%] mb-2">
                  {event.rating !== null ? event.address : ""}
                </p>
                <div className="flex flex-row justify-between items-center w-full">
                <div className="flex items-center">
                  {event.rating !== null && (
                    <>
                      <p className="text-sm mr-2 italic text-white tracking-tighter">{event.rating}</p>
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
                {event.rating === null ? (
                  <p className="text-xs mb-2 w-full">{event.address}</p>
                ) : (
                  <></>
                )}
               <div className="flex flex-row gap-4 items-center">
                  <div className="flex items-center">
                    <i className="material-icons text-md">
                      {event.isPublic ? "public" : "lock"}
                    </i>
                  </div>
                  <div className="flex items-center">
                    <i className="material-icons text-md">qr_code</i>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
