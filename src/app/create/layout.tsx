"use client";
export const dynamic = 'force-dynamic'; // 👈 tells Next.js this page is dynamic

import { useState } from "react";
import Menu from "../../components/home/menu";
import { useRouter, usePathname } from "next/navigation";
import CreateMap from "../../components/create/createMap";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="flex flex-col-reverse lg:flex-row h-full">
      <div className="flex flex-col shrink-0 overflow-x-clip lg:w-[525px] w-full z-[100] bg-white shadow-[10px_0_75px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sticky top-0 bottom-0 z-[50] bg-white">
            <div className=" bg-white grid grid-cols-3 border-b-[1px] border-gray-300">
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
        <div className="fixed mt-2 mr-2 top-0 right-0 z-50">
          <button
            className="px-2 pt-1 text-gray-200 hover:text-white transition-colors rounded-xl bg-blue-500"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="material-icons text-3xl">menu</span>
          </button>
        </div>

        <Menu open={open} setOpen={setOpen} />
      </div>
        <div className="sticky top-0 z-[50] w-full bg-white lg:h-screen h-[70vh]">
          <CreateMap />
        </div>
    </div>
  );
}
