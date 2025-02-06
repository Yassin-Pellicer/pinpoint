"use client";
import { ReactNode } from "react";
import Menu from "../../../components/home/menu";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex flex-row">

      {/* CONTENT */}
      {children}

      {/* MENU */}
      <div className="fixed top-0 right-0 z-50">
        <button
          className="p-2 text-gray-200 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
        >
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      <Menu open={open} setOpen={setOpen} />
    </main>
  );
}
