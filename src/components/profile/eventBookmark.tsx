"use client";
import React, { useEffect, useState } from "react";
import { useEvent } from "../../utils/context/ContextEvent";
import EventDate from "../ui/date";
import { useSession } from "../../utils/context/ContextSession";
import { deleteBookmarkHook } from "../../hooks/main/delete/deleteBookmarkHook";
import { addBookmarkHook } from "../../hooks/main/add/addBookmarkHook";
import { useMapContext } from "../../utils/context/ContextMap";

export default function SwiperComponent( {event} ) {
  const { user } = useSession();
  const { setSelectedEvent } = useMapContext();
  const { bookmarks, triggerFetchBookmarks } = useSession();
  
  const [isBookmarked, setIsBookmarked] = useState(null);

  useEffect(() => {
    if (event?.id && bookmarks) {
      const users = bookmarks.map((i) => i.id);
      setIsBookmarked(users.includes(event.id));
    }
  }, [bookmarks]);

  const handleUploadBookmark = async () => {
    const response = await addBookmarkHook(event.id, user.id);
    
    setIsBookmarked(true);
    triggerFetchBookmarks();
  };

  const handleDeleteBookmark = async () => {
    const response = await deleteBookmarkHook(event.id, user.id);
    
    setIsBookmarked(false);
    triggerFetchBookmarks();
  };

  return (
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

        {
          <div className="flex flex-row justify-end items-center w-full">
            {isBookmarked ? (
              <button
                onClick={handleDeleteBookmark}
                className="w-full font-extrabold font-white p-1 hover:bg-red-500 mt-2 rounded-2xl border-[1px] border-white transition duration-100"
              >
                Eliminar marcador
              </button>
            ) : (
              <button
                onClick={handleUploadBookmark}
                className="w-full font-extrabold font-white p-1 hover:bg-green-600 mt-2 rounded-2xl border-[1px] border-white transition duration-100"
              >
                Añadir marcador
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