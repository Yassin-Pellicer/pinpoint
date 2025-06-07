"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EventDate from "../ui/date";
import { useMapContext } from "../../utils/context/ContextMap";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SwiperComponent({ events }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const swiperRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const startProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    setProgress(0);
    
    const totalDuration = 5000; // ms
    const intervalTime = 100; // ms
    const increment = (100 * intervalTime) / totalDuration; // = 2
  
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  };

  const handleUserInteraction = () => {
    setUserInteracted(true);
    setIsAutoplayActive(false);
    stopProgress();
    
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      setUserInteracted(false);
      setIsAutoplayActive(true);
      
      if (swiperRef.current && swiperRef.current.autoplay) {
        swiperRef.current.autoplay.start();
      }
      
      startProgress();
    }, 3000);
  };

  useEffect(() => {
    if (!events || events.length === 0) return;

    if (isAutoplayActive && !userInteracted) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentSlide, events, isAutoplayActive, userInteracted]);

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.activeIndex);
    if (isAutoplayActive && !userInteracted) {
      startProgress();
    }
  };

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        spaceBetween={25}
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ 
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSlideChange={handleSlideChange}
        onTouchStart={handleUserInteraction}
        onSliderMove={handleUserInteraction}
      >
        {events?.map((event) => (
          <SwiperSlide key={event.id}>
            <div
              className="flex justify-center items-center select-none cursor-pointer"
              onClick={(e) => {
                router.push("/main/event/" + event.id);
                e.stopPropagation();
              }}
            >
              <div className="bg-blue-500 w-full h-[400px] flex flex-col p-4 mb-9  text-white hover:bg-blue-600 transition-colors duration-250">
                {event.banner && (
                  <div className="flex items-center justify-center overflow-hidden rounded-t-2xl">
                    <img src={event.banner} alt="" className="w-full " />
                  </div>
                )}
                <div className="flex flex-row pt-4 ">
                  <div className="flex flex-row w-full">
                    <h1 className="font-bold text-2xl tracking-tighter pr-5 ">
                      {event.name}
                    </h1>
                  </div>
                </div>
                <p className="flex text-xs items-center w-[70%]">
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
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Progress Bar */}
      <div className="w-full bg-gray-200 h-1 mb-4 rounded-full overflow-hidden">
        <div 
          className={`bg-blue-500 h-full rounded-full transition-all duration-100 ease-linear ${
            isAutoplayActive && !userInteracted ? '' : 'opacity-50'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}