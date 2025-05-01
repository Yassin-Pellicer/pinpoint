"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EventDate from "../ui/date";
import { useMapContext } from "../../utils/context/ContextMap";
import { useEvent } from "../../utils/context/ContextEvent";
import { useRouter } from "next/navigation";

export default function SwiperComponent({events}) {
  const { setEvent } = useEvent();
  const { setSelectedEvent } = useMapContext();
  const router = useRouter();

  const handleEditEvent = (event) => {
  router.push("/pages/create")
   setEvent(event);
  }

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
        {events?.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="flex select-none cursor-pointer">
              <div className="flex flex-col bg-blue-500 items-center rounded-b-2xl w-full p-4 mb-9 text-white hover:bg-blue-600 transition-colors duration-250">
                <div
                  className="flex h-[350px] flex-col"
                  onClick={(e) => {
                    setSelectedEvent(event);
                    e.stopPropagation();
                  }}
                >
                  {event.banner && (
                    <div className="w-full h-full overflow-hidden rounded-t-2xl">
                      <img
                        src={event.banner}
                        alt=""
                        className="object-cover w-full h-full"
                      />
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
                <button
                  onClick={() => handleEditEvent(event)}
                  className="mt-4 w-[98%] font-extrabold font-white p-1 hover:bg-blue-400 rounded-2xl border-[1px] border-white transition duration-100"
                >
                  Editar Evento
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

