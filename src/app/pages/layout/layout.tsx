"use client";
import { ReactNode, useEffect } from "react";
import Menu from "../../../components/home/menu";
import { useState } from "react";
import { useSession } from "../../../utils/context/ContextSession";
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const {username, setUsername, setId} = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchSessionFromCookies = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'cookie': document.cookie
        }
      });
      const data = await response.json();
      if (data.auth) {
        setUsername(data.user.username.username);
        setId(data.user.username.id);
      }
      else {
        router.push("/pages/auth/login")
      }
    };

    fetchSessionFromCookies();

  }, [])

  return (
    <main className="">

      {/* CONTENT */}
      {children}

      {/* MENU */}
      <div className="fixed mt-2 mr-2 top-0 right-0 z-50">
        <button
          className="px-2 pt-1 text-gray-200 hover:text-white transition-colors rounded-xl bg-blue-500"
          onClick={() => setOpen(prevOpen => !prevOpen)}
        >
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      <Menu open={open} setOpen={setOpen} />
    </main>
  );
}
