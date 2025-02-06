"use client";
import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Logo from "../ui/logo";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const Menu = ({ open, setOpen }) => {
  const router = useRouter();
  const t = useTranslations("Menu");

  const stringArray = [
    t("home"),
    t("createHunts"),
    t("profile"),
    // t("aboutUs"),
    // t("logout"),
  ];

  const routes = [
    "/pages/main",
    "/pages/create",
    "/pages/profile",
    // "/",
    // "/aboutUs",
  ];

  const content = (
    <div className="flex flex-col">
      <div className="flex m-auto justify-center w-[50%] h-[50%] mt-5 mb-[-10px]">
        <Logo></Logo>
      </div>
      {stringArray.map((item, index) => (
        <p
          className="font-bold text-2xl text-gray-200 pt-5 pb-5 
                      border-b-[1px] border-white hover:text-white
                      cursor-pointer transition duration-100"
          key={index}
          onClick={() => {
            router.push(routes[index]);
            setOpen(false);
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );

  return (
    <div>
      {/* DRAWER */}
      <SwipeableDrawer
        variant="persistent"
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          className: "w-full max-w-[500px] h-full bg-blue-500 z-20",
        }}
      >
        <div className="px-5">{content}</div>
      </SwipeableDrawer>
    </div>
  );
};

export default Menu;
