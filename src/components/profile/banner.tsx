"use client";

import { useEffect, useState } from "react";
import fileURL from "../../utils/funcs/createUrlImage";
import { addUserHook } from "../../hooks/general/addUserHook";
import { useRouter } from "next/navigation";
import { useSession } from "../../utils/context/ContextSession";
import { isFollowedByHook, deleteFollowerHook, addFollowerHook } from "../../hooks/general/followersHook";
import Follows from "./follows";

export default function Banner({ userProp }) {
  const [propUser, setPropUser] = useState({ ...userProp });
  const [userCopy, setUserCopy] = useState({ ...userProp });
  const [editable, setEditable] = useState(false);
  const [openFollows, setOpenFollows] = useState(false);
  const [typeFollows, setTypeFollows] = useState("");
  const [isFollowed, setIsFollowed] = useState(null);

  const {user} = useSession();

  const router = useRouter();

  const setUsername = (username) => setUserCopy({ ...userCopy, username });
  const setDescription = (description) =>
    setUserCopy({ ...userCopy, description });
  const setBanner = (banner) => setUserCopy({ ...userCopy, banner });
  const setProfilePicture = (profilePicture) =>
    setUserCopy({ ...userCopy, profilePicture });
  const setLink = (link) => setUserCopy({ ...userCopy, link });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addUserHook(userCopy);
    if (response.result === "username_exists") {
      alert("El nombre de usuario ya existe. Intenta seleccionar otro");
      setEditable(true);
    } else {
      setPropUser({ ...userCopy });
      setEditable(false);
    }
  };

  const handleIsFollowed = () => {
    if(user) {
      isFollowedByHook(userProp.id, user.id).then((response) => {
        setIsFollowed(response.follows);
      });
    }
  }

  useEffect(() => {
    setPropUser({ ...userProp });
    setUserCopy({ ...userProp });
  }, [userProp]);

  useEffect(() => {
    if(user && userProp) handleIsFollowed();
  }, [user]);

  const handleFollow = () => {
    if (isFollowed) {
      deleteFollowerHook(user.id, userProp.id).then(() => {
        handleIsFollowed();
      });
    } else {
      addFollowerHook(user.id, userProp.id).then(() => {
        handleIsFollowed();
      });
    }
  };

  const handleCancel = () => {
    setUserCopy({ ...propUser });
    setEditable(false);
  };

  return (
    <>
      {!editable && (
        <div className="relative w-full mb-6 no-print">
          <div className="flex flex-col justify-center items-center">
            {propUser.banner ? (
              <div className="cursor-pointer relative flex justify-end items-center w-full h-[200px] overflow-hidden">
                <img
                  src={propUser.banner}
                  className="w-full h-[200px] object-cover cursor-pointer"
                  alt="banner"
                  onClick={() => router.push(`/main/user/${propUser.id}`)}
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
              {propUser.profilePicture ? (
                <img
                  src={propUser.profilePicture}
                  alt="Profile Picture"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => router.push(`/main/user/${propUser.id}`)}
                />
              ) : (
                <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
                  person
                </i>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between w-full px-6 h-[fit] z-10 bg-white">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col pt-[60px] ">
                <h2 className="text-xl font-bold mr-5">
                  {propUser.username || "username"}
                </h2>
              </div>
              <div className="flex flex-row gap-2">
                {user?.id === userProp?.id && (
                  <button
                    onClick={() => setEditable(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold h-[40px] mt-4 px-3 rounded-full"
                  >
                    <i className="material-icons text-lg">edit</i>
                  </button>
                )}
                {user?.id !== userProp?.id && isFollowed !== null && (
                  <button
                    onClick={handleFollow}
                    className={`${
                      isFollowed ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"
                    } text-white font-bold h-[40px] mt-4 px-4 rounded-full`}
                  >
                    {isFollowed ? "Unfollow" : "Seguir"}
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full py-2">
              <p className="text-sm text-gray-600 tracking-tight pb-2">
                {propUser.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis natoque penatibus."}
              </p>
              <div className="flex flex-row mb-2 flex-wrap">
                <div className="flex flex-row">
                  <i className="material-icons text-gray-600 text-sm mr-1">
                    calendar_today
                  </i>
                  <p className="text-sm italic text-gray-600 mr-4">
                    Miembro desde{" "}
                    {propUser.memberSince
                      ? new Date(propUser.memberSince).toLocaleDateString(
                          "es-ES"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="flex flex-row">
                  <i className="material-icons text-gray-600 text-sm mr-1">
                    link
                  </i>
                  <a
                    href={propUser.link}
                    className="text-sm italic text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {propUser.link}
                  </a>
                </div>
              </div>
              <div className="flex flex-row">
                <p
                  className="text-sm text-gray-600 mr-2 cursor-pointer"
                  onClick={() => {setOpenFollows(true); setTypeFollows("following")}}
                >
                  <span className="font-bold">Siguiendo:</span>{" "}
                  {propUser.following || 0}
                </p>
                <p
                  className="text-sm text-gray-600 cursor-pointer"
                  onClick={() => {setOpenFollows(true); setTypeFollows("followers")}}
                >
                  <span className="font-bold">Seguidores:</span>{" "}
                  {propUser.followers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Follows open={openFollows} setOpen={setOpenFollows} setType={setTypeFollows} type={typeFollows} user={userProp}></Follows>
      {editable && (
        <div className="bg-white">
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
                {userCopy.banner ? (
                  <div className="cursor-pointer relative flex justify-end items-center w-full h-[200px] overflow-hidden">
                    <img
                      src={userCopy.banner}
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
              <div className="flex w-[125px] h-[125px] rounded-full overflow-hidden border-4 items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-100 border-white">
                <input
                  accept="image/*"
                  id="imageProfile"
                  type="file"
                  hidden
                  onChange={(e) => fileURL(e, (url) => setProfilePicture(url))}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between w-full px-6 pb-6 h-[fit] z-10 bg-gray-300">
              <div className="flex flex-row justify-end">
                <div className="flex flex-row gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold h-[40px] mt-4 px-3 rounded-full"
                  >
                    <i className="material-icons text-lg">close</i>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold h-[40px] mt-4 px-3 rounded-full"
                  >
                    <i className="material-icons text-lg">check</i>
                  </button>
                  {userProp.id !== user.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow();
                      }}
                      className={`bg-${isFollowed ? "red-500 hover:red-700" : "blue-500 hover:blue-700"} text-white font-bold h-[40px] mt-4 px-4 rounded-full`}
                    >
                      {isFollowed ? "Dejar de seguir" : "Seguir"}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between w-full py-2">
                <label className="text-sm">Editar nombre de usuario</label>
                <input
                  type="text"
                  value={userCopy.username || ""}
                  maxLength={25}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-xl font-bold mr-5 border border-black rounded p-1 w-full"
                />
                <label className="text-sm mt-2">Editar descripción</label>
                <textarea
                  value={userCopy.description || ""}
                  maxLength={150}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm text-gray-600 tracking-tight pb-2 border border-black rounded p-1 mb-3 h-[100px]"
                />
                <i className="material-icons text-gray-600 text-sm">link</i>
                <input
                  type="url"
                  placeholder="https://example.com"
                  maxLength={50}
                  value={userCopy.link || ""}
                  onChange={(e) => setLink(e.target.value)}
                  className="text-sm italic text-blue-700 rounded p-1 w-full mb-3"
                />
                <div className="flex flex-row">
                  <p className="text-sm text-gray-600 mr-2">
                    <span className="font-bold">Siguiendo:</span>{" "}
                    {userCopy.following || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Seguidores:</span>{" "}
                    {userCopy.followers || 0}
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
