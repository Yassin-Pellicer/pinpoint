import { SignupData } from "../../../utils/interfaces/signup";

export const signupHook = async (data: SignupData) => {

  const { username, email, password } = data;

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    return await res.json();
};
