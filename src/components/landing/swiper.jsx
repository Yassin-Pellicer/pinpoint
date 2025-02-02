"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Card from '../ui/card';
import Image  from 'next/image';
import { useTranslations } from 'next-intl';

import 'swiper/css';
import 'swiper/css/navigation';

import example      from '../../../public/svg/example.svg';
import description  from '../../../public/img/description.png';
import qr     from '../../../public/img/QR.png';
import dana   from '../../../public/img/dana.png';
import inter  from '../../../public/img/interface.png';
import pod    from '../../../public/img/podium.png';
import earth  from '../../../public/img/earth.png';

export default function SwiperComponent() {
  const t = useTranslations('Landing');

  const feature_1 = (
    <div className="bg-white flex align-center xl:flex-row p-12 m-14 rounded-2xl flex-col">
      <div className="flex flex-col align-center justify-center">
        <h1 className="text-9xl text-center font-caveat font-extrabold text-black mt-4 tracking-tighter">
          {t("cardOne.title")}
        </h1>
        <h2 className="text-black text-3xl text-center mt-10 align-center">
          {t("cardOne.subtitle")}
        </h2>
        <Image className="mt-[-100px] h-[500px]" src={example} alt="example" />
      </div>
    </div>
  );

  const feature_2 = (
    <div className="bg-white flex align-center xl:flex-row p-12 pb-0 m-14 rounded-2xl flex-col">
      <div className="flex flex-col align-center justify-center">
        <h1 className="text-8xl text-center font-caveat font-extrabold text-black mt-4 tracking-tighter">
          {t("cardTwo.title")}
        </h1>
        <h2 className="text-black text-3xl text-center mt-10 align-center">
          {t("cardTwo.subtitle")
            .split(t("cardTwo.bolden"))
            .map((part, index) =>
              index === 0 ? (
                part
              ) : (
                <strong key={index}>
                  <br />
                  {t("cardTwo.bolden")}
                </strong>
              )
            )}
        </h2>
        <div className="overflow-hidden">
          <Image
            className="translate-y-[200px] mx-auto mt-[-150px]"
            src={description}
            alt="example"
          />
        </div>
      </div>
    </div>
  );

  const feature_3 = (
    <div className="bg-white flex align-center xl:flex-row p-12 m-14 rounded-2xl flex-col">
      <div className="flex flex-col align-center justify-center">
        <h1 className="text-8xl text-center font-caveat font-extrabold text-black mt-4 tracking-tighter">
          {t("cardThree.title")}
        </h1>
        <h2 className="text-black text-3xl text-center mt-10 align-center">
          {t("cardThree.subtitle")}
        </h2>
        <Image
          className="h-[60%] w-[60%] mt-10 m-auto"
          src={qr}
          alt="example"
        />
      </div>
    </div>
  );

  const feature_4 = (
    <div className="bg-white flex align-center xl:flex-row p-12 m-14 rounded-2xl flex-col">
      <div className="flex flex-col align-center justify-center">
        <h1 className="text-8xl text-center font-caveat font-extrabold text-black mt-4 tracking-tighter">
          {t("cardFour.title")}
        </h1>
        <h2 className="text-black text-3xl text-center mt-10 align-center">
          {t("cardFour.subtitle")
            .split(t("cardFour.bolden"))
            .map((part, index) =>
              index === 0 ? (
                part
              ) : (
                <strong key={index}>{t("cardFour.bolden")}</strong>
              )
            )}
        </h2>
        <Image
          className="mt-8 rounded-2xl h-[55%] w-[45%] m-auto"
          src={dana}
          alt="example"
        />
      </div>
    </div>
  );

  return (
    <div className="w-[1600px] h-[1000px]">
      <Swiper
        theme="dark"
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        style={{
          "--swiper-navigation-color": "#FFF",
          "--swiper-navigation-size": "75px",
        }}
      >
        <SwiperSlide>
          <div className="flex justify-center items-center h-[1000px] mr-20 ml-20">
            <Card children={feature_1} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center h-[1000px] mr-20 ml-20">
            <Card children={feature_2} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center h-[1000px] mr-20 ml-20">
            <Card children={feature_3} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center h-[1000px] mr-20 ml-20">
            <Card children={feature_4} />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

