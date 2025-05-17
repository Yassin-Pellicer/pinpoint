import { useState } from "react";
import { useContext } from "react";
import { deleteCommentHook } from "../../hooks/main/delete/deleteCommentHook";
import ProfilePopup from "../profile/profilePopup";
import { useSession } from "../../utils/context/ContextSession";
import { useRouter } from "next/navigation";

export default function Comment({ comment, refresh, setRefresh }) {

  const { user } = useSession();
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const handleDeleteComment = async (commentId) => {
    deleteCommentHook(commentId);
  };
  
  return (
    <div className="flex flex-row transition-padding p-4 border-t-[1px] border-gray-300 bg-white cursor-default">
      <div
        onClick={() => {
          router.push(`/main/user/${comment.user}`);
        }}
      >
        <div className="flex w-[50px] h-[50px] mr-2 border-[1px] border-gray-300 rounded-full shrink-0 overflow-hidden cursor-pointer">
          {user?.profilePicture ? (
            <ProfilePopup
              id={user.id}
              profilePicture={user.profilePicture}
            ></ProfilePopup>
          ) : (
            <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
              person
            </i>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center flex-row w-full justify-between">
          <div className="flex flex-col align-center">
            <h2
              className="text-lg hover:underline cursor-pointer font-bold tracking-tight"
              onClick={() => router.push(`/main/user/${comment.user}`)}
            >
              @{comment.username}
            </h2>
            {comment.rating !== null && (
              <div>
                <div className="flex mt-[-5px]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i
                      key={i}
                      className={`material-icons text-sm cursor-pointer ${
                        i <= comment.rating
                          ? "text-yellow-400 hover:text-yellow-300"
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
            {comment.isprivate ? (
              <i className="material-icons text-sm mr-2">visibility_off</i>
            ) : (
              <i className="material-icons text-sm mr-2">visibility</i>
            )}
            <p className="text-sm mr-0 ml-auto tracking-tighter">
              {new Date(comment.posted_at).toLocaleDateString()}
            </p>
            {comment.user === user.id && (
              <i
                className="material-icons text-xl ml-4 text-gray-600 transition duration-300 hover:cursor-pointer hover:text-red-500"
                onClick={() => {
                  setRefresh(!refresh);
                  handleDeleteComment(comment.id);
                }}
              >
                delete
              </i>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 tracking-tight pb-2">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
