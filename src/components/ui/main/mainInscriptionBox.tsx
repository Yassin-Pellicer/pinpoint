"use client";
import { useEffect, useState } from "react";
import { useSession } from "../../../utils/context/ContextSession";
import { deleteInscriptionHook } from "../../../hooks/main/delete/deleteInscriptionHook";
import { addInscriptionHook } from "../../../hooks/main/add/addInscriptionHook";
import { useMapContext } from "../../../utils/context/ContextMap";
import { getCheckInscription } from "../../../hooks/main/get/getCheckInscriptionHook";
import UserList from "../../main/userInscribedList";
import { getInscribedUsers } from "../../../hooks/main/get/getInscribedUsers";

const mainInscribedBox = ({ event }) => {
  const [isInscribed, setIsInscribed] = useState(null);
  const { user } = useSession();
  const { setModifiedEvent } = useMapContext();
  const [people, setPeople] = useState(Number(event.inscriptions));
  const [inscribedUsers, setInscribedUsers] = useState([]);

  useEffect(() => {
    if (user) {
      getCheckInscription(user.id, event.id).then((response) => {
        setIsInscribed(response.isInscribed);
      })
      if (event.enableInscription && user && user.id === event.author){
        getInscribedUsers(event.id).then((response) => {
          setInscribedUsers(response.inscriptions);
        })
      }
    }
  }, [user?.id]);

  const handleUploadInscription = async () => {
    const response = await addInscriptionHook(event.id, user.id);

    setPeople((prevPeople) => prevPeople + 1);
    setModifiedEvent(event);
    setIsInscribed(true);
  };

  const handleDeleteInscription = async () => {
    const response = await deleteInscriptionHook(event.id, user.id);

    setPeople((prevPeople) => prevPeople - 1);
    setModifiedEvent(event); 
    setIsInscribed(false);
  };

  return (
    <>
      {event.enableInscription && user && (
        <div
          className={`no-print h-auto ${
            isInscribed ? "bg-green-500" : "bg-amber-400"
          } relative hover:cursor-pointer transition duration-100`}
        >
          <div className="relative h-full">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-[-40px] top-[-15px] bottom-0 w-1/2 transform"
              style={{
                backgroundImage: "url('/img/checklist.png')",
                transform: "rotate(5deg)",
                scale: "0.8",
                opacity: "0.7",
              }}
            ></div>
            <div className="relative z-10 p-5">
              {isInscribed === null ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  <h1
                    className="text-3xl tracking-tighter font-extrabold mb-2 text-white"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {isInscribed
                      ? "Estás inscrito al evento"
                      : "¡Inscribirse al evento!"}
                  </h1>
                  <p
                    className="text-sm tracking-tighter font-bold text-white"
                    style={{
                      textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    Este evento tiene aforo limitado, así que asegúrate de
                    inscribirte!
                  </p>
                  <div className="mt-4 flex items-center align-center flex-row justify-between">
                    <button
                      onClick={() =>
                        isInscribed
                          ? handleDeleteInscription()
                          : handleUploadInscription()
                      }
                      className={`rounded-full w-[150px] font-extrabold tracking-tighter ${
                        !isInscribed
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-red-600 hover:bg-red-700"
                      } py-2 px-4 text-white`}
                    >
                      {!isInscribed ? "Inscribirse!" : "Desinscribirte"}
                    </button>
                    {event.capacity && (
                      <div className="flex items-center flex-row">
                        <h2
                          style={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          <i className="material-icons text-white text-3xl">
                            people
                          </i>
                        </h2>
                        <h2
                          className="text-white text-6xl font-caveat font-extrabold ml-2"
                          style={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          {people}
                        </h2>
                        <h2
                          className="text-white text-2xl font-extrabold ml-2"
                          style={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          /{event.capacity}
                        </h2>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {event.enableInscription && user && user.id === event.author && (
        <div className="no-print">
          {inscribedUsers.length > 1 && (
            <div className="no-print relative p-5 z-10">
              <div className="flex flex-row items-center ">
                <h1 className="text-2xl tracking-tighter font-bold text-black">
                  Inscritos al evento
                </h1>
              </div>
            </div>
          )}
          <UserList users={inscribedUsers} />
        </div>
      )}
    </>
  );
};

export default mainInscribedBox;
