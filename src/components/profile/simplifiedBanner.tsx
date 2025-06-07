"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../../utils/context/ContextSession";

export default function Banner({ }) {

  const { user } = useSession();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col">
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
                  className="text-md tracking-tighter font-bold text-white"
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
                  className="text-md tracking-tighter font-bold text-white"
                >
                  Accede a tu perfil y revisa tus eventos, comentarios y
                  signups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
