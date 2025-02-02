"use client";

import Link from "next/link";
import Logo from "../../../../components/ui/logo";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { signupHook } from "../../../../hooks/auth/signup/signup";
import { useRouter } from "next/navigation";

export default function Signup() {

  const [email, setEmail]                 = useState("");
  const [username, setUsername]           = useState("");
  const [password, setPassword]           = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [loading, setLoading]             = useState(false);
  const router                            = useRouter();

  const t = useTranslations("Signup");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const result = await signupHook({ email, username, password, passwordCheck });
    if (result.result !== "error") {
      router.push("/pages/auth/login");
    }
    setLoading(false);
  };

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

          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">person</i>
            {t("user")}
          </label>
          <label className="font-semibold flex text-xs italic items-center text-white">
            {t("userWarn")}
          </label>
          <input
            type="text"
            value={username}
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
            onChange={(e) => setEmail(e.target.value)}
            className="rounded p-2 mt-1 mb-4 w-full"
          />

          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">lock</i>
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded p-2 mt-1 mb-4 w-full"
          />

          <label className="font-semibold flex text-white">
            <i className="material-icons mr-1">check</i>
            {t("passwordConfirm")}
          </label>
          <input
            type="password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
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
            href="/pages/auth/login"
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
