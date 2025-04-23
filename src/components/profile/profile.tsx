
"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useTranslations } from "next-intl";
import { useEvent } from "../../utils/context/ContextEvent";
import CommentBox from "../comments/commentBox";
import { useSessionContext } from "../../utils/context/ContextSession";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { addInscriptionHook }from "../../hooks/main/addInscriptionHook";
import { Alert, Snackbar } from "@mui/material";
import { getInscriptionHook } from "../../hooks/main/getInscriptionHook";
import { deleteInscriptionHook } from "../../hooks/main/deleteInscriptionHook";
import { getEventById } from "../../hooks/main/getEventById";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

import { format } from "date-fns";
import { es } from "date-fns/locale";
import EventCarousel from "../main/eventCarousel";
import EventCarouselList from "../main/eventCarouselList";

const profile = ({open, setOpen}) => {
  const { selectedEvent, setSelectedEvent, tags, marker, setEvents, events } = useEvent();
  const { id, username } = useSessionContext();
  const { checkpoints } = useCheckpoints();
  const [isInscribed, setIsInscribed] = useState(null);
  const [inscriptions, setInscriptions] = useState(selectedEvent?.inscriptions || 0);
  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            snackbarSeverity as "error" | "success" | "info" | "warning"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
        <button
          onClick={() => setOpen(false)}
          className="bg-blue-500 p-2 text-white"
        >
          close
        </button>
        <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
          <div className="flex flex-col items-center justify-center">
            {/* Profile Picture Circle */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 mb-4">
              <img
                src="/api/placeholder/150/150"
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Tag */}
            <h2 className="text-xl font-bold text-blue-600 mb-1">@username</h2>

            {/* User Email */}
            <p className="text-gray-600">user@example.com</p>
          </div>
        </div>

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
          {events.length === 0 && (
            <>
              <div className="bg-blue-500 rounded-b-2xl w-full h-[350px] flex flex-col p-4 mb-9 items-center align-center justify-center text-white">
                <div className="animate-spin rounded-full h-[150px] w-[150px] border-b-4 border-white p4"></div>
              </div>
            </>
          )}
          <EventCarousel events={events} />
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
          {events.length === 0 && (
            <>
              <div className="bg-blue-500 rounded-b-2xl w-full h-[350px] flex flex-col p-4 mb-9 items-center align-center justify-center text-white">
                <div className="animate-spin rounded-full h-[150px] w-[150px] border-b-4 border-white p4"></div>
              </div>
            </>
          )}
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
          {events.length === 0 && (
            <>
              <div className="bg-blue-500 rounded-b-2xl w-full h-[350px] flex flex-col p-4 mb-9 items-center align-center justify-center text-white">
                <div className="animate-spin rounded-full h-[150px] w-[150px] border-b-4 border-white p4"></div>
              </div>
            </>
          )}
          <EventCarouselList events={events} />
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default profile;
