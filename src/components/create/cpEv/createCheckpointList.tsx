"use client";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useCheckpoints } from "../../../utils/context/ContextCheckpoint";
import {
  closestCenter,
  closestCorners,
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { Checkpoint } from "../../../utils/classes/Checkpoint";
import { useTranslations } from "next-intl";
import CheckpointInfo from "./createCheckpointInfo";
import { useEffect, useState } from "react";

const BottomSheet = ({ open, setOpen }) => {
  const {
    checkpoints,
    setCheckpoints,
    focusedCheckpoint,
    setFocusedCheckpoint,
    setOrder,
  } = useCheckpoints();
  const t = useTranslations("CpList");

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = checkpoints.findIndex((item) => item.id === active.id);
      const newIndex = checkpoints.findIndex((item) => item.id === over.id);

      const newCheckpoints = arrayMove(checkpoints, oldIndex, newIndex);

      newCheckpoints.forEach((element, idx) => {
        element.order = idx + 1;
      });

      setCheckpoints(newCheckpoints);
      setFocusedCheckpoint(newCheckpoints[newIndex]);
    }
  };

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
          paddingTop: "16px",
          paddingLeft: "16px",
          paddingRight: "16px",
          margin: "8px 0",
          background: "#e1e1e1",
          borderRadius: "4px",
          cursor: "default",
        }}
        {...attributes}
      >
        <CheckpointInfo
          key={index}
          id={id}
          index={index}
          mode="list"
          closeMap={undefined}
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
          style={{ cursor: "pointer", marginTop: "20px" }}
          onClick={() => setOpen(false)}
          className="cursor-pointer flex justify-center"
        >
          <img
            src="/svg/arrow.svg"
            alt="Close Drawer"
            className="cursor-pointer scale-[1] p-2 mb-4"
          />
        </div>
      </div>

      {checkpoints == undefined ? (
        <div className="bg-white">
          <div className="h-auto bg-white mb-2 relative transition duration-100 overflow-hidden border-[1px] border-gray-300">
            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center ">
                <h1 className="text-2xl tracking-tighter font-bold text-black">
                  {t("title")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white">
          <div className="h-auto bg-white mb-2 relative transition duration-100 overflow-hidden border-[1px] border-gray-300">
            <div className="relative p-5 z-10">
              <div className="flex flex-row items-center ">
                <h1 className="text-2xl tracking-tighter font-bold text-black">
                  {t("title")}
                </h1>
              </div>
            </div>
          </div>
          <div className="relative mt-4 flex flex-col overflow-y-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={checkpoints}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col touch-drag-container">
                  {checkpoints?.map((checkpoint, index) => (
                    <DraggableCheckpoint
                      index={index}
                      key={`${checkpoint.id}-${index}`}
                      id={checkpoint.id}
                    />
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
