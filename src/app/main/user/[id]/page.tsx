"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import EventCarousel from "../../../../components/profile/profileEventCarousel";
import EventBookmarkList from "../../../../components/profile/eventBookmarkList";
import EventInscriptions from "../../../../components/profile/eventInscriptionList";
import Banner from "../../../../components/ui/banner";
import { useEffect, useState } from "react";
import { getEventsByAuthor, getEventsByBookmark, getEventsByInscription } from "../../../../hooks/main/get/getEventsHook";
import { getUserHook } from "../../../../hooks/general/getUserHook";
import { useMapContext } from "../../../../utils/context/ContextMap";

const profile = () => {
  const { id } = useParams();
  const router = useRouter();

  const {setSelectedEvent} = useMapContext();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setSelectedEvent(null);
    getUserHook(Number(id)).then((response) => {
      setUser(response.user);
    });
  }, [id])

  useEffect(() => {
    if (user?.id != null) {
      getEventsByInscription(user?.id).then(async (response) => {
        console.log("Fetched inscriptions", response);
        setInscriptions(response.events);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.id != null) {
      getEventsByBookmark(user?.id).then(async (response) => {
        console.log("Fetched bookmarks", response);
        setBookmarks(response.events);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.id != null) {
      getEventsByAuthor(user?.id).then(async (response) => {
        console.log("Fetched created events", response);
        setCreatedEvents(response.events);
      });
    }
  }, [user]);

  return (
    <>
      <div className="sticky top-0 z-50 bg-white grid grid-cols-[80%_20%]">
        <button
          onClick={() => router.back()}
          className="bg-blue-400 h-full hover:bg-blue-500 shadow-2xl"
        >
          <i className="material-icons text-white text-xl">arrow_back</i>
        </button>

        <button
          onClick={() => router.push("/main/home")}
          className="bg-green-400 h-full hover:bg-green-500 shadow-2xl"
        >
          <i className="material-icons text-white text-xl">home</i>
        </button>
      </div>

      <Banner user={user}></Banner>

      <div className=" mt-4">
        <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-0 top-0 bottom-0 w-1/2 h-3/4 transform rotate-[5deg] z-0 m-5"
              style={{
                backgroundImage: "url('/img/recommended.png')",
              }}
            ></div>

            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center">
                <i
                  className="material-icons text-white text-3xl mr-5"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  star
                </i>
                <h1
                  className="text-2xl tracking-tighter font-bold mb-2 text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Eventos creados por ti
                </h1>
              </div>
              <p
                className="text-sm tracking-tighter font-bold text-white"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Revisa y edita los eventos que has creado.
              </p>
            </div>
          </div>
        </div>
        <EventCarousel events={createdEvents} />
      </div>

      <div className=" mt-4">
        <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center">
                <i
                  className="material-icons text-white text-3xl mr-5"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  list
                </i>
                <h1
                  className="text-2xl tracking-tighter font-bold text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Tus inscripciones
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <EventInscriptions events={inscriptions} />
        </div>
      </div>

      <div className=" mt-4">
        <div className="h-auto rounded-t-2xl bg-blue-400 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center">
                <i
                  className="material-icons text-white text-3xl mr-5"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  bookmark
                </i>
                <h1
                  className="text-2xl tracking-tighter font-bold text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Eventos Guardados
                </h1>
              </div>
            </div>
          </div>
        </div>
        <EventBookmarkList events={bookmarks} />
      </div>
    </>
  );
};

export default profile;
