"use client";
export const dynamic = 'force-dynamic';

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMapContext } from "../../../../../utils/context/ContextMap";
import { useCheckpoints } from "../../../../../utils/context/ContextCheckpoint";
import { useSession } from "../../../../../utils/context/ContextSession";
import { useEvent } from "../../../../../utils/context/ContextEvent";
import { useParams } from "next/navigation";

import Quill from "react-quill";
import CpList from "../../../../../components/main/mainCheckpointList";
import { getEventById } from "../../../../../hooks/main/get/getEventsHook";
import { Tag } from "../../../../../utils/classes/Tag";
import { getPermission } from "../../../../../hooks/general/privateEventsHook";
import { QRCode } from "react-qrcode-logo";
import { getCheckpointByCode } from "../../../../../hooks/main/get/getCheckpointByCodeHook";
import { Checkpoint } from "../../../../../utils/classes/Checkpoint";

const EventInfo = () => {
  const { setSelectedEvent, setEditMode } = useMapContext();
  const [loadingEvent, setLoadingEvent] = useState(true);
  const { setEvent } = useEvent();
  const [event, setCurrentEvent] = useState(null);
  const {checkpoints} = useCheckpoints();

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const eventId = params.id;
  const qr = params.cp;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingEvent(true);

      try {
        const response = await getPermission(Number(eventId));
        if (!response.result) {
          router.push("/main/home");
          return;
        }

        const finalEvent = await getEventById(Number(eventId));
        setSelectedEvent(finalEvent.event);
        setEvent(finalEvent.event);
        setCurrentEvent(finalEvent.event);

      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchData();
  }, []);

  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const formatDisplay = (date) => {
    return date.toLocaleString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {(!event || loadingEvent) && (
        <div className="flex flex-col">
          <div className="bg-gray-300 w-full h-[350px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
          </div>
          <div className="bg-blue-500 w-full h-[200px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
          </div>
          <div className="bg-purple-500 w-full h-[150px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
          </div>
          <div className="bg-yellow-500 w-full h-[150px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
          </div>
          <div className="grid grid-cols-2">
            <div className="bg-blue-500 w-full h-[150px] flex flex-col p-4 items-center justify-center text-white">
              <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
            </div>
            <div className="bg-green-400 w-full h-[150px] flex flex-col p-4 items-center justify-center text-white">
              <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
            </div>
          </div>
          <div className="bg-gray-300 w-full h-[800px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[150px] w-[150px] border-b-4 border-white"></div>
          </div>
        </div>
      )}

      {!loadingEvent && event && (
        <div>
          <div className="relative justify-center w-full">
            {event.banner && (
              <div className="relative flex justify-end items-center w-full h-15 overflow-hidden border-t border-x border-gray-400">
                <img
                  src={event.banner}
                  className="w-full h-full object-cover"
                  alt="banner"
                />
              </div>
            )}
          </div>
          <div className="p-6 bg-blue-500 text-white cursor-default transition">
            <div className="flex flex-row">
              <div className="flex flex-row w-full">
                <h1
                  className="text-3xl tracking-tighter font-extrabold mb-2 text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {event.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center mb-2">
              {event.rating != null && (
                <div className="flex items-center mb-2">
                  <div className="flex flex-col gap-4">
                    {event.date && (
                      <p className="text-white font-bold text-2xl tracking-tighter">
                        Este evento tendrá lugar el{" "}
                        {formatDisplay(new Date(event.date))}
                      </p>
                    )}
                    <p className="flex text-md items-center pr-10">
                      {event.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-end align-center items-center">
                {event.rating != null && (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i
                        key={i}
                        className={`material-icons text-white text-sm ${i <= Math.floor(event.rating)
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
                    <p className="text-white text-sm ml-2 italic tracking-tighter">
                      {event.rating}
                    </p>
                  </>
                )}
                {event.rating === null && (
                  <div className="flex items-center mb-2">
                    <div className="flex flex-col">
                      {event.date && (
                        <p className="text-white font-bold text-2xl tracking-tighter">
                          Este evento tendrá lugar el{" "}
                          {formatDisplay(new Date(event.date))}
                        </p>
                      )}
                      <p className="flex text-md items-center pr-10">
                        {event.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row gap-2">
                {!event.isPublic ? (
                  <div className="flex items-center text-sm">
                    <i className="material-icons text-md">public</i>
                  </div>
                ) : (
                  <div className="flex items-center text-sm">
                    <i className="material-icons text-md">lock</i>
                  </div>
                )}
                {event.qr ? (
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

          <div className="rounded-3xl border-blue-500 border-4 items-center p-4 mx-8 my-4 mt-8 flex justify-center">
            <div className="w-full max-w-[400px]">
              <QRCode
                value={`${process.env.NEXT_PUBLIC_BASEURL}${pathname}`}
                size={400}
                style={{ width: "100%", height: "auto" }}
                qrStyle="fluid"
                logoImage="/svg/logo_btn.svg"
                logoWidth={125}
                logoHeight={50}
              />
            </div>
          </div>

{checkpoints.length > 0 && (
              <div className="flex flex-col mt-4 px-4">
                <div className="flex flex-row">
                  <div className="flex items-center justify-center w-12 mr-4 h-12 bg-blue-400 shrink-0 text-white rounded-full cursor-pointer">
                    <h1 className="flex text-xl font-extrabold cursor-pointer">
                      {checkpoints[0].order}
                    </h1>
                  </div>
                  <div className="max-w-[300px] cursor-pointer">
                    <h1 className="font-bold break-words">{checkpoints[0].name}</h1>
                    {checkpoints[0].marker && checkpoints[0].marker.position && (
                      <p className="flex text-xs items-center">
                        <span className="material-icons text-sm mr-2">location_on</span>
                        {checkpoints[0].marker.position[0]},{" "}
                        {checkpoints[0].marker.position[1]}
                      </p>
                    )}
                    {checkpoints[0].address && (
                      <p className="flex text-xs items-center">
                        <span className="material-icons text-sm mr-2">location_city</span>
                        {checkpoints[0].address}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto">
                    <p className="material-icons text-2xl">tour</p>
                  </div>
                </div>

                {(checkpoints[0].banner || checkpoints[0].description) && (
                  <div className="mt-2 w-full pl-5 h-fit m-auto flex flex-row">
                    <div className="w-2 min-h-full pl-1 bg-blue-400 rounded-l-md mr-3"></div>
                    <div className="flex flex-col pl-4">
                      <div className="overflow-auto flex flex-col px-3 w-full">
                        <div className="flex flex-col justify-center">
                          <label className="w-full mt-2">
                            {checkpoints[0].banner && (
                              <div className="cursor-pointer relative flex justify-end items-center w-full h-15 mb-2 rounded-2xl overflow-hidden">
                                <img
                                  src={checkpoints[0].banner}
                                  className="w-full h-full object-cover rounded-xl"
                                  alt="banner"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                      <form className="flex flex-col px-3 w-full">
                        {checkpoints[0].banner && (
                          <h1 className="font-bold text-2xl mb-2">{checkpoints[0].name}</h1>
                        )}
                        <div className="flex flex-col mb-4">
                          <Quill
                            key={checkpoints[0].id}
                            value={checkpoints[0].description}
                            readOnly={true}
                            theme="bubble"
                            modules={{ toolbar: false }}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

          <div className="overflow-hidden">
            <div className="h-auto bg-white relative transition duration-100 overflow-hidden border-b-[1px] border-gray-300">
              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center">
                  <h1 className="text-2xl tracking-tighter font-bold text-black">
                    Más Información
                  </h1>
                </div>
              </div>
            </div>

            

            {event.description && (
              <div
                className="p-6 bg-white cursor-default overflow-hidden transition"
                onClick={() => {
                  navigator.clipboard.writeText(event.description);
                }}
              >
                <Quill
                  value={event.description}
                  readOnly={true}
                  theme="bubble"
                  modules={{
                    toolbar: false,
                  }}
                />
              </div>
            )}
          </div>
          {event.tags && event.tags.length > 0 && (
            <div className="h-auto bg-white px-6 py-5 relative transition duration-100 border-t-[1px] border-gray-300 overflow-hidden">
              <div>
                <div className="flex flex-wrap w-full gap-2">
                  {event.tags.map((tag) => (
                    <div
                      key={tag.tag_id}
                      className="rounded-full w-fit px-2 py-1 text-center select-none text-white bg-[#3F7DEA] font-bold tracking-tight"
                    >
                      <p className="text-xs">
                        <i className="material-icons text-xs mr-1">
                          {Tag.tags.find((ot) => ot.tag_id === tag.tag_id)
                            ?.icon || tag.icon}
                        </i>
                        {tagsTrans(`${tag.tag_id}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventInfo;