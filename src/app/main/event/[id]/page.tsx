"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMapContext } from "../../../../utils/context/ContextMap";
import { useCheckpoints } from "../../../../utils/context/ContextCheckpoint";
import { useSession } from "../../../../utils/context/ContextSession";
import { useEvent } from "../../../../utils/context/ContextEvent";
import { useParams } from "next/navigation";

import Quill from "react-quill";
import EventTimeDisplay from "../../../../components/ui/date";
import BookmarkBox from "../../../../components/ui/main/mainBookmarkBox";
import InscribedBox from "../../../../components/ui/main/mainInscriptionBox";
import CommentBox from "../../../../components/comments/commentBox";
import CpList from "../../../../components/main/mainCheckpointList";
import { getEventById } from "../../../../hooks/main/get/getEventsHook";
import { getUserHook } from "../../../../hooks/general/getUserHook";
import Banner from "../../../../components/profile/banner";
import { Tag } from "../../../../utils/classes/Tag";
import { getPermission } from "../../../../hooks/general/privateEventsHook";

const eventInfo = () => {
  const { setSelectedEvent, setEditMode, selectedEvent } = useMapContext();
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { user } = useSession();

  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const { setEvent } = useEvent();
  const [event, setCurrentEvent] = useState(null);
  const [author, setAuthor] = useState(null);

  const params = useParams();
  const router = useRouter();

  const eventId = params.id;

  useEffect(() => {
    setLoadingEvent(true);
    getPermission(Number(eventId)).then((response) => {
      if(!response.result) {
        router.push("/main/home");
        return;
      }
      getEventById(Number(eventId)).then((finalEvent) => {
        getUserHook(finalEvent.event.author).then((user) => {
          setSelectedEvent(finalEvent.event);
          setEvent(finalEvent.event);
          setCurrentEvent(finalEvent.event);
          setLoadingEvent(false);    
          setAuthor(user.user);
        })
      });    
    })
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
            {event.banner ? (
              <div className="relative flex justify-end items-center w-full h-15 overflow-hidden border-t border-x border-gray-400">
                <img
                  src={event.banner}
                  className="w-full h-full object-cover"
                  alt="banner"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="p-6 bg-blue-500 text-white cursor-default transition">
            <div className="flex flex-row ">
              <div className="flex flex-row w-full">
                <h1
                  className={`text-3xl tracking-tighter font-extrabold mb-2 text-white ${
                    event.banner ? "" : ""
                  }`}
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

            {event.author === user?.id && (
              <button
                onClick={() => {
                  setLoading(true);
                  setEvent(event);
                  setCheckpoints(checkpoints);
                  setEditMode(true);
                  router.push("/create");
                }}
                className="mt-4 w-full font-extrabold text-white p-1 hover:bg-blue-400 rounded-2xl border-[1px] border-white transition duration-100 flex justify-center items-center h-10"
              >
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-4 border-white border-t-transparent rounded-full"></div>
                ) : (
                  "Editar Evento"
                )}
              </button>
            )}
          </div>
          {event.end && <EventTimeDisplay event={event} listMode={false} />}
          <InscribedBox event={event}></InscribedBox>
          <div className="grid grid-cols-2">
            {user != null && <BookmarkBox event={event}></BookmarkBox>}

            <div className="h-auto bg-green-400 relative hover:cursor-pointer hover:bg-green-600 transition duration-100">
              <div className="relative h-full">
                <div
                  className="bg-no-repeat bg-center bg-cover absolute top-[-50px] right-2 bottom-0 w-1/2 transform select-none pointer-events-none"
                  style={{
                    backgroundImage: "url('/img/printer.png')",
                    transform: "rotate(5deg)",
                  }}
                ></div>
                <div className="relative z-10 p-5">
                  <h1
                    className="text-2xl tracking-tighter font-bold mb-2 text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Imprimir evento
                  </h1>
                  <p
                    className="text-sm tracking-tighter font-bold text-white"
                    style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
                  >
                    Imprime el evento con un estilo atractivo y conveniente, o
                    descárgalo como PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="h-auto bg-white relative transition duration-100 overflow-hidden border-b-[1px] border-gray-300">
              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center ">
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
          {event.tags.length > 0 && (
            <div className="h-auto bg-white px-6 py-5 relative transition duration-100 border-t-[1px] border-gray-300 overflow-hidden">
              <div>
                <div className="flex flex-wrap w-full gap-2">
                  {event.tags.map((tag) => (
                    <div
                      key={tag.tag_id}
                      className={`rounded-full w-fit px-2 py-1 text-center select-none text-white bg-[#3F7DEA] font-bold tracking-tight"}`}
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
          {checkpoints && checkpoints.length > 0 && (
            <>
              <div className="h-auto bg-blue-300 relative transition duration-100 overflow-hidden">
                <div className="relative h-full">
                  <div
                    className="bg-no-repeat bg-center bg-cover absolute right-0 top-0 bottom-0 w-1/2 h-3/4 transform rotate-[5deg] z-0 m-5"
                    style={{
                      backgroundImage: "url('/img/recommended.png')",
                    }}
                  ></div>

                  <div className="relative p-5 z-10">
                    <div className="flex flex-row items-center">
                      <i
                        className="material-icons text-white text-4xl mr-2"
                        style={{
                          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        tour
                      </i>
                      <h1
                        className="text-2xl tracking-tighter font-bold text-white"
                        style={{
                          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        Checkpoints
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <CpList />
            </>
          )}{" "}
          <div className="h-auto bg-white relative transition duration-100 overflow-hidden border-[1px] border-gray-300">
            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center ">
                <h1 className="text-2xl tracking-tighter font-bold text-black">
                  Evento creado por...
                </h1>
              </div>
            </div>
          </div>
          <Banner userProp={author}></Banner>
          <CommentBox></CommentBox>
        </div>
      )}
    </>
  );
};

export default eventInfo;
