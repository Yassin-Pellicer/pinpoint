"use client";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import UserList from "./user";
import { useEffect } from "react";

export default function SwiperComponent( {users} ) {

useEffect(() => {
  console.log(users);
}, [users]);

  return (
    <div className="flex flex-col">
      {users?.map((user, index) => (
        <div
          key={index}
          className="flex justify-center align-center items-center select-none cursor-pointer"
        >
          <UserList userProp={user} />
        </div>
      ))}
    </div>
  );
}