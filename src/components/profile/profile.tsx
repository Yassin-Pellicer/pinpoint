"use client";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useSession } from "../../utils/context/ContextSession";

import EventCarousel from "./profileEventCarousel";
import EventBookmarkList from "./eventBookmarkList";
import EventInscriptions from "./eventInscriptionList";
import Banner from "../ui/banner";

const profile = ({open, setOpen}) => {

  const { 
    inscriptions,
    bookmarks,
    createdEvents,
  } = useSession();

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
          zIndex: 10,
        },
      }}
    >
      <div className="mt-6 rounded-2xl bg-white p-6">
        <button
          onClick={() => { setOpen(false) }}
          className="bg-blue-500 w-full h-fit  rounded-t-2xl"
        >
          <i className="material-icons text-white text-3xl">keyboard_arrow_down</i>
        </button>

        <Banner></Banner>

        <div className=" mt-4">
          <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
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
                    className="material-icons text-white text-3xl mr-5"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    star
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold mb-2 text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Eventos creados por ti
                  </h1>
                </div>
                <p
                  className="text-sm tracking-tighter font-bold text-white"
                  style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
                >
                  Revisa y edita los eventos que has creado.
                </p>
              </div>
            </div>
          </div>
          <EventCarousel events={createdEvents} />
        </div>

        <div className=" mt-4">
          <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center">
                  <i
                    className="material-icons text-white text-3xl mr-5"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    list
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Tus inscripciones
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <EventInscriptions events={inscriptions} />
          </div>
        </div>

        <div className=" mt-4">
          <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center">
                  <i
                    className="material-icons text-white text-3xl mr-5"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    bookmark
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Eventos Guardados
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <EventBookmarkList events={bookmarks} />
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default profile;
