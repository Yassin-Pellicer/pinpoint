"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EventDate from "../ui/date"; // Adjust the path as needed
import { useMapContext } from "../../utils/context/ContextMap";
import { useRouter } from "next/navigation";

export default function SwiperComponent( {events} ) {
  const { setSelectedEvent, setSearch, setFilterTags } = useMapContext();
  const router = useRouter();
  return (
    <div className="flex flex-col">
      {events?.map((event, index) => (
        <div
          key={index}
          className="flex justify-center items-center select-none cursor-pointer"
          onClick={(e) => {
            router.push("/main/event/" + event.id);
            setSearch("");
            setFilterTags([])
            setSelectedEvent(event);
            e.stopPropagation();
          }}
        >
    <div className="bg-gray-100 text-black w-full h-fit flex items-center align-center hover:bg-gray-200 flex-row p-4 border-gray-300 border-[1px]">
            {event.banner && (
              <div className="overflow-hidden bg-white rounded-full w-[100px] h-[80px]">
                <img
                  src={event.banner}
                  alt="example"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col pl-5 w-full">
              <div className="flex flex-row justify-between items-center">
                <h1 className="font-bold text-md pr-5 tracking-tight">
                  {event.name}
                </h1>
              </div>
              {event.rating !== null && (
                <p className="text-xs mb-2 w-full">{event.address}</p>
              )}
              <div className="flex flex-row justify-between align-center items-center w-full">
                <div className="flex items-center">
                  {event.rating !== null && (
                    <>
                      <p className="text-sm mr-2 italic text-black tracking-tighter">
                        Puntuación: {event.rating}
                      </p>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <i
                          key={i}
                          className={`material-icons text-yellow-500 text-sm ${
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
                  <p className="text-xs w-full">{event.address}</p>
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
              {event.start && event.end && (
              <EventDate event={event} listMode={true} />
            )}
            </div>{" "}
          </div>
        </div>
      ))}
    </div>
  );
}