"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEvent } from "../../utils/context/ContextEvent";
import { getEventsHook } from "../../hooks/main/getEventsHook";
import { getTagsHook } from "../../hooks/main/getTagsHook";
import { Tag } from "../../utils/classes/Tag";
import { useMapContext } from "../../utils/context/ContextMap";

export default function SwiperComponent() {

  const { event, setEvent, setEvents, setMarker, setAuthor, selectedEvent, setSelectedEvent } = useEvent();
  const { location, setLocation, zoom, setZoom, originalLocation, filterTags, setFilterTags, search, setSearch, recommendations, setRecommendations } = useMapContext();
  const [openTags, setOpenTags] = useState(false);
  const [localTags, setLocalTags] = useState(filterTags);

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
              <div
                className="flex justify-center items-center select-none cursor-pointer"
                onClick={(e) => {
                  setSelectedEvent(event);
                  e.stopPropagation();
                }}
              >
                <div className="bg-blue-500 rounded-b-2xl w-full h-[350px] flex flex-col p-4 mb-9  text-white hover:bg-blue-600 transition-colors duration-250">
                  {event.banner && (
                    <div className="flex items-center justify-center overflow-hidden rounded-t-2xl">
                      <img src={event.banner} alt="" className="w-full " />
                    </div>
                  )}
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
                          <p className="text-sm mr-2 italic text-white tracking-tighter">
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
                    {event.rating === null ? (
                      <p className="text-xs mb-2 w-full">{event.address}</p>
                    ) : (
                      <></>
                    )}
                    <div className="flex flex-row items-center">
                      <div className="flex items-center">
                        <i className="material-icons text-md">
                          {event.isPublic ? "lock" : "public"}
                        </i>
                      </div>
                      {event.qr && (
                        <div className="flex items-center ml-4">
                          <i className="material-icons text-md ml-4">qr_code</i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
}

