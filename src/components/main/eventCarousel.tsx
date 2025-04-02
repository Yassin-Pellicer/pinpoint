"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Card from "../ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import example from "../../../public/svg/example.svg";
import description from "../../../public/img/description.png";
import qr from "../../../public/img/QR.png";
import dana from "../../../public/img/dana.png";
import { useEvent } from "../../utils/context/eventContext";

export default function SwiperComponent() {
  const { events } = useEvent();

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
        {events.map((event) => (
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
                <p className="flex text-xs items-center w-[70%] mt-2 mb-2">
                  { event.address}
                </p>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-end align-center items-center">
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
                  <div className="flex flex-row gap-2">
                    {!event.isPublic ? (
                      <div className="flex items-center text-lñg">
                        <i className="material-icons text-md">public</i>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <i className="material-icons text-md">lock</i>
                      </div>
                    )}
                    {qr ? (
                      <div className="flex items-center text-sm">
                        <i className="material-icons text-md">qr_code</i>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <i className="material-icons text-md">tour</i>
                      </div>
                    )}
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
