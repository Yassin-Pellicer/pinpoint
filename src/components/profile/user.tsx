"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "../../utils/context/ContextSession";
import { useRouter } from "next/navigation";
import { isFollowedByHook, deleteFollowerHook, addFollowerHook } from "../../hooks/general/followersHook";
import ProfilePopup from "./profilePopup";

export default function SwiperComponent( {userProp} ) {
  const { user } = useSession();
  const router = useRouter();

  const [isFollowed, setIsFollowed] = useState(null);

  useEffect(() => {
    if(user && userProp) handleIsFollowed();
  }, [user]);

  const handleIsFollowed = () => {
    isFollowedByHook(userProp.id, user.id).then((response) => {
      setIsFollowed(response.follows);
    });
  }

  const handleFollow = () => {
    if (isFollowed) {
      deleteFollowerHook(user.id, userProp.id).then(() => {
        handleIsFollowed();
      });
    } else {
      addFollowerHook(user.id, userProp.id).then(() => {
        handleIsFollowed();
      });
    }
  };

  return (
    <div className="flex w-full items-center border-y-[1px] p-4 hover:bg-gray-200 bg-gray-100 border-gray-300">
      <div className="flex flex-row justify-between w-full items-center">
        <div
          onClick={() => {router.push(`/main/user/${userProp.id}`)}}
         className="flex flex-row">
          <div className="flex w-[60px] h-[60px] rounded-full shrink-0 overflow-hidden">
            {userProp.profilePicture ? (
              <ProfilePopup
                id={userProp.id}
                profilePicture={userProp.profilePicture}
              ></ProfilePopup>
            ) : (
              <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
                person
              </i>
            )}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col ml-5">
              <h2 className="text-xl font-bold">
                {userProp.username || "username"}
              </h2>
              <p className="text-sm text-gray-600 mr-4 tracking-tight pb-2">
                {userProp.description?.slice(0, 100) + (userProp.description?.length > 100 ? "..." : "")}
              </p>
            </div>
          </div>
        </div>

        {user?.id !== userProp?.id && isFollowed !== null && (
          <button
            onClick={handleFollow}
            className={`${
              isFollowed
                ? "bg-red-500 hover:bg-red-700"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold h-[40px] px-4 rounded-full`}
          >
            {isFollowed ? "Unfollow" : "Seguir"}
          </button>
        )}
      </div>
    </div>
  );
}