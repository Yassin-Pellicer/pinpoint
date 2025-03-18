"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import { useEvent } from "../../utils/context/eventContext";
import fileURL from "../../utils/funcs/createUrlImage";
import CpList from "./cpList";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const eventInfo = () => {
  const { selectedEvent, setSelectedEvent} = useEvent();
  const { checkpoints } = useCheckpoints();
  const t = useTranslations("Main");

  return (
    <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
      <i
        className="material-icons text-xl mb-4 cursor-pointer"
        onClick={() => setSelectedEvent(null)}
      >
        arrow_back_ios
      </i>
      {selectedEvent.banner ? (
        <div className="cursor-pointer relative flex justify-end items-center w-full h-15 mb-4 rounded-2xl overflow-hidden border border-gray-400">
          <img
            src={selectedEvent.banner}
            className="w-full h-full object-cover rounded-2xl"
            alt="banner"
          />
        </div>
      ) : (
        <div className="flex flex-col cursor-pointer justify-center items-center w-full h-15 mb-4 rounded-2xl p-14 bg-[#e6e6e6] border border-gray-400 hover:bg-[#d6d6d6] transition duration-200">
          <i className="text-gray-400 material-icons mr-1 text-[150px] select-none">
            add_photo_alternate
          </i>
          <p className="font-caveat text-gray-500 text-2xl tracking-tighter select-none">
            {t("pic")}
          </p>
        </div>
      )}

      <h1 className="font-bold text-5xl font-caveat tracking-tight">
        {selectedEvent.name}
      </h1>

      <div className="flex flex-row mt-2 mb-4 items-center justify-between text-black">
        <h2 className="font-bold text-4xl font-caveat  tracking-tight">
          Created by {selectedEvent.author}
        </h2>
        <div className="flex gap-2">
          {selectedEvent.isPublic && <i className="material-icons">public</i>}
          {!selectedEvent.isPublic && <i className="material-icons">lock</i>}
          {selectedEvent.qr && <i className="material-icons">qr_code</i>}
          {!selectedEvent.qr && <i className="material-icons">tour</i>}
        </div>
      </div>

      {selectedEvent.description && (
        <Quill
          value={selectedEvent.description}
          readOnly={true}
          theme="bubble"
          modules={{
            toolbar: false,
          }}
        />
      )}

      {checkpoints && checkpoints.length > 0 && <CpList />}

      <p className="font-bold text-xl tracking-tight mt-2">
        Ratings and comments
      </p>
      <div className="flex items-center mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <i
            key={i}
            className={`material-icons text-yellow-500 text-2xl ${
              i <= Math.floor(3.5)
                ? "star"
                : i - 0.5 === 3.5
                ? "star_half"
                : "star_border"
            }`}
          >
            {i <= Math.floor(3.5)
              ? "star"
              : i - 0.5 === 3.5
              ? "star_half"
              : "star_border"}
          </i>
        ))}
        <p className="text-black text-2xl tracking-tighter">{3.5}</p>
      </div>
    </div>
  );
};

export default eventInfo;
