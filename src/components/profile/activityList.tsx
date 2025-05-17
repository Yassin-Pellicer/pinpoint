"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Activity from "./activity";

export default function SwiperComponent( {activities} ) {
  return (
    <div className="flex flex-col">
      {activities?.map((activity, index) => (
        <div
          key={index}
          className="flex justify-center items-center select-none cursor-pointer"
        >
          <Activity activity={activity}/>
        </div>
      ))}
    </div>
  );
}