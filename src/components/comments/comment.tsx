import { useState } from "react";
import { useContext } from "react";
import { deleteCommentHook } from "../../hooks/main/delete/deleteCommentHook";
import ProfilePopup from "../profile/profilePopup";
import { useSession } from "../../utils/context/ContextSession";
import { useRouter } from "next/navigation";

export default function Comment({ comment }) {

  const { user } = useSession();
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const handleDeleteComment = async (commentId) => {
    deleteCommentHook(commentId);
  };
  
  return (
    <div
    className="flex flex-row transition-padding p-4 border-t-[1px] border-gray-300 bg-gray-200 cursor-default"
  >
    <div
      onClick={() => {
        router.push(`/main/user/${comment.user}`);
      }}
    >
      <ProfilePopup
        id={comment.user}
        profilePicture={comment.profilePicture}
      ></ProfilePopup>
    </div>
    <div className="w-full">
      <div className="flex items-center flex-row w-full justify-between">
        <div className="flex flex-col align-center">
          <h2 className="text-lg font-bold tracking-tight">
            @{comment.username}
          </h2>
          {comment.rating !== null && (
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i
                    key={i}
                    className={`material-icons text-md cursor-pointer ${
                      i <= comment.rating
                        ? "text-white hover:text-gray-200"
                        : "text-gray-400 hover:text-gray-500"
                    }`}
                    style={{
                      textShadow:
                        i <= comment.rating
                          ? "1px 1px 2px rgba(0,0,0,0.5)"
                          : undefined,
                    }}
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

        <div className="flex flex-row align-center items-center">
          <p className="text-sm mr-0 ml-auto tracking-tighter">
            {new Date(comment.posted_at).toLocaleDateString()}
          </p>
          {comment.user === user.id && (
            <i
              className="material-icons text-xl ml-4 text-gray-600 transition duration-300 hover:cursor-pointer hover:text-red-500"
              onClick={() => {
                handleDeleteComment(comment.id);
              }}
            >
              delete
            </i>
          )}
        </div>
      </div>
      <p className="text-md mt-2 tracking-tighter">
        {comment.content}
      </p>
    </div>
  </div>
  );
}
