"use client";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useTranslations } from "next-intl";
import CheckpointQRInfo from "./mainCheckpointQRInfo";
import { useEffect, useState } from "react";
import { getCheckpointsQRHook } from "../../hooks/main/get/getCheckpointsQHook";

const cpList = ({id}) => {
  const t = useTranslations("CpList");
  const [checkpointsQR, setCheckpointsQR] = useState([]);

  useEffect(() => {
    getCheckpointsQRHook(id).then((data) => {
      console.log(data);
      setCheckpointsQR(data.checkpoints || []);
    })
  }, [])

  return (
    <div className="relative flex flex-col overflow-y-auto">
      {checkpointsQR.length > 0 && (
        <div className="h-auto bg-blue-300 relative transition duration-100 overflow-hidden no-print">
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
                  className="material-icons text-white text-4xl mr-2"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  tour
                </i>
                <h1
                  className="text-2xl tracking-tighter font-bold text-white"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  Checkpoints QR
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {checkpointsQR?.map((checkpoint, index) => (
          <div
            key={checkpoint.id || `checkpoint-${index}`}
            className={
              "print-32 p-4 pb-5 bg-white border-[1px] border-gray-300 cursor-default transition duration-100 ease-in-out"
            }
          >
            <CheckpointQRInfo
              id={checkpoint.id}
              checkpoint={checkpoint}
              eventId={id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default cpList;

