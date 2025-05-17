"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import UserList from "./userInscribed";
import { useEffect } from "react";
import { useSession } from "../../utils/context/ContextSession";

export default function SwiperComponent( {users} ) {

  const {user} = useSession();

  return (
    <div className="flex flex-col">
      {users?.map((userProp, index) => (
        <div
          key={index}
          className="flex justify-center align-center items-center select-none cursor-pointer"
        >
          {user.id === userProp.id ? null : <UserList userProp={userProp} />}
        </div>
      ))}
    </div>
  );
}