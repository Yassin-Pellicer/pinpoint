"use client";

import Link from "next/link";
import Logo from "../../components/ui/logo";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { signupHook } from "../../hooks/auth/signup/signupHook";
import { useRouter } from "next/navigation";

export default function Signup() {

  const [email, setEmail]                 = useState("");
  const [username, setUsername]           = useState("");
  const [password, setPassword]           = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [loading, setLoading]             = useState(false);
  const [errorMessage, setErrorMessage]   = useState("");

  const router = useRouter();
  const t = useTranslations("Signup");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password || !passwordCheck) {
      setErrorMessage(t("blank"));
      setLoading(false);
      return;
    }
    if (password !== passwordCheck) {
      setErrorMessage(t("passwordNoMatch"));
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setErrorMessage(t("passwordTooShort"))
      setLoading(false);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage(t("emailFormat"));
      setLoading(false);
      return;
    }

    try {
      const result = await signupHook({ email, username, password, passwordCheck});
      if (result.result === "user_exists") {
        setErrorMessage(t("userExists"));
      } else {
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage(t("exception"));
    } finally { 
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-row">
      {/* Form */}
      <div
        className="justify-center flex flex-col 
      items-center 2xl:align-center bg-[#737eff] w-[50vw] h-[100vh]"
      >
        <Link href="/">
          <Logo />
        </Link>
        <form className="flex mt-8 flex-col w-1/2" onSubmit={handleSubmit}>
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-white">
            {t("title")}
          </h1>

          {errorMessage !== "" && (
            <div className="bg-white p-3 mb-6 rounded-lg">
              <div className="flex items-center font-bold text-red-500 tracking-tight">
                <i className="material-icons mr-4 text-4xl">warning</i>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
          
          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">person</i>
            {t("user")}
          </label>
          <label className="font-semibold flex text-xs italic items-center text-white">
            {t("userWarn")}
          </label>
          <input
            type="text"
            maxLength={25}
            value={username}
            onClick={() => setErrorMessage("")}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded p-2 mt-1 mb-4 w-full"
          />

          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">email</i>
            {t("email")}
          </label>
          <input
            type="text"
            value={email}
            onClick={() => setErrorMessage("")}
            onChange={(e) => { setErrorMessage(""); setEmail(e.target.value)} }
            className="rounded p-2 mt-1 mb-4 w-full"
          />

          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">lock</i>
            {t("password")}
          </label>
          <input
            type="password"
            value={password}            
            onClick={() => setErrorMessage("")}
            onChange={(e) =>{ setErrorMessage(""); setPassword(e.target.value)} }
            className="rounded p-2 mt-1 mb-4 w-full"
          />

          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">check</i>
            {t("passwordConfirm")}
          </label>
          <input
            type="password"
            value={passwordCheck}
            onClick={() => setErrorMessage("")}
            onChange={(e) => { setErrorMessage(""); setPasswordCheck(e.target.value)} }
            className="rounded p-2 mt-1 mb-10 w-full"
          />

          <button
            type="submit"
            className="flex align-center justify-center w-full items-center bg-blue-600 text-white 
            text-4xl font-extrabold py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-caveat tracking-tighter"
            disabled={loading}
          >
            {loading ? t("loading") : t("enter")}
          </button>

          <p className="justify-center text-center text-xl tracking-tight mt-6 text-white">
            {t("forgot")}
          </p>
          <Link
            href="//login"
            className="justify-center text-center font-caveat 
          text-4xl tracking-tighter mt-2 underline text-white"
          >
            {t("register")}
          </Link>
        </form>
      </div>

      {/* Login Video */}
      <div
        className="justify-center flex flex-col 
      items-center 2xl:align-center bg-[#737eff] w-[50vw] h-[100vh]"
      >
        <video className="w-full h-full object-cover" autoPlay loop muted>
          <source src="/videos/authvideo.mp4" type="video/mp4" />
        </video>
      </div>
    </main>
  );
}
