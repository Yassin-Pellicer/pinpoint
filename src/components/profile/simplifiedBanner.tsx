"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../utils/context/ContextSession";
import ProfilePopup from "./profilePopup";

export default function Banner({ userProp }) {
  const [propUser, setPropUser] = useState({ ...userProp });
  const [editable, setEditable] = useState(false);
  const [isFollowed, setIsFollowed] = useState(null);

  const {user} = useSession();
  const router = useRouter();

  return (
    <>
      {!editable && (
        <div className="flex flex-col">
          <div className="h-auto bg-white relative transition duration-100 overflow-hidden border-b-[1px] border-gray-300">
            <div className="relative p-6 pt-2 z-6">
              <div className="flex flex-row items-center ">
                <h1 className="text-4xl tracking-tighter font-bold mt-4 text-black">
                  Bienvenido a Pinpoint
                </h1>
              </div>
            </div>
          </div>
          <div className="relative flex align-center items-center flex-row w-full mb-4">
            <div className="flex flex-row px-6 transform z-20">
              <div className="flex w-[70px] h-[70px] mt-4 rounded-full overflow-hidden border-4 items-center justify-center bg-gray-300 border-white">
                {propUser.profilePicture ? (
                  <ProfilePopup
                    id={propUser.id}
                    profilePicture={propUser.profilePicture}
                  />
                ) : (
                  <i className="text-gray-400 material-icons text-center text-[150px] mt-8 select-none">
                    person
                  </i>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full pr-6 h-[fit] z-10 bg-white">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col pt-[20px] ">
                  <h2 className="text-xl font-bold mr-5">
                    {propUser.username || "username"}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full py-2">
                <p className="text-sm text-gray-600 tracking-tight">
                  {propUser.description}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              onClick={() => router.push("/create")}
              className=" bg-red-500 relative hover:cursor-pointer hover:bg-red-600 transition duration-100"
            >
              <div className="relative h-full">
                <div
                  className="bg-no-repeat bg-center bg-cover absolute w-1/2 inset-0 top-2"
                  style={{
                    backgroundImage: "url('/img/cpcreate.png')",
                    transform: "rotate(-5deg)",
                  }}
                ></div>
                <div className="relative z-10 p-5 h-full bg-black/20">
                  <h1
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="text-2xl tracking-tighter font-bold mb-2 text-white"
                  >
                    ¡Crea un evento ahora!
                  </h1>
                  <p
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="text-md tracking-tighter font-bold text-white mb-8"
                  >
                    Crea tu evento y comparte planes con la comunidad
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => router.push("/main/user/" + user?.id)}
              className="h-auto bg-green-400 relative hover:cursor-pointer hover:bg-green-500 transition duration-100"
            >
              <div className="relative h-full">
                <div
                  className="bg-no-repeat bg-center bg-cover absolute right-0 bottom-0 w-1/2 h-3/4 transform top-2"
                  style={{
                    backgroundImage: "url('/img/comment.png')",
                    transform: "rotate(5deg)",
                  }}
                ></div>
                <div className="relative z-10 p-5 h-full bg-black/20">
                  <h1
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="text-2xl tracking-tighter font-bold mb-2 text-white"
                  >
                    Entra a tu perfil
                  </h1>
                  <p
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="text-md tracking-tighter font-bold text-white mb-8"
                  >
                    Accede a tu perfil y revisa tus eventos, comentarios y
                    signups.
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
