"use client";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useTranslations } from "next-intl";
import CommentBox from "../comments/commentBox";
import CpList from "./mainCheckpointList";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import EventTimeDisplay from "../ui/date";

import Quill from "react-quill";
import InscribedBox from "../ui/main/mainInscriptionBox";
import BookmarkBox from "../ui/main/mainBookmarkBox";
import { useMapContext } from "../../utils/context/ContextMap";
import { useSession } from "../../utils/context/ContextSession";
import { useEvent } from "../../utils/context/ContextEvent";
import { useRouter } from "next/navigation";

const eventInfo = ({open, setOpen}) => {
  {/* CONTEXTS */}
  const { selectedEvent, setSelectedEvent } = useMapContext();
  const { checkpoints } = useCheckpoints();
  const { user } = useSession();
  const { setEvent } = useEvent();

  const router = useRouter();

  {/* TRANSLATIONS */}
  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const handleEditEvent = (event) => {
    setEvent(event);
    router.push("/pages/create")
   }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      variant="persistent"
      PaperProps={{
        style: {
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          backgroundColor: "#3F7DEA",
          height: "100vh",
          padding: "1.5rem",
          paddingTop: "0rem",
          minWidth: "550px",
          maxWidth: "550px",
          zIndex: 20,
        },
      }}
    >
      {selectedEvent && (
        <div className="mb-6 mt-6 rounded-2xl bg-white p-4">
          <button
            onClick={() => {
              setOpen(false);
              setTimeout(() => {
                setSelectedEvent(null);
              }, 300);
            }}
            className="bg-blue-500 w-full h-fit  rounded-t-2xl"
          >
            <i className="material-icons text-white text-3xl">
              keyboard_arrow_down
            </i>
          </button>

          <div className="relative justify-center w-full">
            {selectedEvent.banner ? (
              <div className="relative flex justify-end items-center w-full h-15 overflow-hidden border-t border-x border-gray-400">
                <img
                  src={selectedEvent.banner}
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
              selectedEvent.banner ? "rounded-b-2xl" : "rounded-2xl"
            }  p-6 bg-blue-500 text-white cursor-default transition`}
          >
            <div className="flex flex-row ">
              <div className="flex flex-row w-full">
                <h1
                  className={`text-3xl tracking-tighter font-extrabold mb-2 text-white ${
                    selectedEvent.banner ? "" : "pt-12"
                  }`}
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {selectedEvent.name}
                </h1>
              </div>
            </div>
            <p className="flex text-xs items-center w-[70%] mb-2">
              {selectedEvent.rating != null ? selectedEvent.address : ""}
            </p>
            <div className="flex flex-row justify-between">
              <div className="flex flex-end align-center items-center">
                {selectedEvent.rating != null && (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i
                        key={i}
                        className={`material-icons text-white text-sm ${
                          i <= Math.floor(selectedEvent.rating)
                            ? "star"
                            : i - 0.5 === selectedEvent.rating
                            ? "star_half"
                            : "star_border"
                        }`}
                      >
                        {i <= Math.floor(selectedEvent.rating)
                          ? "star"
                          : i - 0.5 === selectedEvent.rating
                          ? "star_half"
                          : "star_border"}
                      </i>
                    ))}
                    <p className="text-white text-sm ml-2 italic tracking-tighter">
                      {selectedEvent.rating}
                    </p>
                  </>
                )}
                {selectedEvent.rating === null && (
                  <p className="flex text-xs items-center pr-10">
                    {selectedEvent.address}
                  </p>
                )}
              </div>
              <div className="flex flex-row gap-2">
                {!selectedEvent.isPublic ? (
                  <div className="flex items-center text-lñg">
                    <i className="material-icons text-md">public</i>
                  </div>
                ) : (
                  <div className="flex items-center text-sm">
                    <i className="material-icons text-md">lock</i>
                  </div>
                )}
                {selectedEvent.qr ? (
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
            {selectedEvent.author === user.id && (
              <button
                onClick={() => handleEditEvent(selectedEvent)}
                className="mt-4 w-full font-extrabold font-white p-1 hover:bg-blue-400 rounded-2xl border-[1px] border-white transition duration-100"
              >
                Editar Evento
              </button>
            )}
          </div>

          {selectedEvent.end && (
            <EventTimeDisplay event={selectedEvent} listMode={false} />
          )}

          <InscribedBox event={selectedEvent}></InscribedBox>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <BookmarkBox event={selectedEvent}></BookmarkBox>

            <div className="h-auto rounded-2xl bg-green-400 relative hover:cursor-pointer hover:bg-green-500 transition duration-100">
              <div className="relative h-full">
                <div
                  className="bg-no-repeat bg-center bg-cover absolute right-0 top-[-50px] bottom-0 w-1/2 transform"
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

            {selectedEvent.description && (
              <div
                className="p-6 bg-gray-200 cursor-default overflow-hidden transition"
                onClick={() => {
                  navigator.clipboard.writeText(selectedEvent.description);
                }}
              >
                <Quill
                  value={selectedEvent.description}
                  readOnly={true}
                  theme="bubble"
                  modules={{
                    toolbar: false,
                  }}
                />
              </div>
            )}
          </div>

          {selectedEvent.tags.length > 0 && (
            <div className="h-auto rounded-b-2xl bg-gray-200 pb-6 px-6 pt-3 relative transition duration-100 overflow-hidden">
              <div>
                <div className="flex flex-wrap w-full gap-2">
                  {selectedEvent.tags.map((tag) => (
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
    </SwipeableDrawer>
  );
};

export default eventInfo;
