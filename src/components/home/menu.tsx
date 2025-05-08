"use client";
import React, { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Logo from "../ui/logo";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const Menu = ({ open, setOpen }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Menu");

  const stringArray = [
    t("home"),
    t("createHunts"),
    t("profile"),
    // t("aboutUs"),
    // t("logout"),
  ];

  const routes = [
    "/main/home",
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
            setLoading(true);
            router.push(routes[index]);
            setOpen(false);
            setLoading(false);
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );
  
  return (
    <div>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-blue-500 z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-[400px] w-[400px] border-b-8 border-white m-auto" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="mb-5">
              <Logo />
            </div>
          </div>
        </div>
      )}
      {/* DRAWER */}
      <SwipeableDrawer
        variant="persistent"
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            width: "100%",
            maxWidth: "500px",
            height: "100%",
            backgroundColor: "rgb(59, 130, 246)",
            zIndex: 20,
          },
        }}
      >
        <div className="px-5">{content}</div>
      </SwipeableDrawer>
    </div>
  );
};

export default Menu;
