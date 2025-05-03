"use client";

import { useState } from "react";
import { useSession } from "../../utils/context/ContextSession";
import fileURL from "../../utils/funcs/createUrlImage";

export default function Banner( {user} ) {
  const { 
    setBanner,
    setProfilePicture,
    setUsername,
    setDescription,
    setFollowers,
    setFollowing,
    setLink,
    setUser,
  } = useSession();

  const [editable, setEditable] = useState(false);
  const [userCopy, setUserCopy] = useState(user);

  const membershipYear = 2023;
  
  return (
    <>
      {!editable && (
        <div className="mb-6 rounded-2xl bg-white">
          <div className="relative w-full">
            <div className="flex flex-col justify-center items-center">
              {user?.banner ? (
                <div className="cursor-pointer relative flex justify-end items-center w-full h-[200px] overflow-hidden">
                  <img
                    src={user?.banner}
                    className="w-full h-[200px] object-cover"
                    alt="banner"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-[200px] p-14 bg-[#e6e6e6] ">
                  <i className="text-gray-400 material-icons mr-1 text-[150px] select-none">
                    photo
                  </i>
                </div>
              )}
            </div>
            <div className="flex flex-row absolute ml-[75px] transform -translate-x-1/2 top-[130px] z-20">
              <div className="flex w-[125px] h-[125px] rounded-full overflow-hidden border-4 items-center justify-center bg-gray-300 border-white">
                {user?.profilePicture ? (
                  <img
                    src={user?.profilePicture}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
                    person
                  </i>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full px-6 pb-6 rounded-b-2xl h-[fit] z-10 bg-gray-300">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col pt-[60px] ">
                  <h2 className="text-xl font-bold mr-5">
                    {user?.username || "username"}
                  </h2>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => setEditable(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold h-[40px] mt-4 px-3 rounded-full"
                  >
                    <i className="material-icons text-lg">edit</i>
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-[40px] mt-4 px-4 rounded-full">
                    Seguir
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full py-2">
                <p className="text-sm text-gray-600 tracking-tight pb-2">
                  {user?.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis natoque penatibus."}
                </p>
                <div className="flex flex-row mb-2 gap-4">
                  <div className="flex flex-row">
                    <i className="material-icons text-gray-600 text-sm mr-1">
                      calendar_today
                    </i>
                    <p className="text-sm italic text-gray-600 ">
                      Miembro desde {user?.membershipYear || 0}
                    </p>
                  </div>
                  <div className="flex flex-row">
                    <i className="material-icons text-gray-600 text-sm mr-1">
                      link
                    </i>
                    <a
                      href={user?.link}
                      className="text-sm italic text-blue-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user?.link}
                    </a>
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="text-sm text-gray-600 mr-2">
                    <span className="font-bold">Siguiendo:</span>{" "}
                    {user?.following || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Seguidores:</span>{" "}
                    {user?.followers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editable && (
        <div className="mb-6 rounded-2xl bg-white">
          <div className="relative w-full">
            <input
              accept="image/*"
              id="image"
              type="file"
              hidden
              onChange={(e) => fileURL(e, (url) => setBanner(url))}
            />
            <label htmlFor="image">
              <div className="flex flex-col justify-center items-center">
                {user?.banner ? (
                  <div className="cursor-pointer relative flex justify-end items-center w-full h-[200px] overflow-hidden">
                    <img
                      src={user?.banner}
                      className="w-full h-[200px] object-cover"
                      alt="banner"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col cursor-pointer justify-center items-center w-full h-[200px] p-14 bg-[#e6e6e6] hover:bg-gray-300 transition duration-100">
                    <i className="text-gray-400 material-icons mr-1 text-[150px] select-none">
                      add_photo_alternate
                    </i>
                  </div>
                )}
              </div>
            </label>
            <div className="flex flex-row absolute ml-[75px] transform -translate-x-1/2 top-[130px] z-20">
              <div className="flex w-[125px] h-[125px] rounded-full overflow-hidden border-4 items-center justify-center cursor-pointer bg-gray-300 border-white">
                <input
                  accept="image/*"
                  id="imageProfile"
                  type="file"
                  hidden
                  onChange={(e) => fileURL(e, (url) => setProfilePicture(url))}
                />
                <label
                  htmlFor="imageProfile"
                  className="w-full h-full flex items-center justify-center"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user?.profilePicture}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="text-gray-400 material-icons mt-8 text-[150px] select-none">
                      person
                    </i>
                  )}
                </label>
              </div>
            </div>

            <div className="flex flex-col justify-between w-full px-6 pb-6 rounded-b-2xl h-[fit] z-10 bg-gray-300">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col pt-[60px] ">
                <label className="text-sm">Editar nombre de usuario</label>
                  <input
                    type="text"
                    value={user?.username}
                    maxLength={25}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-xl font-bold mr-5 border border-black rounded p-1"
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => setEditable(false)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold h-[40px] mt-4 px-3 rounded-full"
                  >
                    <i className="material-icons text-lg">check</i>
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-[40px] mt-4 px-4 rounded-full">
                    Seguir
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full py-2">
              <label className="text-sm">Editar descripción</label>
                <textarea
                  value={user?.description}
                  maxLength={150}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm text-gray-600 tracking-tight pb-2 border border-black rounded p-1 mb-3 h-[100px]"
                />
                <div className="flex flex-row mb-2 gap-4">
                  <div className="flex items-center justify-center flex-row">
                    <i className="material-icons text-gray-600 text-sm mr-2 mb-2">
                      link
                    </i>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      maxLength={50}
                      value={user?.link}
                      onChange={(e) => setLink(e.target.value)}
                      className="text-sm italic text-blue-700 rounded p-1 mb-3"
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="text-sm text-gray-600 mr-2">
                    <span className="font-bold">Siguiendo:</span>{" "}
                    {user?.following || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Seguidores:</span>{" "}
                    {user?.followers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
