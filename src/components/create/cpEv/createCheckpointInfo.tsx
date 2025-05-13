"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../../utils/context/ContextCheckpoint";
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
    <form
      className="flex flex-col w-full rounded-xl"
      tabIndex={-1}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="h-auto bg-white overflow-hidden border-b-[1px] border-gray-300">
        <div className="flex flex-row items-center p-2 z-10">
          <h1 className="text-lg tracking-tighter font-bold text-black">
            {t("name")}
          </h1>
        </div>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-b-[1px] bg-gray-100 border-gray-300 px-6 py-2 text-md hover:bg-gray-200 transition duration-200"
        placeholder="Checkpoint"
      />
      <div className="flex flex-col mb-14">
        <div className="flex flex-row bg-gray-200 items-center p-2 z-10 ">
          <h1 className="text-lg tracking-tighter font-bold text-black">
            {t("description")}
          </h1>
        </div>
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
        className="font-bold bg-transparent text-sm rounded-b-xl text-black  p-2 hover:bg-red-600 hover:border-red-600 hover:text-white transition duration-150"
      >
        {t("remove")}
      </button>
    </form>
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row px-4 items-center">
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
          <p
            onClick={() => setFocusedCheckpoint(checkpoints[index])}
            className="material-icons text-2xl"
          >
            edit
          </p>
        </button>
      </div>

      {mode == "edit" && (
        <div className="mt-4 w-full h-fit bg-[#e6e6e6] m-auto rounded-b-xl">
          <div className="overflow-auto flex flex-col w-full">
            <div className="flex flex-col justify-center">
              <input
                accept="image/*"
                id={imageInputId}
                type="file"
                hidden
                onChange={handleImageUpload}
              />
              <label htmlFor={imageInputId} className="w-full">
                {checkpoints[index].banner ? (
                  <div className="cursor-pointer relative flex justify-end items-center w-full h-15 overflow-hidden">
                    <img
                      src={checkpoints[index].banner}
                      className="w-full h-full object-cover"
                      alt="banner"
                    />
                    <p
                      className="absolute w-full text-center font-caveat text-white text-2xl tracking-tighter select-none"
                      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                    >
                      {t("pic")}
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex flex-col cursor-pointer justify-center items-center w-full h-fit
                    px-14 py-12 bg-[#e6e6e6] border-b border-gray-400 hover:bg-[#d6d6d6] transition duration-200"
                  >
                    <i className="text-gray-400 material-icons mr-1 text-[120px] select-none">
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
