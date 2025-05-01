"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "../../utils/context/ContextSession";
import CommentList from "../comments/commentList";
import { Comment } from "../../utils/classes/Comment";
import { addCommentHook } from "../../hooks/main/add/addCommentHook";
import { useEvent } from "../../utils/context/ContextEvent";
import { addRatingHook } from "../../hooks/main/add/addRatingHook";
import { getRatingUserHook } from "../../hooks/main/get/getRatingUserHook";
import { Alert, Snackbar } from "@mui/material";
import { useMapContext } from "../../utils/context/ContextMap";

const commentBox = () => {
  const { user } = useSession();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [assignRating, setAssignRating] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { selectedEvent } = useMapContext();

  const handleUploadComment = async (e: React.FormEvent) => {
    let comment = null;
    if (assignRating) comment = new Comment(content, user.id, new Date(), rating);
    else comment = new Comment(content, user.id, new Date(), null);

    if (comment.content == "") {
      return;
    } else {
      const response = await addCommentHook(selectedEvent.id, user.id, comment);
      setContent("");
      setSnackbarMessage("Comentario añadido correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    getRatingUserHook(selectedEvent.id, user.id).then((response) => {
      setRating(response.rating);
    });
  }, [selectedEvent.id]);

  return (
    <>
      {(selectedEvent.enableRatings || selectedEvent.enableComments) && (
        <>
          <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div
                className="bg-no-repeat bg-center bg-cover absolute right-0 top-0 bottom-0 w-1/2 h-3/4 transform rotate-[5deg] z-0 m-5"
                style={{
                  backgroundImage: "url('/img/stars.png')",
                }}
              ></div>

              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center">
                  <i
                    className="material-icons text-white text-4xl mr-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    comment
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Comentarios y Valoraciones
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-b-2xl pt-3 bg-gray-200 cursor-default transition">
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={
                  snackbarSeverity as "error" | "success" | "info" | "warning"
                }
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <div className="flex px-4 flex-col select-none">
              {selectedEvent.enableRatings && (
                <>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i
                        key={i}
                        className={`material-icons text-3xl cursor-pointer ${
                          i <= rating
                            ? "text-white hover:text-gray-200"
                            : "text-gray-400 hover:text-gray-500"
                        }`}
                        style={{
                          textShadow:
                            i <= rating
                              ? "2px 2px 4px rgba(0,0,0,0.5)"
                              : undefined,
                        }}
                        onClick={() => {
                          setRating(i);
                          addRatingHook(selectedEvent.id, user.id, i);
                        }}
                      >
                        {i <= Math.floor(rating)
                          ? "star"
                          : i - 0.5 === rating
                          ? "star_half"
                          : "star_border"}
                      </i>
                    ))}
                    <i
                      className="material-icons rotate-45 text-sm ml-2 cursor-pointer text-gray-500 hover:text-gray-600"
                      onClick={() => {
                        setRating(0);
                        addRatingHook(selectedEvent.id, user.id, 0);
                      }}
                    >
                      replay
                    </i>
                  </div>
                </>
              )}
              {selectedEvent.enableComments && (
                <>
                  <textarea
                    className="bg-white p-3 border mt-2 border-gray-400 focus:outline-none text-xs h-[100px] resize-none"
                    placeholder="Escribe un comentario..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={300}
                    style={{ resize: "none", height: "100px" }}
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleUploadComment(e);
                      setRefresh(!refresh);
                    }}
                    className="font-bold bg-transparent border-l-[1px] border-r-[1px] border-b-[1px] text-sm border-gray-400 
                text-black rounded-b-2xl p-2 hover:bg-blue-500
                hover:border-blue-500 hover:text-white 
                transition duration-300"
                  >
                    Publish Comment
                  </button>

                  {selectedEvent.enableRatings && (
                    <div className="flex items-center">
                      <label className="select-none tracking-tighter mt-2 text-sm text-black">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={assignRating}
                          onChange={(e) => setAssignRating(e.target.checked)}
                        />
                        Asignar valoración a comentario
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
            <CommentList refresh={refresh} setRefresh={setRefresh} />
          </div>
        </>
      )}
    </>
  );
};

export default commentBox;
