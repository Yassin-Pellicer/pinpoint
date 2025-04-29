import { Comment } from "../../../utils/classes/Comment";

export const addCommentHook = async ( eventId: number, userId: number, comment: Comment ) => {
    const res = await fetch("/api/add/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment, eventId, userId }),
    });

    return await res.json();
};
