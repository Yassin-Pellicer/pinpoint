"use client";

import "react-quill/dist/quill.snow.css";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import CheckpointEvent from "../../components/create/cpEv/createCheckpointEvent";
import SimpleEvent from "../../components/create/simpleEv/createSimpleEvent";
import MapComponentCP from "../../components/create/cpEv/createCheckpointMap";
import MapComponentSimple from "../../components/create/simpleEv/createSimpleMap";

import { useMapContext } from "../../utils/context/ContextMap";

import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import LoadingScreen from "../../components/ui/loadingScreen";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";

export default function Create() {
  const { location, editMode } = useMapContext();
  const { checkpoints, setCheckpoints } = useCheckpoints();

  const [selectedButton, setSelectedButton] = useState(
    checkpoints.length === 0 ? "simple" : "course"
  );
  const t = useTranslations("Create");

  useEffect(() => {
    setCheckpoints([]);
  }, []);

  if (!location) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-col overflow-auto bg-blue-500 w-[550px] shrink-0 h-screen">
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
                  }}
                >
                  {t("simple")}
                </button>
                <button
                  className={`border border-black rounded-2xl p-2 hover:bg-blue-500
                 hover:border-blue-500 hover:text-white transition-colors duration-100 font-bold tracking-tighter text-md ${
                   selectedButton === "course"
                     ? " bg-blue-500 border-blue-500 text-white "
                     : "bg-transparent text-black"
                 }`}
                  onClick={() => {
                    if (selectedButton === "course") return;
                    setSelectedButton("course");
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
          <div className="flex flex-col bg- p-6 border-b border-gray-300 border-[1px]">
            <h1 className="font-bold text-green-500 text-3xl mb-2 tracking-tight ">
              Estás en modo edición.
            </h1>
            <p className="text-sm mt-4">
              Al editar un evento no puedes cambiar su tipo. Volver a la página
              principal dejará el evento intacto.
            </p>
          </div>
        )}

        {/* Event Creation */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {selectedButton === "course" ? <CheckpointEvent /> : <SimpleEvent />}
        </LocalizationProvider>
      </div>

      {/* Map */}
      {selectedButton === "course" ? (
        <MapComponentCP />
      ) : (
        <MapComponentSimple />
      )}
    </div>
  );
}
