"use client";
import { useEffect, useState } from "react";
import { getCommentsHook } from "../../hooks/main/get/getCommentsHook";
import { getRatingUserHook } from "../../hooks/main/get/getRatingUserHook";
import { getUserHook } from "../../hooks/general/getUserHook";
import { useSession } from "../../utils/context/ContextSession";
import { deleteCommentHook } from "../../hooks/main/delete/deleteCommentHook";
import { Alert, Snackbar } from "@mui/material";
import { useMapContext } from "../../utils/context/ContextMap";
import { Comment } from "../../utils/classes/Comment";
import ProfilePopup from "../profile/profilePopup";

const List = ({refresh, setRefresh}) => {
  const { selectedEvent } = useMapContext();
  const { user } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommentsHook(selectedEvent.id)
      .then((response) => {
        setComments(response.comments);
      })
      .finally(() => setLoading(false));
  }, [selectedEvent.id, refresh]);

  const handleDeleteComment = async (commentId) => {
    deleteCommentHook(commentId);
  };

  return (
    <>
      {!loading && comments.length > 0 && (
        <>
          <div className="mt-6 h-auto bg-blue-400 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center">
                  <i
                    className="material-icons text-white text-4xl mr-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    forum
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Sección de comentarios
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-row transition-padding p-4 border-t-[1px] border-gray-300 bg-gray-200 cursor-default"
            >
              <ProfilePopup
                id={comment.user}
                profilePicture={comment.profilePicture}
                onClick={() => {<Profile ></Profile>}}
              ></ProfilePopup>
              <div className="w-full">
                <div className="flex items-center flex-row w-full justify-between">
                  <div className="flex flex-col align-center">
                    <h2 className="text-lg font-bold tracking-tight">
                      @{comment.username}
                    </h2>
                    {comment.rating !== null && (
                      <div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <i
                              key={i}
                              className={`material-icons text-md cursor-pointer ${
                                i <= comment.rating
                                  ? "text-white hover:text-gray-200"
                                  : "text-gray-400 hover:text-gray-500"
                              }`}
                              style={{
                                textShadow:
                                  i <= comment.rating
                                    ? "1px 1px 2px rgba(0,0,0,0.5)"
                                    : undefined,
                              }}
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

                  <div className="flex flex-row align-center items-center">
                    <p className="text-sm mr-0 ml-auto tracking-tighter">
                      {new Date(comment.posted_at).toLocaleDateString()}
                    </p>
                    {comment.user === user.id && (
                      <i
                        className="material-icons text-xl ml-4 text-gray-600 transition duration-300 hover:cursor-pointer hover:text-red-500"
                        onClick={() => {
                          handleDeleteComment(comment.id);
                          setComments(
                            comments.filter((c) => c.id !== comment.id)
                          );
                        }}
                      >
                        delete
                      </i>
                    )}
                  </div>
                </div>
                <p className="text-md mt-2 tracking-tighter">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
export default List;

