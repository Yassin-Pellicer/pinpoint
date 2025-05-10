"use client";
import { useEffect, useState } from "react";
import Menu from "../../components/home/menu";
import MainMap from "../../components/main/mainMap";
import { useSession } from "../../utils/context/ContextSession";
import { getUserHook } from "../../hooks/general/getUserHook";
import { useMapContext } from "../../utils/context/ContextMap";
import Logo from "../../components/ui/logo_btn";
import EventCarouselList from "../../components/main/mainEventList";
import { useTranslations } from "next-intl";
import Tags from "../../components/create/tags";
import debounce from "lodash.debounce";
import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { setUser } = useSession();
  const [openTags, setOpenTags] = useState(false);
  const tagsTrans = useTranslations("Tags");

    const router = useRouter();

  const { filterTags, search, searchResults, setSearch, loadSearchEvents, selectedEvent } =
    useMapContext();

  useEffect(() => {
    const handler = debounce(async () => {
      await loadSearchEvents(filterTags, search);
    }, 500);
    handler();
    return () => handler.cancel && handler.cancel();
  }, [filterTags, search]);

  useEffect(() => {
    const fetchSessionFromCookies = async () => {
      const response = await fetch("/api/session");
      const data = await response.json();
      const userRes = await getUserHook(data.id);
      setUser(userRes.user);
    };

    fetchSessionFromCookies();
  }, []);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col overflow-auto shrink-0 h-screen w-[525px] z-[100] bg-white shadow-[10px_0_75px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sticky top-0 z-[100] bg-white">
          <div className="flex flex-row  justify-center p-2 bg-white-500 w-full h-fit items-center align-center">
            <div className="w-[24%] flex items-center justify-center">
              <Logo />
            </div>
            <input
              type="text"
              className="border-[1px] mx-4 border-gray-500 rounded-lg px-4 py-2 w-full text-xs"
              placeholder={"🔍 Escribe para buscar eventos"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={(e) => {
                setOpenTags(!openTags);
                e.preventDefault();
              }}
              className="font-bold bg-blue-500 border-gray-400 text-sm text-white
                text-white-500 rounded-lg px-2 h-[34px] hover:bg-blue-500
                border-[1px] hover:text-white w-fit
                transition duration-300 mr-2"
            >
              Tags
            </button>
            <button
              className="font-bold bg-blue-500 border-gray-400 text-sm text-white
                text-white-500 rounded-lg px-2 h-[34px] hover:bg-blue-500
                border-[1px] hover:text-white w-fit
                transition duration-300"
            >
              <i className="material-icons text-white text-xl">lock</i>
            </button>
          </div>
          <div className=" px-2                                                                                                                                                                                                                                                                      ">
            {filterTags.length > 0 && (
              <div className="flex flex-wrap w-full mb-2 gap-2">
                {filterTags.map((tag) => (
                  <div
                    key={tag.tag_id}
                    className={`rounded-full w-fit px-2 py-1 text-center text-white bg-[#3F7DEA] font-bold tracking-tight"}`}
                  >
                    <p className="text-xs">{tagsTrans(`${tag.tag_id}`)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {(search.trim() !== "" || filterTags.length > 0) && (
            <div className="max-h-[500px] z-[200] overflow-y-auto">
              <EventCarouselList events={searchResults} />
            </div>
          )}
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
              <button
                onClick={() => router.forward()}
                className="bg-white h-full hover:bg-gray-200 shadow-2xl"
              >
                <i className="material-icons text-black text-xl">
                  arrow_forward
                </i>
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
        <Tags open={openTags} setOpen={setOpenTags} />

        <Menu open={open} setOpen={setOpen} />
      </div>
      <MainMap />
    </div>
  );
}
