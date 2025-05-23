export const deleteCommentHook = async ( commentId: number ) => {
    const res = await fetch("/api/delete/deleteComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId }),
    });

    return await res.json();
};
