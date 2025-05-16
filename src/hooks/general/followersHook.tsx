export const addFollowerHook = async (follower, followed) => {

    const res = await fetch("/api/add/addFollower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ follower, followed }),
    });

    return await res.json();
};

export const deleteFollowerHook = async (follower, followed) => {

    const res = await fetch("/api/delete/deleteFollower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ follower, followed }),
    });

    return await res.json();
};

export const getFollowersHook = async (userId: number) => {

  const res = await fetch(`/api/get/getFollowers/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
}
  
export const getFollowingHook = async (userId: number) => {

  const res = await fetch(`/api/get/getFollowings/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
}

export const isFollowedByHook = async (userId_1, userId_2) => {
    
    const res = await fetch(`/api/get/isFollowedBy/${userId_1}/${userId_2}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache'
      },
    });
  
    return await res.json();
}
