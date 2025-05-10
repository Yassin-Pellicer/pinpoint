"use client";
import { useState, useEffect} from "react";
import { useSession } from "../../../utils/context/ContextSession";
import { addBookmarkHook } from "../../../hooks/main/add/addBookmarkHook";
import { deleteBookmarkHook } from "../../../hooks/main/delete/deleteBookmarkHook";
import { getCheckBookmark } from "../../../hooks/main/get/getCheckBookmarkHook";
import { useMapContext } from "../../../utils/context/ContextMap";

const bookmarkBox = ({ event }) => {
  const { user, triggerFetchBookmarks, bookmarks} = useSession();
  const { setModifiedEvent } = useMapContext();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      getCheckBookmark(user.id, event.id).then((response) => {
        console.log("Fetched bookmarks", response);
        if (response.isBookmarked) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      })
    }
  }, [user?.id]);

  const handleUploadBookmark = async () => {
    const response = await addBookmarkHook(event.id, user.id);
    setModifiedEvent(event);
    setIsBookmarked(true);
  };

  const handleDeleteBookmark = async () => {
    const response = await deleteBookmarkHook(event.id, user.id);
    setModifiedEvent(event);
    setIsBookmarked(false);
  };

  return (
    <div
      className={`h-auto overflow-hidden ${
        isBookmarked === null
          ? "bg-gray-400"
          : isBookmarked
          ? "bg-blue-500"
          : "bg-orange-500"
      } relative hover:cursor-pointer transition duration-100`}
      onClick={() =>
        isBookmarked === null
          ? null
          : isBookmarked
          ? handleDeleteBookmark()
          : handleUploadBookmark()
      }
    >
      <div className="relative flex flex-col justify-between h-full p-5">
        {isBookmarked === null && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <div
          className="bg-no-repeat bg-center bg-cover absolute w-2/3 left-[-15px] inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/img/book.png')",
            transform: "rotate(-5deg) scale(0.9)",
            opacity: isBookmarked === null ? 0 : 1,
            zIndex: 0,
          }}
        ></div>
        <div className="relative z-10">
          {isBookmarked !== null && (
            <h1
              className="text-2xl tracking-tighter font-bold mb-2 text-white break-words"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
            >
              {!isBookmarked ? "Añadido a Marcadores" : "Añadir a eventos marcados"}
            </h1>
          )}
          <p
            className="text-sm tracking-tighter font-bold text-white break-words"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
          >
            {isBookmarked === null
              ? ""
              : "Guarda el evento y consúltalo sin tener que buscarlo"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default bookmarkBox;