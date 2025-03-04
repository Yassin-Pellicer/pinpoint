"use client";

import Layout from "../home/layout";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import CheckpointEvent from "../../../components/create/cpEv/cpEv";
import SimpleEvent from "../../../components/create/simpleEv/simpleEv";
import MapComponentCP from "../../../components/create/cpEv/cpMap";
import MapComponentSimple from "../../../components/create/simpleEv/simpleMap";

import { useCheckpoints } from "../../../utils/context/cpContext";
import { useEvent } from "../../../utils/context/eventContext";
import Logo from "../../../components/ui/logo";
import { useMapContext } from "../../../utils/context/mapContext";

export default function Create() {
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { event } = useEvent();
  const { location, setLocation, zoom, setZoom, originalLocation } = useMapContext();

  const [selectedButton, setSelectedButton] = useState("simple");
  const t = useTranslations("Create");

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  if (!location) {
    return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-blue-500 z-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-[400px] w-[400px] border-b-8 border-white m-auto" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="mb-5">
          <Logo />
        </div>
      </div>
    </div>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col overflow-auto bg-blue-500 max-w-[35rem] h-screen px-6">
        {/* Event type */}
        <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
          <h1 className="font-bold text-4xl mb-2 tracking-tight font-caveat">
            {t("type")}
          </h1>
          <div className="flex justify-between mt-6 flex-row">
            <button
              className={` border border-black  rounded-2xl p-2 hover:bg-blue-500
                 hover:border-blue-500 hover:text-white transition-colors duration-100 font-bold tracking-tighter text-md ${
                selectedButton === "simple"
                  ? "bg-blue-500 border-blue-500 text-white "
                  : "bg-transparent text-black"
              }`}
              onClick={() => {
                setSelectedButton("simple");
                setCheckpoints([]);
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
                setSelectedButton("course");
                setCheckpoints([]);
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

        {/* Event Creation */}
        {selectedButton === "course" ? <CheckpointEvent /> : <SimpleEvent />}
      </div>

      {/* Map */}
      {selectedButton === "course" ? (
        <MapComponentCP />
      ) : (
        <MapComponentSimple />
      )}
    </Layout>
  );
}
