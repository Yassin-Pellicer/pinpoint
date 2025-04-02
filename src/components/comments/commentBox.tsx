"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSessionContext } from "../../utils/context/sessionContext";
import CommentList from "../comments/commentList";
import { Comment } from "../../utils/classes/Comment";
import { addCommentHook } from "../../hooks/main/addCommentHook";
import { useEvent } from "../../utils/context/eventContext";
import { addRatingHook } from "../../hooks/main/addRatingHook";
import { getRatingUserHook } from "../../hooks/main/getRatingUserHook";
import { Alert, Snackbar } from "@mui/material";

const commentBox = () => {
  const { username, id } = useSessionContext();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [assignRating, setAssignRating] = useState(false);
  const { event, selectedEvent } = useEvent();

  const handleUploadComment = async (e: React.FormEvent) => {
    let comment = null;
    if (assignRating) comment = new Comment(content, id, new Date(), rating);
    else comment = new Comment(content, id, new Date(), null);

    if (comment.content == "") {
      return;
    } else {
      const response = await addCommentHook(selectedEvent.id, id, comment);
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
    getRatingUserHook(selectedEvent.id, id).then((response) => {
      console.log(selectedEvent);
      setRating(response.rating);
    });
  }, [selectedEvent.id]);

  return (
    <>
      {(selectedEvent.enableRatings || selectedEvent.enableComments) && (
        <div className="rounded-2xl p-6 bg-gray-200 cursor-default transition">
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
          <div className="flex flex-col select-none">
            {selectedEvent.enableRatings && (
              <>
                <div className="flex flex-col justify-center items-center">
                  <p className="font-caveat text-3xl tracking-tighter font-bold mb-2">
                    ¡Dale una puntuación a este evento!
                  </p>
                </div>
                <div className="flex justify-center items-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i
                      key={i}
                      className={`material-icons text-3xl cursor-pointer ${
                        i <= rating
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-400 hover:text-gray-500"
                      }`}
                      onClick={() => {
                        setRating(i);
                        addRatingHook(selectedEvent.id, id, i);
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
                      addRatingHook(selectedEvent.id, id, 0);
                    }}
                  >
                    replay
                  </i>
                </div>
              </>
            )}
            {selectedEvent.enableComments && (
              <>
                <h1 className="font-bold text-xl tracking-tighter">
                  Añadir Comentario
                </h1>
                <textarea
                  className="bg-white p-3 rounded-lg border mt-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs h-[100px] resize-none"
                  placeholder="Escribe un comentario..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={300}
                  style={{ resize: "none", height: "100px" }}
                />

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

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleUploadComment(e);
                  }}
                  className="font-bold bg-transparent border-2 text-sm border-black 
                text-black rounded-xl p-2 hover:bg-blue-500
                hover:border-blue-500 hover:text-white 
                transition duration-300 mt-4"
                >
                  Publish Comment
                </button>

                <div className="mt-6">
                  <CommentList />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default commentBox;
