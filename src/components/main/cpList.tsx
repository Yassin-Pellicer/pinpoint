"use client";
import { useCheckpoints } from "../../utils/context/cpContext";
import { useTranslations } from "next-intl";
import CheckpointInfo from "./cpInfo";

const cpList = () => {
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const t = useTranslations("CpList");

  return (
    <div className="relative flex flex-col overflow-y-auto">
      <div className="flex flex-col">
        {checkpoints?.map((checkpoint, index) => (
          <div
            key={checkpoint.id || `checkpoint-${index}`}
            className={
              index === 0
                ? "p-4 bg-gray-300 cursor-default transition duration-100 ease-in-out"
                : index === checkpoints.length - 1
                ? "p-4 pb-5 bg-gray-300 border-t-2 border-gray-400 rounded-b-2xl cursor-default transition duration-100 ease-in-out"
                : "p-4 pb-5 bg-gray-300 border-t-2 border-gray-400 cursor-default transition duration-100 ease-in-out"
            }
          >
            <CheckpointInfo id={checkpoint.id} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default cpList;

