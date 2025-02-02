import { useRouter } from "next/navigation";
import { LoginData } from "../../../utils/interfaces/login";

export const loginHook = async (data: LoginData): Promise<{ result: "ok" | "error" }> => {

  const { email, password, remember} = data;

  if (!email || !password) {
    alert("All fields are required.");
    return { result: "error" };
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, remember }),
    });

    const result = await res.json();

    if (result.result === "ok") {
      alert("User found!");
      return result;
    } else {
      console.log("Error:", result);
      alert("An error occurred. Please try again.");
      return { result: "error" };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { result: "error" };
  }
};
