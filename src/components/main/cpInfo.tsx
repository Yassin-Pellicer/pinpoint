"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import fileURL from "../../utils/funcs/createUrlImage";

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
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const t = useTranslations("CpInfo");

  const imageInputId = `checkpoint-image-${id}-${index}`;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const cpInfo = (
    <form className="flex flex-col px-3 w-full">
      <h1 className="font-bold text-2xl mb-2">{name}</h1>
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
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div
          onClick={() => setFocusedCheckpoint(checkpoints[index])}
          className="flex items-center justify-center w-12 mr-4 h-12 bg-blue-400 text-white rounded-full cursor-pointer"
        >
          <h1 className="flex text-xl font-extrabold cursor-pointer">
            {index + 1}
          </h1>
        </div>
        <div className="max-w-[300px] cursor-pointer">
          <h1
            onClick={() => setFocusedCheckpoint(checkpoints[index])}
            className="font-bold break-words"
          >
            {checkpoints[index].name}
          </h1>
          <p className="text-xs">
            {checkpoints[index].marker.position[0]},{" "}
            {checkpoints[index].marker.position[1]}
          </p>
        </div>
        <button className="ml-auto">
          <p onClick={() => setOpen(!open)} className="material-icons text-2xl">
            {open ? "close" : "visibility"}
          </p>
        </button>
      </div>

      {open && <div className="mt-4 w-full h-fit rounded-2xl bg-[#e6e6e6] m-auto px-2 pt-4">
        <div className="overflow-auto flex flex-col px-3 w-full">
          <div className="flex flex-col justify-center">
            <input accept="image/*" id={imageInputId} type="file" hidden />
            <label htmlFor={imageInputId} className="w-full mt-2">
              {checkpoints[index].banner ? (
                <div className="cursor-pointer relative flex justify-end items-center w-full h-15 mb-2 rounded-2xl overflow-hidden">
                  <img
                    src={checkpoints[index].banner}
                    className="w-full h-full object-cover rounded-xl"
                    alt="banner"
                  />
                </div>
              ) : (
                <div
                  className="flex flex-col cursor-pointer justify-center items-center w-full h-fit
                    mb-2 rounded-2xl px-14 py-12 bg-[#e6e6e6] border border-gray-400 hover:bg-[#d6d6d6] transition duration-200"
                >
                  <i className="text-gray-400 material-icons mr-1 text-[120px] select-none">
                    photo
                  </i>
                </div>
              )}
            </label>
          </div>
        </div>
        {cpInfo}
      </div>}
    </div>
  );
};

export default CheckpointInfo;
