"use client";
import { useCheckpoints } from "../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import CheckpointInfo from "./cpInfo";

const cpList = () => {
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const t = useTranslations("CpList");

  return (
    <div className="relative mt-4 flex flex-col overflow-y-auto">
      <div className="flex flex-col">
        {checkpoints?.map((checkpoint, index) => (
          <div
            key={checkpoint.id || `checkpoint-${index}`}
            className="p-4 pb-5 my-2 bg-gray-300 rounded-2xl cursor-default transition duration-100 ease-in-out"
          >
            <CheckpointInfo id={checkpoint.id} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default cpList;

