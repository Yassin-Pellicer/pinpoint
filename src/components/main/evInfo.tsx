"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import { useEvent } from "../../utils/context/eventContext";
import fileURL from "../../utils/funcs/createUrlImage";
import CommentBox from "../comments/commentBox";
import CpList from "./cpList";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const eventInfo = () => {
  const { selectedEvent, setSelectedEvent, tags} = useEvent();
  const { checkpoints } = useCheckpoints();
  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");
 
  return (
    <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
<div className="relative w-full">
<div
  className="absolute top-3 left-3 flex align-center items-center bg-black bg-opacity-50 text-white text-lg px-3 py-2 rounded-xl cursor-pointer z-10 group"
  onClick={() => setSelectedEvent(null)}
>
  <i className="flex material-icons justify-center items-center text-white text-2xl">arrow_back_ios</i>
  <span className="font-medium opacity-0 h-0 w-0 group-hover:w-fit group-hover:opacity-100 group-hover:h-5 group-hover:px-2 overflow-hidden mb-1 whitespace-nowrap">Deselect Event</span>

</div>

  {selectedEvent.banner ? (
    <div className="relative flex justify-end items-center w-full h-15 mb-4 rounded-2xl overflow-hidden border border-gray-400">
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
</div>


      <h1 className="font-bold text-4xl font-caveat tracking-tight">
        {selectedEvent.name}
      </h1>

      <div className="flex flex-end items-center mt-2">
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
        <p className="text-black text-lg ml-2 tracking-tighter mt-1">{3.5}</p>
      </div>

      <div className="flex flex-row mt-1 mb-4 items-center justify-between text-black">
        <h2 className="font-bold text-3xl font-caveat  tracking-tight">
          Created by {selectedEvent.author}
        </h2>
        <div className="flex gap-2">
          {selectedEvent.isPublic && <i className="material-icons">public</i>}
          {!selectedEvent.isPublic && <i className="material-icons">lock</i>}
          {selectedEvent.qr && <i className="material-icons">qr_code</i>}
          {!selectedEvent.qr && <i className="material-icons">tour</i>}
        </div>
      </div>

      <div className="mb-4">
        {selectedEvent.tags.length > 0 && (
          <div className="flex flex-wrap w-full mt-4 gap-2">
            {selectedEvent.tags.map((tag) => (
              <div
                key={tag.id}
                className={`rounded-md w-fit p-[10px] py-2 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight text-white"
            }`}
              >
                {tagsTrans(`${tag.name}`)}
              </div>
            ))}
          </div>
        )}
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

      {checkpoints && checkpoints.length > 0 && (
        <div className="mb-10">
          <CpList />
        </div>
      )}

      <div className="mt-10">
        <CommentBox></CommentBox>
      </div>
    </div>
  );
};

export default eventInfo;
