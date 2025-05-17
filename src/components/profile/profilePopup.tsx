import { useState } from 'react';
import Popover from '@mui/material/Popover';
import { getUserHook } from '../../hooks/general/getUserHook';

export default function MouseHoverPopover({id, profilePicture}) {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [user, setUser] = useState(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!user) {
      getUserHook(id).then((response) => {
        setUser(response.user);
      });
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <div
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className="flex w-full h-full mr-5 shrink-0 rounded-full overflow-hidden items-center justify-center bg-gray-300"
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile Picture"
            className="w-full h-full object-cover cursor-pointer"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        ) : (
          <i className="text-gray-400 material-icons text-center text-[70px] mt-4 select-none cursor-pointer">
            person
          </i>
        )}
      </div>
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className="w-[400px]" >
          <div className="relative w-full">
            <div className="flex flex-col justify-center items-center">
              {user?.banner ? (
                <div className="cursor-pointer relative flex justify-end items-center w-full h-[100px] overflow-hidden">
                  <img
                    src={user?.banner}
                    className="w-full h-[100px] object-cover"
                    alt="banner"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-[100px] p-14 bg-[#e6e6e6] ">
                  <i className="text-gray-400 material-icons mr-1 text-[80px] select-none">
                    photo
                  </i>
                </div>
              )}
            </div>
            <div className="flex flex-row absolute ml-[60px] transform -translate-x-1/2 top-[60px] z-20">
              <div className="cursor-pointer flex w-[90px] h-[90px] rounded-full overflow-hidden border-4 items-center justify-center bg-gray-300 border-white">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="text-gray-400 material-icons text-center text-[90px] mt-8 select-none">
                    person
                  </i>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full px-6 pb-6 h-[fit] z-10 bg-gray-300">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col pt-[60px] ">
                  <h2 className="text-xl font-bold mr-5">
                    {user?.username || "username"}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full py-2">
                <p className="text-sm text-gray-600 tracking-tight pb-2">
                  {user?.description || ""}
                </p>
                <div className="flex flex-row mb-2 flex-wrap">
                  <div className="flex flex-row">
                    {user?.memberSince && (
                      <>
                        {" "}
                        <i className="material-icons text-gray-600 text-sm mr-1">
                          calendar_today
                        </i>
                        <p className="text-sm italic text-gray-600 mr-4">
                          Miembro desde{" "}
                          {new Date(user.memberSince).toLocaleDateString(
                            "es-ES"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-row">
                    {user?.link && (
                      <>
                        {" "}
                        <i className="material-icons text-gray-600 text-sm mr-1">
                          link
                        </i>
                        <a
                          href={user?.link}
                          className="text-sm italic text-blue-700 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        ></a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="text-sm text-gray-600 mr-2">
                    <span className="font-bold">Siguiendo:</span>{" "}
                    {user?.following || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Seguidores:</span>{" "}
                    {user?.followers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}