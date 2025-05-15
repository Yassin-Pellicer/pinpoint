"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EventBookmark from "./eventBookmark";

export default function SwiperComponent( {events, userProp} ) {
  return (
    <div className="flex flex-col">
      {events?.map((event, index) => (
        <div
          key={index}
          className="flex justify-center items-center select-none cursor-pointer"
        >
          <EventBookmark event={event} userProp={userProp} />
        </div>
      ))}
    </div>
  );
}