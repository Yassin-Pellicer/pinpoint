"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import { useEvent } from "../../utils/context/eventContext";
import fileURL from "../../utils/funcs/createUrlImage";
import CommentBox from "../comments/commentBox";
import CpList from "./cpList";
import { getRatingHook } from "../../hooks/main/getRatingHook";
import { useSessionContext } from "../../utils/context/sessionContext";
import { get } from "http";
import { getRatingUserHook } from "../../hooks/main/getRatingUserHook";
import { getCommentsHook } from "../../hooks/main/getCommentsHook";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const eventInfo = () => {
  const { selectedEvent, setSelectedEvent, tags, marker } = useEvent();
  const { id, username } = useSessionContext();
  const { checkpoints } = useCheckpoints();
  const [nearestDirection, setNearestDirection] = useState("Loading position...");
  const [rating, setRating] = useState(null);
  const t = useTranslations("Main");
  const tagsTrans = useTranslations("Tags");

  useEffect(() => {
    getRatingHook(selectedEvent.id).then((response) => {
      if (response) setRating(response.rating);
    });
  }, [selectedEvent.id]);

  useEffect(() => {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedEvent.marker.position[0]}&lon=${selectedEvent.marker.position[1]}`
      )
      .then((response) => response.json())
      .then((data) => {
        const road = data.address.road || "";
        const houseNumber = data.address.house_number || "";
        const fullAddress = houseNumber ? `${road}, nº: ${houseNumber}` : road; 

        if (fullAddress && fullAddress !== nearestDirection) {
          setNearestDirection(fullAddress);
        }
      })
      .catch((error) => console.error("Error fetching street name:", error));
  }, []);

  return (
    <div className="mb-6 mt-6 rounded-2xl bg-white p-6">
      <div className="relative w-full">
        <div
          className="absolute top-3 w-fit left-3 flex justify-center items-center text-white text-lg px-3 py-2 rounded-xl cursor-pointer z-10 group outline-none"
          onClick={() => setSelectedEvent(null)}
        >
          <i
            className="flex material-icons justify-center text-center items-center text-white text-4xl"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            arrow_back
          </i>
        </div>

        {selectedEvent.banner ? (
          <div className="relative flex justify-end items-center w-full h-15 rounded-2xl overflow-hidden border border-gray-400">
            <img
              src={selectedEvent.banner}
              className="w-full h-full object-cover rounded-2xl"
              alt="banner"
            />
          </div>
        ) : (
          <div className="flex flex-col cursor-pointer justify-center items-center w-full h-15 rounded-2xl p-14 bg-[#e6e6e6] border border-gray-400">
            <i className="text-gray-400 material-icons mr-1 text-[150px] select-none">
              add_photo_alternate
            </i>
            <p className="font-caveat text-gray-500 text-2xl tracking-tighter select-none">
              {t("pic")}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-3xl p-6 bg-gray-200 cursor-default transition mb-6 mt-6">
        <div className="flex flex-row ">
          <div className="flex flex-row w-full">
            <h1 className="font-bold text-2xl tracking-tight w-[80%] pr-5 ">
              {selectedEvent.name}
            </h1>
            <div className="flex flex-end max-w-[10%] mr-2">
              <div className="rounded-full border border-black  mr-2 h-fit flex items-center justify-center">
                <i className="material-icons text-xl px-2 py-1 ">print</i>
              </div>
              <div className="rounded-full border border-black h-fit flex items-center justify-center">
                <i className="material-icons text-xl px-2 py-1 ">bookmark</i>
              </div>
            </div>
          </div>
        </div>
        <p className="flex text-xs items-center w-[70%] mb-2">
          {rating !== null ? nearestDirection : ""}
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-end align-center items-center">
            {rating !== null && (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <i
                    key={i}
                    className={`material-icons text-yellow-500 text-sm ${
                      i <= Math.floor(rating)
                        ? "star"
                        : i - 0.5 === rating
                        ? "star_half"
                        : "star_border"
                    }`}
                  >
                    {i <= Math.floor(rating)
                      ? "star"
                      : i - 0.5 === rating
                      ? "star_half"
                      : "star_border"}
                  </i>
                ))}
                <p className="text-black text-sm ml-2 italic tracking-tighter">
                  {rating}
                </p>
              </>
            )}
                    {rating === null && (
                      <p className="flex text-xs items-center ">
                        {nearestDirection}
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
      </div>

      {selectedEvent.tags.length > 0 && (
        <div className="rounded-3xl p-6 bg-gray-200 cursor-default transition mb-6 mt-6">
          <div>
            <div className="flex flex-wrap w-full gap-2">
              {selectedEvent.tags.map((tag) => (
                <div
                  key={tag.id}
                  className={`rounded-full w-fit px-2 py-1 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight"
            }`}
                >
                  <p className="text-xs">{tagsTrans(`${tag.name}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedEvent.description && (
        <div
          className="rounded-2xl p-6 mb-6 bg-gray-200 cursor-default transition"
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

      {checkpoints && checkpoints.length > 0 && (
        <div className="mb-6">
          <CpList />
        </div>
      )}

      <CommentBox></CommentBox>
    </div>
  );
};

export default eventInfo;
