"use client";
import { useState } from "react";
import Menu from "../../components/home/menu";
import MainMap from "../../components/main/mainMap";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col overflow-auto shrink-0 h-screen px-6 w-[550px]">
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
      <MainMap />
    </div>
  );
}
