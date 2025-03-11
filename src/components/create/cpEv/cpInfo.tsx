"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import fileURL from "../../../utils/funcs/createUrlImage";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const CheckpointInfo = ({ id, index, mode, closeMap}) => {
  const {
    checkpoints,
    setCheckpoints,
    focusedCheckpoint,
    setFocusedCheckpoint,
    setBanner,
  } = useCheckpoints();

  const [name, setName] = useState(checkpoints[index]?.name || "");
  const [description, setDescription] = useState(checkpoints[index]?.description || "");
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslations("CpInfo");

  const imageInputId = `checkpoint-image-${id}-${index}`;

  const handleFocus = () => {
    setIsFocused(true);
  };

  useEffect(() => {
    setName(checkpoints[index]?.name || "");
    setDescription(checkpoints[index]?.description || "");
  }, [checkpoints, index]); 
    
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      modifyInfo(e);
    }
  };

  const handleImageUpload = (e) => {
    fileURL(e, (url) => {
      setBanner(url, id);
    });
  };

  const modifyInfo = (e) => {
    e.preventDefault();
    setCheckpoints((prevCheckpoints) =>
      prevCheckpoints.map((checkpoint, i) =>
        i === index ? { ...checkpoint, name, description, banner: checkpoints[index].banner } : checkpoint
      )
    );
  };

  const removeCheckpoints = (index) => {
    event.preventDefault();
    let newCheckpoints = [...checkpoints];
    newCheckpoints.splice(index, 1);
    newCheckpoints.forEach((element, i) => {
      if (element.order >= index + 1) {
        element.order = i + 1;
      }
    });
    setCheckpoints(newCheckpoints);
    closeMap();
  };

  const cpInfo = (
    <form className="flex flex-col px-3 w-full"
    tabIndex={-1}
    onFocus={handleFocus}
    onBlur={handleBlur}
    >
      <label className="font-bold">
        {t("name")}
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-black rounded p-1 mb-3"
      />
      <div className="flex flex-col mb-16">
        <label className="text-md mb-1 font-bold"> 
          {t("description")}
        </label>
        <Quill
          key={index}
          style={{ height: "125px" }}
          value={description}
          onChange={(value) => setDescription(value)}
        />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          removeCheckpoints(index);
        }}
        className="font-bold bg-transparent border-2 text-sm border-black text-black rounded-xl p-2 hover:bg-red-600 hover:border-red-600 hover:text-white transition duration-150 mb-4"
      >
         {t("remove")}
      </button>
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
          {mode == "edit" && (
            <p
              onClick={() => setFocusedCheckpoint(checkpoints[index])}
              className="material-icons text-2xl"
            >
              edit
            </p>
          )}

          {mode == "list" && (
            <p
              onClick={() => setFocusedCheckpoint(checkpoints[index])}
              className="material-icons text-2xl"
            >
              edit
            </p>
          )}
        </button>
      </div>

      {mode == "edit" && (
        <div className="mt-4 w-full h-fit rounded-2xl bg-[#e6e6e6] m-auto px-2 pt-4">
          <div className="overflow-auto flex flex-col px-3 w-full">
            <div className="flex flex-col justify-center">
              <input
                accept="image/*"
                id={imageInputId}
                type="file"
                hidden
                onChange={handleImageUpload}
              />
              <label htmlFor={imageInputId} className="w-full mt-2 mb-4">
                {checkpoints[index].banner ? (
                  <div className="cursor-pointer relative flex justify-end items-center w-full h-15 mb-2 rounded-2xl overflow-hidden">
                    <img
                      src={checkpoints[index].banner}
                      className="w-full h-full object-cover rounded-xl"
                      alt="banner"
                    />
                    <p
                      className="absolute bottom-8 w-full text-center font-caveat text-white text-2xl tracking-tighter select-none"
                      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                    >
                      {t("pic")}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col cursor-pointer justify-center items-center w-full h-15 
                    mb-2 rounded-2xl p-14 bg-[#e6e6e6] border border-gray-400 hover:bg-[#d6d6d6] transition duration-200">
                    <i className="text-gray-400 material-icons mr-1 text-[150px] select-none">
                      add_photo_alternate
                    </i>
                    <p className="font-caveat text-gray-500 text-xl tracking-tighter select-none">
                      {t("pic")}
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
          {cpInfo}
        </div>
      )}
    </div>
  );
};

export default CheckpointInfo;
