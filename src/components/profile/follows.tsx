import { useEvent } from "../../utils/context/ContextEvent";
import { useMapContext } from "../../utils/context/ContextMap";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useTranslations } from "next-intl";
import { Tag } from "../../utils/classes/Tag";
import { useState, useEffect } from "react";
import UserList from "./userList";
import { User } from "../../utils/classes/User";
import { getFollowersHook, getFollowingHook } from "../../hooks/general/followersHook";
import { useSession } from "../../utils/context/ContextSession";

const BottomSheet = ({ open, setOpen, type, setType, user}) => {
  const t = useTranslations("Tags");
  const [users, setUsers] = useState([]);


  useEffect(() => {
    if(type != "" && user)
    {
      if (type === "following") {
        getFollowingHook(user.id).then((res) => {
          setUsers(res.followers);
        });
      } else if (type === "followers") {
        getFollowersHook(user.id).then((res) => {
          setUsers(res.followers);
        })
      }
    }
  }, [type, user])

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
            setTimeout(() => setUsers([]), 300);
            setType("");
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
      <div className="h-auto bg-white relative mb-5 transition duration-100 overflow-hidden border-[1px] border-gray-300">
        <div className="relative p-5 z-10">
          <div className="flex flex-row items-center ">
            <h1 className="text-2xl tracking-tighter font-bold text-black">
              {type === "following" ? "Siguiendo" : "Seguidores"}
            </h1>
          </div>
        </div>
      </div>
      <UserList users={users}></UserList>
    </SwipeableDrawer>
  );
};

export default BottomSheet;
