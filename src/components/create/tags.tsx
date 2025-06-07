import { useEvent } from "../../utils/context/ContextEvent";
import { useMapContext } from "../../utils/context/ContextMap";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useTranslations } from "next-intl";
import { Tag } from "../../utils/classes/Tag";
import { useState, useEffect } from "react";

const BottomSheet = ({ open, setOpen, filterMode, createMode }) => {
  const t = useTranslations("Tags");
  const { setFilterTags, filterTags } = useMapContext();

  const { event, tags, setTags } = useEvent();

  const [selectedTags, setSelectedTags] = useState(
    filterMode ? { ...filterTags } : {}
  );

  useEffect(() => {
    if (filterMode) {
      const updatedSelectedTags = Tag.tags.reduce((acc, tag) => {
        acc[tag.tag_id] = filterTags.some((t) => t.tag_id === tag.tag_id);
        return acc;
      }, {});

      setSelectedTags(updatedSelectedTags);
      setFilterTags(Tag.tags.filter((tag) => updatedSelectedTags[tag.tag_id]));
    }
    if (createMode) {
      const updatedSelectedTags = Tag.tags.reduce((acc, tag) => {
        acc[tag.tag_id] = tags.some((t) => t.tag_id === tag.tag_id);
        return acc;
      }, {});

      setSelectedTags(updatedSelectedTags);
    }
  }, [open]);

  const handleTagSelection = (tagName) => {
    let prevSelectedTags = { ...selectedTags };
    const updatedTags = {
      ...prevSelectedTags,
      [tagName]: !prevSelectedTags[tagName],
    };

    const selected = Tag.tags.filter((tag) => updatedTags[tag.tag_id]);
    if (filterMode) {
      setFilterTags(selected);
    } else {
      setTags(selected);
    }

    setSelectedTags(updatedTags);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      variant="persistent"
      PaperProps={{
        style: {
          maxWidth: "525px",
          height: "100%",
          marginRight: "auto",
          zIndex: 100,
          overflowY: "scroll",
        },
      }}
    >
      <div>
        <div
          onClick={() => {
            setOpen(false);
            setTags(Tag.tags.filter((tag) => selectedTags[tag.tag_id]));
          }}
          className="cursor-pointer flex justify-center p-6"
        >
          <img
            src="/svg/arrow.svg"
            alt="Close Drawer"
            className="cursor-pointer scale-[1]"
          />
        </div>
      </div>
      <div className="h-auto bg-white mb-2 relative transition duration-100 overflow-hidden border-[1px] border-gray-300">
        <div className="relative p-5 z-10">
          <div className="flex flex-row items-center ">
            <h1 className="text-2xl tracking-tighter font-bold text-black">
              {t("title")}
            </h1>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 pt-0 mb-6 rounded-2xl">
        <div className="grid grid-cols-2 w-full mt-4 gap-2">
          {Tag.tags.map((tag, index) => (
            <button
              key={tag.tag_id || index}
              onClick={() => handleTagSelection(tag.tag_id)}
              className={`flex rounded-md w-full p-[10px] py-2 text-center font-bold tracking-tight items-center text-black ${
                selectedTags[tag.tag_id]
                  ? "bg-[#3F7DEA] tracking-tight text-white"
                  : "border border-black hover:text-white hover:bg-blue-500"
              }`}
            >
              <i className="material-icons mr-2">{tag.icon}</i>{" "}
              {t(`${tag.tag_id}`)}
            </button>
          ))}
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default BottomSheet;
