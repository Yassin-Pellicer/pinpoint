"use client";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
// Remove the direct import and use dynamic import instead
// import CreateEvent from "../../components/create/createEvent";

import { useMapContext } from "../../utils/context/ContextMap";

import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // Add this import
import LoadingScreen from "../../components/ui/loadingScreen";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import createTypography from "@mui/material/styles/createTypography";
import { useSession } from "../../utils/context/ContextSession";
import { useEvent } from "../../utils/context/ContextEvent";
import { Event } from "../../utils/classes/Event";

// Dynamically import CreateEvent with no SSR
const DynamicCreateEvent = dynamic(
  () => import("../../components/create/createEvent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading event creator...</p>
        </div>
      </div>
    ),
  }
);

export default function Create() {
  const { location, editMode, setEditMode } = useMapContext();
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { setCreateType, createType } = useSession();
  const { setEvent, setDate, event } = useEvent();

  const [selectedButton, setSelectedButton] = useState("simple");

  useEffect(() => {
    const storedEvent = localStorage.getItem("event");
    const storedCheckpoints = localStorage.getItem("checkpoints");

    if (storedEvent) {
      try {
        setEvent(JSON.parse(storedEvent));
        if (storedEvent && JSON.parse(storedEvent).creationtime) {
          setEditMode(true);
        }
      } catch (error) {
        console.error("Failed to parse stored event:", error);
        if (!editMode) setEvent(new Event());
      }
    } else if (!editMode) {
      setEvent(new Event());
    }

    if (storedCheckpoints) {
      try {
        setCheckpoints(JSON.parse(storedCheckpoints));
      } catch (error) {
        console.error("Failed to parse stored checkpoints:", error);
        setCheckpoints([]);
      }
    } else {
      setCheckpoints([]);
    }
  }, []);

  // Separate effect to respond to updated checkpoints
  useEffect(() => {
    if (!checkpoints || checkpoints.length === 0) {
      setSelectedButton("simple");
      setCreateType("simple");
    } else {
      setSelectedButton("checkpoints");
      setCreateType("checkpoints");
    }
  }, [checkpoints]);

  const t = useTranslations("Create");

  return (
    <div className="flex flex-col">
      {/* Event type */}
      {!editMode && (
        <>
          <div className="h-auto bg-white border-b-[1px] border-gray-300">
            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center ">
                <h1 className="text-2xl tracking-tighter font-bold text-black">
                  Elige el tipo de evento
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white p-6 border-b-[1px] border-gray-300">
            <div className="flex justify-between flex-row">
              <button
                className={` border border-black  rounded-2xl p-2 hover:bg-blue-500
                 hover:border-blue-500 hover:text-white transition-colors duration-100 font-bold tracking-tighter text-md ${
                   selectedButton === "simple"
                     ? "bg-blue-500 border-blue-500 text-white "
                     : "bg-transparent text-black"
                 }`}
                onClick={() => {
                  if (selectedButton === "simple") return;
                  setSelectedButton("simple");
                  setCreateType("simple");
                }}
              >
                {t("simple")}
              </button>
              <button
                className={`border border-black rounded-2xl p-2 hover:bg-blue-500
                 hover:border-blue-500 hover:text-white transition-colors duration-100 font-bold tracking-tighter text-md ${
                   selectedButton === "checkpoints"
                     ? " bg-blue-500 border-blue-500 text-white "
                     : "bg-transparent text-black"
                 }`}
                onClick={() => {
                  if (selectedButton === "checkpoints") return;
                  setSelectedButton("checkpoints");
                  setCreateType("checkpoints");
                }}
              >
                {t("course")}
              </button>
            </div>
            <p className="text-sm mt-4">
              {t.rich("description", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
          </div>
        </>
      )}

      {editMode && (
        <div className="flex flex-col border-b border-gray-300 border-[1px]">
          <h1 className="font-bold text-white bg-green-700 p-4 text-3xl tracking-tight ">
            Estás en modo edición
          </h1>
        </div>
      )}

      {/* Event Creation */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <DynamicCreateEvent />
      </LocalizationProvider>
    </div>
  );
}
