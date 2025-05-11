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
import EventCarouselList  from "../../../../components/main/mainEventList";

const ProfileTabs = () => {
  const { id } = useParams();
  const router = useRouter();
  const { setSelectedEvent } = useMapContext();
  
  const [activeTab, setActiveTab] = useState("created");
  const [createdEvents, setCreatedEvents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setSelectedEvent(null);
    getUserHook(Number(id)).then((response) => {
      setUser(response.user);
    });
  }, [id, setSelectedEvent]);

  useEffect(() => {
    if (user?.id != null) {
      getEventsByInscription(user.id).then((response) => {
        setInscriptions(response.events);
      });

      getEventsByBookmark(user.id).then((response) => {
        setBookmarks(response.events);
      });

      getEventsByAuthor(user.id).then((response) => {
        setCreatedEvents(response.events);
      });
    }
  }, [user]);

  const tabData = [
    {
      id: "created",
      name: "Eventos",
      icon: "star",
      description: "Revisa y edita los eventos que has creado.",
      component: <EventCarouselList events={createdEvents} />
    },
    {
      id: "inscriptions",
      name: "Inscripciones",
      icon: "list",
      description: "Eventos a los que estás inscrito.",
      component: <EventInscriptions events={inscriptions} />
    },
    {
      id: "bookmarks",
      name: "Marcadores",
      icon: "bookmark",
      description: "Eventos que has guardado para más tarde.",
      component: <EventBookmarkList events={bookmarks} />
    },
    {
      id: "comments",
      name: "Actividad",
      icon: "comment",
      description: "Revisa y edita los eventos que has creado.",
      component: <EventCarouselList events={createdEvents} />
    },
  ];

  const activeTabData = tabData.find(tab => tab.id === activeTab);

  return (
    <>
      {!user && (
        <div className="flex flex-col">
          <div className="bg-gray-200 w-full h-[200px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
          </div>
          <div className="bg-gray-300 w-full h-[200px] flex flex-col p-4 items-center justify-center text-white">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-4 border-white"></div>
          </div>
        </div>
      )}

      {user && <Banner user={user} />}

      <div className="flex justify-around border-b border-gray-200 bg-white z-30 -mt-6">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-1 text-center relative hover:bg-gray-50 transition duration-150 ${
              activeTab === tab.id ? "font-bold" : "text-gray-500"
            }`}
          >
            <div className="flex align-center flex-row items-center justify-center">
              <i className="material-icons mr-2 text-lg">{tab.icon}</i>
              <span className="text-sm md:text-base">{tab.name}</span>
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
            )}
          </button>
        ))}
      </div>

      <div>
        {activeTabData?.component}
      </div>
    </>
  );
};

export default ProfileTabs;