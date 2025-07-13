"use client";
import { useEffect, useRef, useState } from "react";
import MainMap from "../../components/main/mainMap";
import { useSession } from "../../utils/context/ContextSession";
import { getUserHook } from "../../hooks/general/getUserHook";
import { useMapContext } from "../../utils/context/ContextMap";
import EventCarouselList from "../../components/main/mainEventList";
import { useTranslations } from "next-intl";
import Tags from "../../components/create/tags";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useEvent } from "../../utils/context/ContextEvent";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { Event } from "../../utils/classes/Event";
import ProfilePopup from "../../components/profile/profilePopup";
import { addUnlockedEvent } from "../../hooks/general/privateEventsHook";


export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { setUser, user } = useSession();
  const [openTags, setOpenTags] = useState(false);
  const tagsTrans = useTranslations("Tags");

  const router = useRouter();

  const {
    showMap,
    setShowMap,
    filterTags,
    search,
    searchResults,
    selectedEvent,
    setSearch,
    loadSearchEvents,
    setEditMode,
    setFilterTags,
  } = useMapContext();

  const { setEvent } = useEvent();
  const { setCheckpoints } = useCheckpoints();

  const handleTagSelection = (tagId) => {
    const selected = filterTags.filter((tag) => tag.tag_id !== tagId);
    setFilterTags(selected);
  };

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
    setEditMode(false);
    setEvent(new Event());
    setCheckpoints([]);
    setFilterTags([]);
    fetchSessionFromCookies();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 500, behavior: "smooth" })
  }, [selectedEvent])

  return (
    <div className="flex flex-col-reverse lg:flex-row h-full">
      <div className="flex flex-col shrink-0 overflow-x-clip lg:w-[525px] w-full z-[100] bg-white shadow-[10px_0_75px_rgba(0,0,0,0.3)] min-h-[100vh]">
        <div className="flex flex-col sticky top-0 bottom-0 z-[100] bg-white">
          <div className="lg:hidden flex justify-center items-center h-full">
            <div
              className="w-full h-[40px] bg-white flex justify-center items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
            >
              <div className="w-1/4 h-[5px] bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="flex flex-row justify-center md:py-4 pb-2 px-2 bg-white-500 w-full h-fit items-center align-center">
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-200 shadow-lg rounded-full w-full max-w-3xl mx-auto">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border shrink-0 border-gray-300 cursor-pointer"
                onClick={() =>
                  user ? router.push(`/main/user/${user.id}`) : router.push("/login")
                }
              >
                {user?.profilePicture ? (
                  <ProfilePopup
                    id={user.id}
                    profilePicture={user.profilePicture}
                  />
                ) : (
                  <i className="material-icons text-gray-400 text-[34px] leading-[40px] text-center w-full">
                    person
                  </i>
                )}
              </div>

              <input
                type="text"
                className="flex-1 bg-gray-50 border border-gray-300 rounded-full w-[100px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Escribe para buscar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                onClick={(e) => {
                  setOpenTags(!openTags);
                  e.preventDefault();
                }}
                title="Filtrar por tags"
                className="flex items-center justify-center px-3 h-9 text-sm font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                Tags
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  addUnlockedEvent(user.id, search).then((res) => {
                    router.push(`/main/event/${res.event}`);
                  });
                }}
                title={
                  search.trim() !== ""
                    ? "Desbloquear evento"
                    : "Bloquear búsqueda"
                }
                className={`flex items-center justify-center px-3 h-9 text-sm font-medium rounded-full border transition ${search.trim() !== ""
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
              >
                <i className="material-icons text-white text-base">
                  {search.trim() !== "" ? "lock_open" : "lock"}
                </i>
              </button>
            </div>
          </div>
          <div className="px-2 mb-2">
            {filterTags.length > 0 && (
              <div className="flex flex-wrap w-full mb-2 mt-1 gap-2">
                {filterTags.map((tag) => (
                  <div
                    key={tag.tag_id}
                    onClick={() => handleTagSelection(tag.tag_id)}
                    className={`rounded-full cursor-pointer w-fit px-2 py-1 text-center select-none text-white bg-[#3F7DEA] font-bold tracking-tight"}`}
                  >
                    <p className="text-xs">
                      <i className="material-icons text-xs mr-1">{tag.icon}</i>
                      {tagsTrans(`${tag.tag_id}`)}
                    </p>
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
          <div className="bg-white grid grid-cols-3 border-y-[1px] border-gray-300">
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
              <i className="material-icons text-black text-xl">arrow_forward</i>
            </button>
          </div>
        </div>
        {children}
        <Tags open={openTags} setOpen={setOpenTags} filterMode={true} createMode={false} />
      </div>
      {showMap && (
        <div className="sticky top-0 z-[50] w-full bg-white lg:h-screen h-[80dvh]">
          <MainMap />
        </div>
      )}
    </div>
  );
}
