"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEvent } from "../../utils/context/ContextEvent";
import EventInscription from "../profile/eventInscription";

export default function SwiperComponent( {events} ) {
  return (
    <div className="flex flex-col">
      {events?.map((event, index) => (
        <div
          key={index}
          className="flex justify-center items-center select-none cursor-pointer"
        >
          <EventInscription event={event} />
        </div>
      ))}
    </div>
  );
}