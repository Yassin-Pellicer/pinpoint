import { useEvent } from "../../utils/context/ContextEvent";
import { useMapContext } from "../../utils/context/ContextMap";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useTranslations } from "next-intl";
import { Tag } from "../../utils/classes/Tag";
import { useState, useEffect } from "react";

const BottomSheet = ({ open, setOpen }) => {
  const t = useTranslations("Tags");
  const { setFilterTags } = useMapContext();

  const { event, tags, setTags } = useEvent();

  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {
      const updatedSelectedTags = Tag.tags.reduce((acc, tag) => {
        acc[tag.tag_id] = tags.some((t) => t.tag_id === tag.tag_id);
        return acc;
      }, {});
      
      setSelectedTags(updatedSelectedTags);
      setFilterTags(Tag.tags.filter((tag) => updatedSelectedTags[tag.tag_id]));
  }, [open]);

  const handleTagSelection = (tagName) => {
    setSelectedTags((prevSelectedTags) => {
      const updatedTags = { ...prevSelectedTags, [tagName]: !prevSelectedTags[tagName] };
      
      const selected = Tag.tags.filter((tag) => updatedTags[tag.tag_id]);
      setFilterTags(selected);
      setTags(selected);
  
      return updatedTags;
    });
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
          maxWidth: "549px",
          height: "100%",
          marginRight: "auto",
          marginLeft: "1px",
          zIndex: 100,
          overflowY: "scroll",
          backgroundColor: "#3F7DEA",
        },
      }}
    >
      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div
          style={{ cursor: "pointer", marginTop: "20px" }}
          onClick={() => {
            setOpen(false);
            setTags(Tag.tags.filter((tag) => selectedTags[tag.tag_id]));
          }}
          className="cursor-pointer flex justify-center"
        >
          <img
            src="/svg/arrow.svg"
            alt="Close Drawer"
            className="cursor-pointer scale-[1] p-2 mb-4"
          />
        </div>
      </div>

      <div className="bg-white p-6 mx-6 mb-6 rounded-2xl">
        <h3 className="text-2xl font-bold mb-4">{t("title")}</h3>
        <div className="flex justify-center mb-4">{t("description")}</div>
        <div className="flex flex-wrap w-full gap-2">
          {Tag.tags.map((tag, index) => (
            <button
              key={tag.tag_id || index}
              onClick={() => handleTagSelection(tag.tag_id)}
              className={`rounded-md w-fit p-[10px] py-2 text-center tracking-tight text-black ${
                selectedTags[tag.tag_id]
                  ? "bg-[#3F7DEA] font-bold tracking-tight text-white"
                  : "border border-black"
              }`}
            >
              {t(`${tag.tag_id}`)}
            </button>
          ))}
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default BottomSheet;
