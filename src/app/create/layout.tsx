"use client";
import { useEffect, useState } from "react";
import Menu from "../../components/home/menu";
import MainMap from "../../components/main/mainMap";
import { useSession } from "../../utils/context/ContextSession";
import { getUserHook } from "../../hooks/general/getUserHook";
import { useMapContext } from "../../utils/context/ContextMap";
import EventCarouselList from "../../components/main/mainEventList";
import { useTranslations } from "next-intl";
import Tags from "../../components/create/tags";
import debounce from "lodash.debounce";
import { useRouter, usePathname } from "next/navigation";
import CreateMap from "../../components/create/createMap";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { setUser } = useSession();
  const [openTags, setOpenTags] = useState(false);
  const tagsTrans = useTranslations("Tags");

  const router = useRouter();

  const { filterTags, search, searchResults, setSearch, loadSearchEvents, selectedEvent } =
    useMapContext();

  return (
    <div className="flex flex-row overflow-x-hidden">
      <div className="flex flex-col overflow-auto shrink-0 h-screen overflow-x-clip w-[525px] z-[100] bg-white shadow-[10px_0_75px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sticky top-0 z-[100] bg-white">
            <div className=" bg-white grid grid-cols-3">
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
      <CreateMap />
    </div>
  );
}
