"use client";

import Layout from "../home/layout";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from "next-intl";
import CheckpointEvent from "../../../components/create/checkpoint_event";
import SimpleEvent from "../../../components/create/simple_event";
import MapComponent from "../../../components/create/map";

export default function Create() {

  const [selectedButton, setSelectedButton] = useState("simple");
  const t = useTranslations("Create");

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <Layout>
      <div className="flex flex-col overflow-auto bg-blue-500 w-[600px] h-screen px-6">
        {/* Event type */}
        <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
          <h1 className="font-bold text-4xl mb-2 tracking-tight font-caveat">
            {t("type")}
          </h1>
          <div className="flex justify-between mt-6 flex-row">
            <button
              className={` border border-black  rounded-2xl p-2 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors duration-100 font-caveat tracking-tight text-2xl ${
                selectedButton === "simple"
                  ? "bg-blue-500 border-blue-500 text-white "
                  : "bg-transparent text-black"
              }`}
              onClick={() => setSelectedButton("simple")}
            >
              {t("simple")}
            </button>
            <button
              className={`border border-black rounded-2xl p-2 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors duration-100 font-caveat tracking-tight text-2xl ${
                selectedButton === "course"
                  ? " bg-blue-500 border-blue-500 text-white "
                  : "bg-transparent text-black"
              }`}
              onClick={() => setSelectedButton("course")}
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

        {/* Map */}
      </div>
      <MapComponent />
    </Layout>
  );
}

