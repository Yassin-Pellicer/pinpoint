"use client";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useCheckpoints } from "../../utils/context/cpContext";
import { closestCenter, closestCorners, DndContext, pointerWithin, rectIntersection } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { Checkpoint } from "../../utils/classes/cpClass";
import { useTranslations } from "next-intl";
import CheckpointInfo from "./cpInfo";
import { useEffect, useState } from "react";

const BottomSheet = () => {
  const {
    checkpoints,
    setCheckpoints,
    focusedCheckpoint,
    setFocusedCheckpoint,
  } = useCheckpoints();
  const t = useTranslations("CpList");

  const DraggableCheckpoint = ({ id, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(0, ${transform.y}px, 0)`
            : undefined,
          transition,
          padding: "16px",
          paddingBottom:"20px",
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
        />
      </div>
    );
  };

  return (
    <>
      <div className="relative mt-4 flex flex-col overflow-y-auto">
        <DndContext>
          <SortableContext
            items={checkpoints}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col">
              {checkpoints?.map((checkpoint, index) => (
                <DraggableCheckpoint
                  index={index}
                  key={checkpoint.id}
                  id={checkpoint.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};

export default BottomSheet;
