"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSessionContext } from "../../utils/context/sessionContext";
import CommentList from "../comments/commentList";
import { Comment } from "../../utils/classes/Comment";
import { addCommentHook } from "../../hooks/main/addCommentHook";
import { useEvent } from "../../utils/context/eventContext";
import { addRatingHook } from "../../hooks/main/addRatingHook";

const commentBox = () => {
  const { username, id } = useSessionContext();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [assignRating, setAssignRating] = useState(false);
  const { event, selectedEvent } = useEvent();

  const handleUploadComment = async (e: React.FormEvent) => {
    const comment = new Comment(content, id, new Date(), assignRating);
    if (comment.content == "") {
      return;
    } else {
      const response = await addCommentHook(selectedEvent.id, id, comment);
    }
  };

  useEffect(() => {
    return () => {
      console.log(rating, id);
      // This runs when the component unmounts
      if (rating !== 0) addRatingHook(selectedEvent.id, id, rating);
    };
  }, [rating]); 

  return (
    <div className="flex flex-col select-none">
      <div className="flex flex-col justify-center items-center">
        <p className="font-caveat text-3xl tracking-tighter font-bold mb-2">
          ¡Dale una puntuación a este evento!
        </p>
      </div>
      <div className="flex justify-center items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <i
            key={i}
            className={`material-icons text-yellow-500 text-3xl cursor-pointer ${
              i <= Math.floor(rating)
                ? "star"
                : i - 0.5 === rating
                ? "star_half"
                : "star_border"
            }`}
            onClick={() => setRating(i)}
          >
            {i <= Math.floor(rating)
              ? "star"
              : i - 0.5 === rating
              ? "star_half"
              : "star_border"}
          </i>
        ))}
        <i
          className="material-icons rotate-45 text-gray-500 text-sm ml-2 cursor-pointer"
          onClick={() => setRating(0)}
        >
          replay
        </i>
      </div>
      <textarea
        className="bg-white p-3 rounded-lg border mt-4 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs h-[100px] resize-none"
        placeholder="Escribe un comentario..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={300}
        style={{ resize: "none", height: "100px" }}
      />

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

      <button
        onClick={(e) => {
          e.preventDefault();
          handleUploadComment(e);
        }}
        className="font-bold bg-transparent border-2 text-sm border-black 
            text-black rounded-xl p-2 hover:bg-blue-500
            hover:border-blue-500 hover:text-white 
            transition duration-300 mt-4 mb-10"
      >
        Publish Comment
      </button>

      <CommentList />
    </div>
  );
};

export default commentBox;
