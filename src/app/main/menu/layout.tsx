"use client";

import { ReactNode, useEffect, useState } from "react";
import Menu from "../../../components/home/menu";
import { useSession } from "../../../utils/context/ContextSession";
import { useRouter, usePathname } from "next/navigation";
import { getUserHook } from "../../../hooks/general/getUserHook";
import LoadingScreen from "../../../components/ui/loadingScreen";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <main className="">
      {children}

      <div className="fixed mt-2 mr-2 top-0 right-0 z-50">
        <button
          className="px-2 pt-1 text-gray-200 hover:text-white transition-colors rounded-xl bg-blue-500"
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      <Menu open={open} setOpen={setOpen} />
    </main>
  );
}
