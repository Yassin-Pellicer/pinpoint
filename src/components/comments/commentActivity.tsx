import { useState } from "react";
import { useContext } from "react";
import { deleteCommentHook } from "../../hooks/main/delete/deleteCommentHook";
import ProfilePopup from "../profile/profilePopup";
import { useSession } from "../../utils/context/ContextSession";
import { useRouter } from "next/navigation";

export default function Comment({ comment, refresh }) {

  const { user } = useSession();
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const handleDeleteComment = async (commentId) => {
    deleteCommentHook(commentId);
  };
  
  return (
    <div className="flex flex-row cursor-default pl-14">
      <div className="w-full">
        <div className="flex items-center flex-row w-full justify-between">
          <div className="flex flex-col align-center">
            <div className="flex flex-col">
              {" "}
              <h2 className="text-md font-bold mr-5 flex flex-col">
                @{user?.username || "username"}
              </h2>
            </div>
            {comment.rating !== null && (
              <div>
                <div className="flex">
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
