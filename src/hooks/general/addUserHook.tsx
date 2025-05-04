import { User } from "../../utils/classes/User";

export const addUserHook = async (user: User) => {

  const { id, username, profilePicture, banner, description, link } = user;

    const res = await fetch("/api/add/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, username, profilePicture, banner, description, link }),
    });

    return await res.json();
};
