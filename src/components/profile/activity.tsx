"use client";
import React, { useEffect, useState } from "react";
import { useEvent } from "../../utils/context/ContextEvent";
import EventDate from "../ui/date";
import { useSession } from "../../utils/context/ContextSession";
import { deleteBookmarkHook } from "../../hooks/main/delete/deleteBookmarkHook";
import { addBookmarkHook } from "../../hooks/main/add/addBookmarkHook";
import { useMapContext } from "../../utils/context/ContextMap";
import { useRouter } from "next/navigation";
import Comment from "../comments/commentActivity";

export default function SwiperComponent( {activity, profileView} ) {
  const { user } = useSession();
  const router = useRouter();
  const { setModifiedEvent } = useMapContext();
  
  return (
    <div
      onClick={(e) => {
        router.push(`/main/event/${activity.event}`);
      }}
      className="flex-col bg-gray-100 text-black w-full h-fit flex hover:bg-gray-200 p-4 border-gray-300 border-[1px]"
    >
      {profileView && (
        <div className="flex flex-row items-center align-center">
          {activity.banner && (
            <div className="overflow-hidden bg-white rounded-full w-[30px] h-[30px] mr-6">
              <img
                src={activity.banner}
                alt="example"
                className="w-full h-full object-cover mr-6"
              />
            </div>
          )}
          <p className="italic text-sm text-gray-600">
            @{user.username} ha{" "}
            {activity.type == "rating" ? "puntuado" : "comentado"}{" "}
            {activity.name.slice(0, 20) + "..."}
          </p>
        </div>
      )}
      {activity.type == "rating" && (
        <div className="flex flex-col px-14">
          <p className="text-md mr-5 text-black tracking-tighter">
            {activity.name.slice(0, 50) + "..."}
          </p>
          <p className="text-xl mr-5 text-black tracking-tighter">
            Con una puntuación de {activity.rating} estrellas!
          </p>
          <div className="flex flex-row">
            {[1, 2, 3, 4, 5].map((i) => (
              <i
                key={i}
                className={`material-icons text-yellow-500 text-3xl ${
                  i <= Math.floor(activity.rating)
                    ? "star"
                    : i - 0.5 === activity.rating
                    ? "star_half"
                    : "star_border"
                }`}
              >
                {i <= Math.floor(activity.rating)
                  ? "star"
                  : i - 0.5 === activity.rating
                  ? "star_half"
                  : "star_border"}
              </i>
            ))}
          </div>
        </div>
      )}
      {activity.type == "comment" && (
        <>
          <p className="text-md mr-5 pl-14 text-black tracking-tighter">
            {activity.name.slice(0, 50) + "..."}
          </p>
          <Comment
            comment={activity}
            refresh={undefined}
            setRefresh={undefined}
          ></Comment>
        </>
      )}
    </div>
  );
}