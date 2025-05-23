"use client";
import React, { useEffect, useState } from "react";
import EventDate from "../ui/date";
import { useSession } from "../../utils/context/ContextSession";
import { addInscriptionHook } from "../../hooks/main/add/addInscriptionHook";
import { deleteInscriptionHook } from "../../hooks/main/delete/deleteInscriptionHook";
import { useMapContext } from "../../utils/context/ContextMap";
import { useRouter } from "next/navigation";

export default function SwiperComponent( {event, userProp} ) {
  const { user } = useSession();
  const router = useRouter();
  const { setSelectedEvent, setModifiedEvent } = useMapContext();
  const [isInscribed, setIsInscribed] = useState(true);

  const handleUploadInscription = async () => {
    const response = await addInscriptionHook(event.id, userProp.id);
    setIsInscribed(true);
  };

  const handleDeleteInscription = async () => {
    const response = await deleteInscriptionHook(event.id, userProp.id);
    setIsInscribed(false);
  };

  return (
    <div className="bg-gray-100 text-black w-full h-fit flex items-center align-center hover:bg-gray-200 flex-row p-4 border-gray-300 border-[1px]">
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
            router.push(`/main/event/${event.id}`);
            setModifiedEvent(event);
            e.stopPropagation();
          }}
          className="flex flex-row justify-between items-center"
        >
          <h1 className="font-bold text-md pr-5 tracking-tight">
            {event.name}
          </h1>
        </div>
        <div className="flex flex-row justify-between align-center gap-8 items-center w-full">
          <p className="text-xs w-full">{event.address}</p>
          <div className="flex flex-row items-center">
            <div className="flex items-center">
              <i className="material-icons text-sm">
                {!event.isPublic ? "lock" : "public"}
              </i>
            </div>
            {event.qr && (
              <div className="flex items-center">
                <i className="material-icons text-sm ml-2">qr_code</i>
              </div>
            )}
          </div>
        </div>

        { userProp?.id === user?.id &&
          <div className="flex flex-row justify-end items-center w-full">
            {isInscribed ? (
              <button
                onClick={handleDeleteInscription}
                className="w-full font-bold p-1 hover:text-white hover:bg-red-500 mt-2 rounded-2xl border-[1px] border-black transition duration-100"
              >
                Desinscribirme
              </button>
            ) : (
              <button
                onClick={handleUploadInscription}
                className="w-full font-extrabold text-black p-1 hover:text-white hover:bg-green-600 mt-2 border-black rounded-2xl border-[1px] transition duration-100"
              >
                Inscribirme
              </button>
            )}
          </div>
        }

        {event.start && event.end && (
          <EventDate event={event} listMode={true} />
        )}
      </div>
    </div>
  );
}