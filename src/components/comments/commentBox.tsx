"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSessionContext } from "../../utils/context/sessionContext";
import CommentList from "../comments/commentList";

const commentBox = () => {
  const { username } = useSessionContext();
  const [rating, setRating] = useState(1);

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
      </div>
      <textarea
        className="bg-white p-3 rounded-lg border mt-4 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs h-[100px] resize-none"
        placeholder="Escribe un comentario..."
        maxLength={300}
        style={{ resize: "none", height: "100px" }}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
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
