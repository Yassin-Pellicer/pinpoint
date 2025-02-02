"use client";

import Link from "next/link";
import Logo from "../../../../components/ui/logo";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { loginHook } from "../../../../hooks/auth/login/login";
import { useRouter } from "next/navigation";

export default function Login() {

  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [loading, setLoading]             = useState(false);
  const [remember, setRemember]           = useState(false);
  const router                            = useRouter();

  const t = useTranslations("Login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const result = await loginHook({ email, password, remember});
    if (result.result !== "error") {
      router.push("/pages/home");
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

          <label className="font-semibold flex items-center text-white">
            <i className="material-icons mr-1">email</i>
            {t("email")}
          </label>
          <input
            type="text"
            className="rounded p-2 mt-1 mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <label className="font-semibold flex items-center text-white">
            <i className="material-icons mr-1">lock</i>
            {t("password")}
          </label>
          <input
            type="password"
            className="rounded p-2 mt-1 mb-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <label className="select-none font-caveat font-extrabold tracking-tighter text-3xl text-white">
              <input
                type="checkbox"
                className="mr-2"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              {t("remember")}
            </label>
          </div>

          <button
            type="submit"
            className="flex align-center justify-center w-full items-center bg-blue-600 text-white 
            text-4xl font-extrabold py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-caveat tracking-tighter"
          >
            {t("enter")}
          </button>

          <p className="justify-center text-center text-xl tracking-tight mt-6 text-white">{t("forgot")}</p>
          <Link href="/pages/auth/signup" className="justify-center text-center font-caveat 
          text-4xl tracking-tighter mt-2 underline text-white">
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

