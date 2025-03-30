"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Card from '../ui/card';
import Image  from 'next/image';
import { useTranslations } from 'next-intl';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import example      from '../../../public/svg/example.svg';
import description  from '../../../public/img/description.png';
import qr     from '../../../public/img/QR.png';
import dana   from '../../../public/img/dana.png';

export default function SwiperComponent() {
  const data = [
    {
      id: 1,
      image: dana,
      title: "Ganesa Night Run",
      address: "Jl. Ganesa, Sekip, Kec. Depok, Kabupaten Sleman, DI Yogyakarta 55281",
      rating: 4,
      isPublic: true,
      qr: true,
    },
    {
      id: 2,
      image: description,
      title: "Yogyakarta Marathon",
      address: "Jl. Ganesa, Sekip, Kec. Depok, Kabupaten Sleman, DI Yogyakarta 55281",
      rating: 4.5,
      isPublic: false,
      qr: false,
    },
    {
      id: 3,
      image: qr,
      title: "Borobudur Fun Run",
      address: "Jl. Ganesa, Sekip, Kec. Depok, Kabupaten Sleman, DI Yogyakarta 55281",
      rating: 4.2,
      isPublic: true,
      qr: true,
    },
    {
      id: 4,
      image: dana,
      title: "Parangtritis Trail Run",
      address: "Jl. Ganesa, Sekip, Kec. Depok, Kabupaten Sleman, DI Yogyakarta 55281",
      rating: 4.8,
      isPublic: false,
      qr: false,
    },
  ];

  const feature_1 = (
    <div className="bg-blue-500 rounded-2xl w-full h-[350px] flex flex-col p-4 mb-9  text-white">
      <div className="flex items-center justify-center overflow-hidden rounded-t-2xl">
        <Image src={data[0].image} alt="example" className="object-cover " />
      </div>
        <div className="flex flex-row pt-4 ">
          <div className="flex flex-row w-full">
            <h1 className="font-bold text-2xl tracking-tight w-[80%] pr-5 ">
              {data[0].title}
            </h1>
            <div className="flex flex-end max-w-[10%] mr-2">
              <div className="rounded-full border border-white  mr-2 h-fit flex items-center justify-center">
                <i className="material-icons text-xl px-2 py-1 ">print</i>
              </div>
              <div className="rounded-full border border-white h-fit flex items-center justify-center">
                <i className="material-icons text-xl px-2 py-1 ">bookmark</i>
              </div>
            </div>
          </div>
        </div>
        <p className="flex text-xs items-center w-[70%] mb-2">
          {data[0].address}
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-end align-center items-center">
            {data[0].rating !== null && (
              <>
                <p className="text-sm mr-2 italic text-white tracking-tighter">
                  {data[0].rating}
                </p>
                {[1, 2, 3, 4, 5].map((i) => (
                  <i
                    key={i}
                    className={`material-icons text-yellow-500 text-sm ${
                      i <= Math.floor(data[0].rating)
                        ? "star"
                        : i - 0.5 === data[0].rating
                        ? "star_half"
                        : "star_border"
                    }`}
                  >
                    {i <= Math.floor(data[0].rating)
                      ? "star"
                      : i - 0.5 === data[0].rating
                      ? "star_half"
                      : "star_border"}
                  </i>
                ))}
              </>
            )}
          </div>
          <div className="flex flex-row gap-2">
            {!data[0].isPublic ? (
              <div className="flex items-center text-lñg">
                <i className="material-icons text-md">public</i>
              </div>
            ) : (
              <div className="flex items-center text-sm">
                <i className="material-icons text-md">lock</i>
              </div>
            )}
            {data[0].qr ? (
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
  );

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
        <SwiperSlide>
          <div className="flex justify-center items-center ">
            {feature_1}
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center ">
            {feature_1}
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center ">
            {feature_1}
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center ">
            {feature_1}
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

