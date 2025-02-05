import { LoginData } from "../../../utils/interfaces/login";

export const loginHook = async (data: LoginData) => {

  const { email, password, remember} = data;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, remember }),
    });

    return await res.json();
};
