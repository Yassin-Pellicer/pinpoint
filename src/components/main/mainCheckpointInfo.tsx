"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useTranslations } from "next-intl";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const CheckpointInfo = ({ id, index }) => {
  const {
    checkpoints,
    setCheckpoints,
    focusedCheckpoint,
    setFocusedCheckpoint,
    setBanner,
  } = useCheckpoints();

  const [name, setName] = useState(checkpoints[index]?.name || "");
  const [description, setDescription] = useState(
    checkpoints[index]?.description || ""
  );

  const t = useTranslations("CpInfo");

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row"
        onClick={() => setFocusedCheckpoint(checkpoints[index])}
      >
        <div className="flex items-center justify-center w-12 mr-4 h-12 bg-blue-400 shrink-0 text-white rounded-full cursor-pointer">
          <h1 className="flex text-xl font-extrabold cursor-pointer">
            {checkpoints[index].order}
          </h1>
        </div>
        <div className="max-w-[300px] cursor-pointer">
          <h1 className="font-bold break-words">{checkpoints[index].name}</h1>
          <p className="flex text-xs items-center">
            <span className="material-icons text-sm mr-2">location_on</span>
            {checkpoints[index].marker.position[0]},{" "}
            {checkpoints[index].marker.position[1]}
          </p>
          <p className="flex text-xs items-center">
            <span className="material-icons text-sm mr-2">location_city</span>
            {checkpoints[index].address}
          </p>
        </div>
        <div className="ml-auto">
          <p className="material-icons text-2xl">tour</p>
        </div>
      </div>

      {checkpoints[index].banner || description ? (
        <div className="mt-2 w-full pl-5 h-fit m-auto flex flex-row">
          <div className="w-2 min-h-full pl-1 bg-blue-400 rounded-l-md mr-3"></div>
          <div className="flex flex-col pl-4">
            <div className="overflow-auto flex flex-col px-3 w-full">
              <div className="flex flex-col justify-center">
                <label className="w-full mt-2">
                  {checkpoints[index].banner && (
                    <div className="cursor-pointer relative flex justify-end items-center w-full h-15 mb-2 rounded-2xl overflow-hidden">
                      <img
                        src={checkpoints[index].banner}
                        className="w-full h-full object-cover rounded-xl"
                        alt="banner"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
            <form className="flex flex-col px-3 w-full">
              {checkpoints[index].banner && (
                <h1 className="font-bold text-2xl mb-2">{name}</h1>
              )}
              <div className="flex flex-col mb-4">
                <Quill
                  key={index}
                  value={description}
                  readOnly={true}
                  theme="bubble"
                  modules={{ toolbar: false }}
                />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CheckpointInfo;
