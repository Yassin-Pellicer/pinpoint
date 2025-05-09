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
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import EventTimeDisplay from "../../../../components/ui/date";
import BookmarkBox from "../../../../components/ui/main/mainBookmarkBox";
import InscribedBox from "../../../../components/ui/main/mainInscriptionBox";
import CommentBox from "../../../../components/comments/commentBox";
import CpList from "../../../../components/main/mainCheckpointList";
import { getEventById } from "../../../../hooks/main/get/getEventsHook";

const eventInfo = ({open, setOpen}) => {
  const { selectedEvent, setSelectedEvent, setEditMode } = useMapContext();
  const { checkpoints } = useCheckpoints();
  const { user } = useSession();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  const params = useParams();
  const router = useRouter();

  const eventId = params.id;

  useEffect(() => {
    setLoading(true);
    getEventById(Number(eventId))
      .then((response) => {
        setSelectedEvent(response.event);
        setEvent(response.event);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  {/* TRANSLATIONS */}
  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const handleEditEvent = (event) => {
    setEvent(event);
    setEditMode(true);
    router.push("/create")
   }

  return (
    <>
      {event && (
        <div>
          <button
            onClick={() => {
              router.back();
            }}
            className="bg-blue-400 w-full h-fit sticky top-0 z-50"
          >
            <i className="material-icons text-white text-3xl">
              keyboard_arrow_down
            </i>
          </button>

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

          <div
            className={`${
              event.banner ? "rounded-b-2xl" : "rounded-2xl"
            }  p-6 bg-blue-500 text-white cursor-default transition`}
          >
            <div className="flex flex-row ">
              <div className="flex flex-row w-full">
                <h1
                  className={`text-3xl tracking-tighter font-extrabold mb-2 text-white ${
                    event.banner ? "" : "pt-12"
                  }`}
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {event.name}
                </h1>
              </div>
            </div>
            <p className="flex text-xs items-center w-[70%] mb-2">
              {event.rating != null ? event.address : ""}
            </p>
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
                  <p className="flex text-xs items-center pr-10">
                    {event.address}
                  </p>
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
                  setTimeout(() => {
                    handleEditEvent(event);
                  }, 1000);
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

          {event.end && (
            <EventTimeDisplay event={event} listMode={false} />
          )}

          <InscribedBox event={event}></InscribedBox>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <BookmarkBox event={event}></BookmarkBox>

            <div className="h-auto rounded-2xl bg-green-400 relative hover:cursor-pointer hover:bg-green-500 transition duration-100">
              <div className="relative h-full">
                <div
                  className="bg-no-repeat bg-center bg-cover absolute right-2 top-[-50px] bottom-0 w-1/2 transform"
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

          <div className=" mt-4 overflow-hidden">
            <div className="h-auto rounded-t-2xl bg-gray-300 relative transition duration-100 overflow-hidden">
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
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      info
                    </i>
                    <h1
                      className="text-2xl tracking-tighter font-bold text-white"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      Más Información
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {event.description && (
              <div
                className="p-6 bg-gray-200 cursor-default overflow-hidden transition"
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
            <div className="h-auto rounded-b-2xl bg-gray-200 pb-6 px-6 pt-3 relative transition duration-100 overflow-hidden">
              <div>
                <div className="flex flex-wrap w-full gap-2">
                  {event.tags.map((tag) => (
                    <div
                      key={tag.tag_id}
                      className={`rounded-full w-fit px-2 py-1 text-center
                          text-white bg-[#3F7DEA] font-bold tracking-tight"
                          }`}
                    >
                      <p className="text-xs">{tagsTrans(`${tag.tag_id}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {checkpoints && checkpoints.length > 0 && (
            <>
              <div className="h-auto rounded-t-2xl bg-blue-300 mt-4 relative transition duration-100 overflow-hidden">
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
              <div className="mb-4">
                <CpList />
              </div>
            </>
          )}

          <div className="mt-4"></div>
          <CommentBox></CommentBox>
        </div>
      )}
    </>
  );
};

export default eventInfo;
