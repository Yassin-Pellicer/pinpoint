"use client";
import { useState, useEffect } from "react";
import Quill from "react-quill";
import { useCheckpoints } from "../../../utils/context/cpContext";

const CheckpointInfo = ({ id, index, isExpanded, toggleExpand }) => {
  const { checkpoints, setCheckpoints } = useCheckpoints();

  const [name, setName] = useState(checkpoints[index]?.name || "");
  const [description, setDescription] = useState(checkpoints[index]?.description || "");

  const modifyInfo = (e) => {
    e.preventDefault();
    setCheckpoints((prevCheckpoints) =>
      prevCheckpoints.map((checkpoint, i) =>
        i === index ? { ...checkpoint, name, description } : checkpoint
      )
    );
  };

  const removeCheckpoints = (index) => {
    let newCheckpoints = [...checkpoints];
    newCheckpoints.splice(index, 1);
    newCheckpoints.forEach((element, i) => {
      if (element.order >= index + 1) {
        element.order = i + 1;
      }
    });
    setCheckpoints(newCheckpoints);
  };

  const cpInfo = (
    <form className="flex flex-col px-3 w-full">
      <label className="font-bold">Name of the Checkpoint:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-black rounded p-1 mb-3"
      />
      <div className="flex flex-col mb-24">
        <label className="text-md mb-1">Checkpoint info</label>
        <Quill
          key={index}
          style={{ height: "125px" }}
          value={description}
          onChange={(value) => setDescription(value)}
        />
      </div>
      <button
      onClick={(e) => {
        modifyInfo(e);
        toggleExpand(id);
      }}
      className="font-bold bg-transparent border-2 text-sm border-black 
      text-black rounded-xl p-2 hover:bg-green-600
      hover:border-green-600 hover:text-white 
      transition duration-150 mb-4"
      >
        Apply Changes
      </button>
      <button
        onClick={() => removeCheckpoints(index)}
        className="font-bold bg-transparent border-2 text-sm border-black text-black rounded-xl p-2 hover:bg-red-600 hover:border-red-600 hover:text-white transition duration-150 mb-4"
      >
        Remove Checkpoint
      </button>
    </form>
  );

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row items-center"
      >
        <div className="flex items-center justify-center w-12 mr-4 h-12 bg-blue-400 text-white rounded-full">
          <h1 className="flex text-xl font-extrabold">{index + 1}</h1>
        </div>
        <div className="max-w-[300px]">
          <h1 className="font-bold break-words">{checkpoints[index].name}</h1>
          <p className="text-xs">
            {checkpoints[index].marker.position[0]}, {checkpoints[index].marker.position[1]}
          </p>
        </div>
        <button onClick={() => toggleExpand((prev) => !prev)} className="ml-auto">
          {isExpanded ? (
            <img
              src="/svg/arrow.svg"
              alt="Description of image"
              className="cursor-pointer scale-[1] ml-auto p-2 mr-0 rotate-180"
            />
          ) : (
            <img
              src="/svg/arrow.svg"
              alt="Description of image"
              className="cursor-pointer scale-[1] ml-auto p-2 mr-0"
            />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 w-full h-fit rounded-2xl bg-[#e6e6e6] m-auto px-2 pt-4">
          <div className="overflow-auto mb-5">
            <div className="flex flex-col justify-center items-center mb-4">
              <h1 className="font-bold text-3xl font-caveat text-left px-6 mb-6">
                Checkpoint Details
              </h1>
              <div className="cursor-pointer hover:bg-[#c6c6c6] bg-[#d6d6d6] rounded-full p-20 mb-2">
                <img
                  src="/svg/add.svg"
                  alt="Description of image"
                  className="scale-[3]"
                />
              </div>
              <p className="text-xs mb-2">Click to add a picture!</p>
            </div>
          </div>
          {cpInfo}
        </div>
      )}
    </div>
  );
};

export default CheckpointInfo;
