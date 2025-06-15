"use client";
export const dynamic = "force-dynamic"; // 👈 tells Next.js this page is dynamic

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import CreateMap from "../../components/create/createMap";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="flex flex-col-reverse lg:flex-row h-full">
      <div className="flex flex-col shrink-0 overflow-x-clip lg:w-[525px] w-full z-[100] bg-white shadow-[10px_0_75px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sticky top-0 bottom-0 z-[50] bg-white">
          <div className="lg:hidden w-full h-[40px] bg-white flex justify-center items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
          >
            <div className="w-1/4 h-[5px] bg-gray-300 rounded-md"></div>
          </div>
          <div className=" bg-white grid grid-cols-3 border-y-[1px] border-gray-300">
            <button
              onClick={() => router.back()}
              className="bg-white h-full hover:bg-gray-200 shadow-2xl border-r-[1px] border-gray-400"
            >
              <i className="material-icons text-black text-xl">arrow_back</i>
            </button>
            <button
              onClick={() => router.push("/main/home")}
              className="bg-white h-full hover:bg-gray-200 shadow-2xl border-r-[1px] border-gray-400"
            >
              <i className="material-icons text-black text-xl">home</i>
            </button>
          </div>
        </div>

        {children}
      </div>
      <div className="sticky top-0 z-[50] w-full bg-white lg:h-screen h-[85vh]">
        <CreateMap />
      </div>
    </div>
  );
}
