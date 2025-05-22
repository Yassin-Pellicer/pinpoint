"use client";
import { useEffect, useRef, useState } from "react";
import Menu from "../../components/home/menu";
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
    filterTags,
    search,
    searchResults,
    setSearch,
    loadSearchEvents,
    selectedEvent,
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

  return (
    <div className="flex flex-row">
      <div className="flex flex-col overflow-auto shrink-0 h-screen overflow-x-clip w-[525px] z-[100] bg-white shadow-[10px_0_75px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sticky top-0 z-[100] bg-white">
          <div className="flex flex-row mt-2 justify-center p-2 bg-white-500 w-full h-fit items-center align-center">
          <div
            className="flex w-[35px] h-[35px] mr-2 border-[1px] border-gray-300 rounded-full shrink-0 overflow-hidden cursor-pointer"
            onClick={() => router.push(`/main/user/${user?.id}`)}
          >
            {user?.profilePicture ? (
              <ProfilePopup
                id={user.id}
                profilePicture={user.profilePicture}
              ></ProfilePopup>
            ) : (
              <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
                person
              </i>
            )}
          </div>
            <input
              type="text"
              className="border-[1px] border-gray-500 rounded-full ml-2 px-4 py-2 w-full text-xs"
              placeholder={"Escribe para buscar eventos"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={(e) => {
                setOpenTags(!openTags);
                e.preventDefault();
              }}
              className="font-bold bg-blue-500 border-gray-400 text-sm text-white
                text-white-500 rounded-2xl hover:bg px-2 h-[34px] hover:bg-blue-500
                border-[1px] hover:text-white w-fit
                transition duration-300 mr-2 ml-4"
            >
              Tags
            </button>
            <button
            onClick={(e) => {
              e.preventDefault();
              addUnlockedEvent(user.id, search).then((res) => {
                console.log(res)
                router.push(`/main/event/${res.event}`);
              });
            }}
              className={`font-bold bg-blue-500 border-gray-400 text-sm text-white
                text-white-500 rounded-2xl px-2 h-[34px] ${search.trim() !== "" ? "hover:bg-green-500" : "hover:bg-blue-600"}
                border-[1px] hover:text-white w-fit
                transition duration-300 mr-4`}
            >
              <i className="material-icons text-white text-xl">
                {search.trim() !== "" ? "lock_open" : "lock"}
              </i>
            </button>
          </div>
          <div className=" px-2 mb-2                                                                                                                                                                                                                                                                   ">
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
            <button
              onClick={() => router.forward()}
              className="bg-white h-full hover:bg-gray-200 shadow-2xl"
            >
              <i className="material-icons text-black text-xl">arrow_forward</i>
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
        <Tags open={openTags} setOpen={setOpenTags} filterMode={true} />

        <Menu open={open} setOpen={setOpen} />
      </div>
      <MainMap />
    </div>
  );
}
