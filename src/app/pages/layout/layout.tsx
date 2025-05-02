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
  const { setUser } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // Initial load state

  useEffect(() => {
    const fetchSessionFromCookies = async () => {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();

        if (data.auth) {
          const userRes = await getUserHook(data.id);
          setUser(userRes.user);
        } else {
          router.push("/pages/auth/login");
        }
      } catch (error) {
        console.error("Session fetch failed:", error);
        router.push("/pages/auth/login");
      } finally {
        setLoading(false); // Done loading on initial fetch
      }
    };

    fetchSessionFromCookies();
  }, [router, setUser]);

  // Optional: show loading when pathname changes
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Fake loading effect, can remove or tweak

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <main className="">
      {loading && <LoadingScreen />}

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
