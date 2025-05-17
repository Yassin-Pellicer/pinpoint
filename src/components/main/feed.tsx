"use client";
import { useState } from "react";
import { useMapContext } from "../../utils/context/ContextMap";
import ActivityList from "../profile/activityList";

const ProfileTabs = () => {
  const { setSelectedEvent, userActivityFeed, globalActivityFeed } = useMapContext();
  const [activeTab, setActiveTab] = useState("feed");

  const tabData = [
    {
      id: "feed",
      name: "Lo que está pasando",
      icon: "star",
      description: "Revisa y edita los eventos que has creado.",
      component: <ActivityList activities={userActivityFeed} />
    },
    {
      id: "following",
      name: "Siguiendo",
      icon: "list",
      description: "Eventos a los que estás inscrito.",
      component: <ActivityList activities={globalActivityFeed} />
    },
  ];

  const activeTabData = tabData.find(tab => tab.id === activeTab);

  return (
    <>
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