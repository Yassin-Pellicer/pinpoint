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

const BottomSheet = () => {
  const [comments, setComments] = useState([
    {
      username: "Pepito",
      comment:
        "Este es un comentario de prueba. Este es un comentario de prueba. Este es un comentario de prueba. Este es un comentario de prueba.",
      rating: 4.5,
      date: new Date().toLocaleString(),
    },
    {
      username: "Juanito",
      comment:
        "Este es otro comentario de prueba. Este es otro comentario de prueba. Este es otro comentario de prueba. Este es otro comentario de prueba.",
      rating: 3,
      date: new Date().toLocaleString(),
    },
    {
      username: "Pedrito",
      comment:
        "Este es un comentario de prueba mas largo para ver como se ve. Este es un comentario de prueba mas largo para ver como se ve. Este es un comentario de prueba mas largo para ver como se ve. Este es un comentario de prueba mas largo para ver como se ve. Este es un comentario de prueba mas largo para ver como se ve.",
      rating: 5,
      date: new Date().toLocaleString(),
    },
  ]);

  return (
    <>
      {comments.map((comment, index) => (
        <div
          key={index}
          className="transition-padding p-4 pt-2 my-2 bg-[#d6d6d6] rounded cursor-default"
        >
          <div className="flex items-center flex-row justify-between">
            <div className="flex flex-row align-center items-center">
              <span className="material-icons text-5xl rounded-full mr-2">
                person
              </span>
              <h2 className="font-caveat text-2xl font-bold tracking-tight">
              @{comment.username}
            </h2>
            </div>
            <div>
            <p className="text-sm tracking-tighter">{comment.date}</p>
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
          </div>

          <p className="text-sm tracking-tighter">{comment.comment}</p>
        </div>
      ))}
    </>
  );
};

export default BottomSheet;

