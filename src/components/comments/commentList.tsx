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

const List = () => {

  const { selectedEvent } = useEvent();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommentsHook(selectedEvent.id).then((response) => {
      Promise.all(
        response.comments.map(async (comment) => {
          if (comment.assign_rating) {
            const response2 = await getRatingUserHook(selectedEvent.id, comment.user);
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

  return (
    <>
      {!loading && comments.length > 0 && comments.map((comment, index) => (
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
            {comment.assign_rating && (
              <div>
                <p className="text-sm mr-auto ml-0 tracking-tighter">{new Date(comment.posted_at).toLocaleDateString()}</p>
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
          <p className="text-sm tracking-tighter">{comment.content}</p>
        </div>
      ))}
    </>
  );
};

export default List;

