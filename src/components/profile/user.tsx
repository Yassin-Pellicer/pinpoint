"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "../../utils/context/ContextSession";
import { useRouter } from "next/navigation";
import { isFollowedByHook, deleteFollowerHook, addFollowerHook } from "../../hooks/general/followersHook";
import ProfilePopup from "./profilePopup";

export default function SwiperComponent({ userProp }) {
  const { user } = useSession();
  const router = useRouter();

  const [isFollowed, setIsFollowed] = useState(null);

  useEffect(() => {
    if (user && userProp) handleIsFollowed();
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
    <div className="flex w-full items-center justify-between border-b px-4 py-3 hover:bg-gray-50 transition-colors">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push(`/main/user/${userProp.id}`)}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {userProp.profilePicture ? (
            <ProfilePopup
              id={userProp.id}
              profilePicture={userProp.profilePicture}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <i className="material-icons text-gray-400 text-3xl select-none">person</i>
            </div>
          )}
        </div>

        <div className="ml-4 flex flex-col">
          <h2 className="text-base font-semibold text-gray-900">
            {userProp.username || "username"}
          </h2>
          {userProp.description && (
            <p className="text-sm text-gray-600">
              {userProp.description?.split(" ").slice(0, 9).join(" ") + (userProp.description?.split(" ").length > 9 ? "..." : "")}
            </p>
          )}
        </div>
      </div>

      {user?.id !== userProp?.id && isFollowed !== null && (
        <button
          onClick={handleFollow}
          className={`ml-4 text-sm font-bold border rounded-full px-4 py-1 transition-colors
          ${isFollowed
              ? "border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-400"
              : "bg-blue-500 text-white hover:bg-blue-600"
            }
        `}
        >
          {isFollowed ? "Unfollow" : "Seguir"}
        </button>
      )}
    </div>
  );

}