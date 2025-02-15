"use client";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useCheckpoints } from "../../../utils/context/cpContext";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { Checkpoint } from "../../../utils/classes/cpClass";
import { useTranslations } from "next-intl";
import CheckpointInfo from "./cpInfo";
import { useEffect, useState } from "react";

const BottomSheet = ({ open, setOpen }) => {
  const { checkpoints, setCheckpoints, focusedCheckpoint, setFocusedCheckpoint } = useCheckpoints();
  const t = useTranslations("CPdetails");
  const [expandedCheckpoints, setExpandedCheckpoints] = useState({});

  useEffect(() => {
    setExpandedCheckpoints((prev) => {
      const updatedExpandedState = {};
      checkpoints.forEach((cp) => {
        updatedExpandedState[cp.id] = prev[cp.id] || false;
      });

      return updatedExpandedState;
    });
  }, [checkpoints]);

  const toggleCheckpointDetails = (id) => {
    setExpandedCheckpoints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = checkpoints.findIndex((item) => item.id === active.id);
      const newIndex = checkpoints.findIndex((item) => item.id === over.id);

      const newCheckpoints = arrayMove(checkpoints, oldIndex, newIndex);

      newCheckpoints.forEach((element, index) => {
        element.order = index + 1;
      });

      setCheckpoints(newCheckpoints);
    }
  };

  const DraggableCheckpoint = ({ id, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    return (
      <div
        ref={setNodeRef}
        onClick={() => setFocusedCheckpoint(checkpoints[index])}
        style={{
          transform: transform
            ? `translate3d(0, ${transform.y}px, 0)`
            : undefined,
          transition,
          paddingTop: "16px",
          paddingLeft: "16px",
          paddingRight: "16px",
          margin: "8px 0",
          background: "#d6d6d6",
          borderRadius: "4px",
          cursor: "default",
        }}
        {...attributes}
      >
        <CheckpointInfo
          key={index}
          id={id}
          index={index}
          isExpanded={expandedCheckpoints[id] || false}
          toggleExpand={() => toggleCheckpointDetails(id)}
        />
        <div className="flex justify-center">
          <img
            {...listeners}
            src="/svg/drag.svg"
            alt="Drag Handle"
            className="cursor-grab h-[8%] w-[8%] rotate-90"
          />
        </div>
      </div>
    );
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
          maxWidth: "499px",
          height: "100%",
          marginRight: "auto",
          marginLeft: "1px",
          zIndex: 100,
          overflowY: "scroll",
          backgroundColor: "#3F7DEA",
        }
      }}
    >
      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div
          style={{ cursor: "pointer", marginTop: "20px" }}
          onClick={() => setOpen(false)}
          className="cursor-pointer flex justify-center"
        >
          <img src="/svg/arrow.svg" alt="Close Drawer" className="cursor-pointer scale-[1] p-2 mb-4" />
        </div>
      </div>

      {checkpoints.length === 0 ? (
        <div className="bg-white p-6 mx-6 mb-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">{t("title")}</h3>
          <div className="flex justify-center">{t("empty")}</div>
        </div>
      ) : (
        <div className="bg-white p-6 mx-6 mb-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">{t("title")}</h3>
          <div className="relative mt-4 flex flex-col overflow-y-auto">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={checkpoints} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col">
                  {checkpoints.map((checkpoint, index) => (
                    <DraggableCheckpoint index={index} key={checkpoint.id} id={checkpoint.id} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </SwipeableDrawer>
  );
};

export default BottomSheet;
