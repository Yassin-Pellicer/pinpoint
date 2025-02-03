import { useRouter } from "next/navigation";
import { SignupData } from "../../../utils/interfaces/signup";

export const signupHook = async (data: SignupData): Promise<{ result: "ok" | "error" }> => {

  const { username, email, password, passwordCheck } = data;

  if (!username || !email || !password || !passwordCheck) {
    alert("All fields are required.");
    return { result: "error" };
  }

  if (password !== passwordCheck) {
    alert("Passwords do not match.");
    return { result: "error" };
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return { result: "error" };
  }

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await res.json();

    if (result.result === "ok") {
      console.log("User created: ", result);
      alert("User successfully registered!");
      return result;
    } else {
      console.log("Error:", result);
      alert("An error occurred. Please try again.");
      return { result: "error" };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. These credentials may already be in use.");
    return { result: "error" };
  }
};
