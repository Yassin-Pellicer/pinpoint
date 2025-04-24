"use client";

import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEvent } from "../../utils/context/ContextEvent";
import EventDate from "../ui/date";
import { getInscriptionHook } from "../../hooks/main/getInscriptionHook";
import { useSessionContext } from "../../utils/context/ContextSession";
import { addInscriptionHook } from "../../hooks/main/addInscriptionHook";
import { deleteInscriptionHook } from "../../hooks/main/deleteInscriptionHook";
import { Alert, Button, Snackbar } from "@mui/material";
export default function SwiperComponent( {event} ) {
  const [isInscribed, setIsInscribed] = useState(null);
  const { id } = useSessionContext();
  const { setSelectedEvent } = useEvent();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    setIsInscribed(null);
      getInscriptionHook(event.id).then((response) => {
        if (response) {
          const users = response?.inscriptions?.map((i) => i.user);
          setIsInscribed(users?.includes(id));
        }
      });
  }, []);

  const handleUploadInscription = async () => {
    const response = await addInscriptionHook(event.id, id);
    setSnackbarMessage("Te has inscrito correctamente!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    
    setIsInscribed(true);
  };

  const handleDeleteInscription = async () => {
    const response = await deleteInscriptionHook(event.id, id);
    setSnackbarMessage("Te has desinscrito correctamente!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    
    setIsInscribed(false);
  };

  return (
    <>
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
      <div className="bg-blue-500 w-full h-fit flex items-center align-center hover:bg-blue-600 flex-row p-4 border-t-[3px] border-dashed  text-white">
        {event.banner && (
          <div className="overflow-hidden bg-white rounded-full w-[100px] h-[80px]">
            <img
              src={event.banner}
              alt="example"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col pl-5 w-full">
          <div
            onClick={(e) => {
              setSelectedEvent(event);
              e.stopPropagation();
            }}
            className="flex flex-row justify-between items-center"
          >
            <h1 className="font-bold text-md pr-5 tracking-tight">
              {event.name}
            </h1>
          </div>
          <div className="flex flex-row justify-between align-center items-center w-full">
            <p className="text-xs w-full">{event.address}</p>
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

          {/* <div className="flex flex-row justify-end items-center w-full">
            {isInscribed ? (
              <button
                onClick={handleDeleteInscription}
                className="w-full font-extrabold font-white p-1 hover:bg-red-500 mt-2 rounded-2xl border-[1px] border-white transition duration-100"
              >
                Desinscribirme
              </button>
            ) : (
              <button
                onClick={handleUploadInscription}
                className="w-full font-extrabold font-white p-1 hover:bg-green-600 mt-2 rounded-2xl border-[1px] border-white transition duration-100"
              >
                Inscribirme
              </button>
            )}
          </div> */}
          
          {event.start && event.end && (
            <EventDate selectedEvent={event} listMode={true} />
          )}
        </div>
      </div>
    </>
  );
}