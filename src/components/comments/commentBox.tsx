"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "../../utils/context/ContextSession";
import CommentList from "../comments/commentList";
import { Comment } from "../../utils/classes/Comment";
import { addCommentHook } from "../../hooks/main/add/addCommentHook";
import { addRatingHook } from "../../hooks/main/add/addRatingHook";
import { getRatingUserHook } from "../../hooks/main/get/getRatingUserHook";
import { useMapContext } from "../../utils/context/ContextMap";
import ProfilePopup from "../profile/profilePopup";

const commentBox = () => {
  const { user } = useSession();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [assignRating, setAssignRating] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { selectedEvent } = useMapContext();

  const handleUploadComment = async (e: React.FormEvent) => {
    let comment = null;
    comment = new Comment(
      content,
      user.id,
      user.username,
      new Date(),
      assignRating ? rating : null,
      isPrivate
    );
    if (comment.content == "") {
      return;
    } else {
      const response = await addCommentHook(
        selectedEvent?.id,
        user.id,
        comment
      );
      setContent("");
    }
  };

  useEffect(() => {
    if (user) {
      getRatingUserHook(selectedEvent.id, user?.id).then((response) => {
        setRating(response.rating);
      });
    }
  }, [user]);

  return (
    <>
      {(selectedEvent?.enableRatings || selectedEvent?.enableComments) && (
        <>
          <div className="h-auto bg-blue-400 relative transition duration-100 overflow-hidden">
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

          <div className="rounded-b-2xl pt-6 bg-white cursor-default transition">
            <div className="flex flex-col select-none">
              <div className="flex px-6 flex-row align-center mb-3">
                <div className="flex w-[50px] h-[50px] mr-2 border-[1px] border-gray-300 rounded-full shrink-0 overflow-hidden cursor-pointer">
                  {user?.profilePicture ? (
                    <ProfilePopup
                      id={user.id}
                      profilePicture={user.profilePicture}
                    ></ProfilePopup>
                  ) : (
                    <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
                      person
                    </i>
                  )}
                </div>
                <div className="flex flex-col">
                  {" "}
                  <h2 className="text-xl font-bold mr-5 flex flex-col">
                    {user?.username || "username"}
                  </h2>
                  {selectedEvent?.enableRatings && (
                    <div>
                      <div className="flex flex-row">
                        <div className="flex flex-row mb-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <i
                              key={i}
                              className={`material-icons text-xl cursor-pointer ${
                                i <= rating
                                  ? "text-yellow-300 hover:text-yellow-500"
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
                                addRatingHook(selectedEvent?.id, user.id, i);
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
                            className="material-icons mt-1 text-sm cursor-pointer ml-1 text-gray-500 hover:text-gray-600"
                            onClick={() => {
                              setRating(0);
                              addRatingHook(selectedEvent?.id, user?.id, 0);
                            }}
                          >
                            replay
                          </i>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {selectedEvent?.enableComments && (
                <div className="flex flex-row ">
                  <div className="flex w-full flex-col">
                    <textarea
                      className="bg-white p-3 border border-gray-400 focus:outline-none text-xs h-[100px] resize-none"
                      placeholder="Escribe un comentario..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      maxLength={300}
                      style={{ resize: "none", height: "100px" }}
                    />

                    <div className="grid grid-cols-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUploadComment(e);
                          setRefresh(!refresh);
                        }}
                        className="font-bold bg-transparent border-l-[1px] border-r-[1px] border-b-[1px] text-sm border-gray-400 
                      text-black p-2 hover:bg-blue-500
                      hover:border-blue-500 hover:text-white 
                      transition duration-300"
                      >
                        Publish Comment
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPrivate(!isPrivate);
                        }}
                        className="font-bold bg-gray-200 border-b-[1px] text-sm border-gray-400 
                      text-black p-2 hover:bg-blue-500
                      hover:border-blue-500 hover:text-white 
                      transition duration-300"
                      >
                        {!isPrivate ? (
                          <i className="material-icons text-sm">visibility</i>
                        ) : (
                          <i className="material-icons text-sm">
                            visibility_off
                          </i>
                        )}
                      </button>
                      {selectedEvent?.enableRatings && (
                        <button
                          onClick={() => setAssignRating(!assignRating)}
                          className={`font-bold border-l-[1px] border-r-[1px] border-b-[1px] text-sm border-gray-400 
                    text-white p-2 hover:border-${
                      assignRating ? "green-500" : "red-500"
                    } hover:text-white 
                    transition duration-300 bg-${
                      assignRating ? "green-500" : "red-500"
                    }`}
                        >
                          {assignRating
                            ? "Asignar Valoración"
                            : "No Asignar Valoración"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
