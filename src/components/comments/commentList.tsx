"use client";
import { useEffect, useState } from "react";
import { getCommentsHook } from "../../hooks/main/get/getCommentsHook";
import { useSession } from "../../utils/context/ContextSession";
import { useMapContext } from "../../utils/context/ContextMap";
import CommentTag from "./comment";
import { Comment } from "../../utils/classes/Comment";

const List = ({refresh, setRefresh}) => {
  const { selectedEvent } = useMapContext();
  const { user } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    getCommentsHook(selectedEvent.id)
      .then((response) => {
        setComments(response.comments);
      })
      .finally(() => setLoading(false));
  }, [selectedEvent.id, refresh]);

  return (
    <>
      {!loading && comments && selectedEvent.enableComments && (
        <>
          <div className="h-auto bg-blue-400 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div className="relative p-5 z-10">
                <div className="flex flex-row items-center">
                  <i
                    className="material-icons text-white text-4xl mr-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    forum
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Sección de comentarios
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {comments.map((comment) => (
            <CommentTag
              key={comment.id}
              comment={comment}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ))}
        </>
      )}
    </>
  );
}
export default List;

