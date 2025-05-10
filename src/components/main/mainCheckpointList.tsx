"use client";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useTranslations } from "next-intl";
import CheckpointInfo from "./mainCheckpointInfo";

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
              "p-4 pb-5 bg-white border-[1px] border-gray-300 cursor-default transition duration-100 ease-in-out"
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

