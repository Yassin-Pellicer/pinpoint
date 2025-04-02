"use client";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useCheckpoints } from "../../utils/context/cpContext";
import { closestCenter, closestCorners, DndContext, pointerWithin, rectIntersection } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { Checkpoint } from "../../utils/classes/cpClass";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useEvent } from "../../utils/context/eventContext";
import { get } from "http";
import { getCommentsHook } from "../../hooks/main/getCommentsHook";
import { getRatingUserHook } from "../../hooks/main/getRatingUserHook";
import { getUserHook } from "../../hooks/general/getUserHook";
import { useSessionContext } from "../../utils/context/sessionContext";
import { deleteCommentHook } from "../../hooks/main/deleteCommentHook";
import { Alert, Snackbar } from "@mui/material";

const List = () => {

  const { selectedEvent } = useEvent();
  const { id } = useSessionContext();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    getCommentsHook(selectedEvent.id).then((response) => {
      Promise.all(
        response.comments.map(async (comment) => {
          if (comment.assign_rating) {
            const response2 = await getRatingUserHook(
              selectedEvent.id,
              comment.user
            );
            comment.rating = response2.rating;
          }
          const response3 = await getUserHook(comment.user);
          comment.username = response3.user.username;
          return comment;
        })
      ).then((comments) => {
        setComments(comments);
        setLoading(false);
      });
    });
  }, [selectedEvent.id]);

  const handleDeleteComment = async (commentId) => {
    deleteCommentHook(commentId);
    setSnackbarMessage("Comentario borrado correctamente");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  return (
    <>
      {!loading &&
        comments.length > 0 &&
        comments.map((comment) => (
          <div
            key={comment.id}
            className="transition-padding p-4 pt-2 my-2 bg-[#d6d6d6] rounded-2xl cursor-default"
          >
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
            <div className="flex items-center flex-row justify-between">
              <div className="flex flex-row align-center items-center">
                <span className="material-icons text-5xl rounded-full mr-2">
                  person
                </span>
                <h2 className="font-caveat text-2xl font-bold tracking-tight">
                  @{comment.username}
                </h2>
              </div>
              <div className="flex flex-row align-center items-center">
                <div className="flex flex-col justify-end">
                  <p className="text-sm mr-0 ml-auto tracking-tighter">
                    {new Date(comment.posted_at).toLocaleDateString()}
                  </p>
                  {comment.rating !== null && (
                    <div>
                      <div className="flex justify-end items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <i
                            key={i}
                            className={`material-icons text-yellow-500 text-sm ${
                              i <= comment.rating
                                ? "star"
                                : i - 0.5 === comment.rating
                                ? "star_half"
                                : "star_border"
                            }`}
                          >
                            {i <= comment.rating
                              ? "star"
                              : i - 0.5 === comment.rating
                              ? "star_half"
                              : "star_border"}
                          </i>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {comment.user === id && (
                  <i
                    className="material-icons text-xl ml-4 text-gray-600 transition duration-300 hover:cursor-pointer hover:text-red-500"
                    onClick={() => {
                      handleDeleteComment(comment.id);
                      setComments(comments.filter((c) => c.id !== comment.id));
                    }}
                  >
                    delete
                  </i>
                )}
              </div>
            </div>
            <p className="text-sm tracking-tighter">{comment.content}</p>
          </div>
        ))}
    </>
  );
};

export default List;

