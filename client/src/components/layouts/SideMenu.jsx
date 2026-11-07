import React from "react";
import { SIDE_MENU_DATA } from "../../utils/data.js";
import { UserContext } from "../../context/UserContext.jsx";
import CharAvatar from "../Cards/CharAvatar.jsx";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }

    navigate(route);
  };

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <>
      <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-15.25 z-20">
        <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
          <CharAvatar
            fullname={user?.fullname}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
          <h5 className="text-gray-950 font-medium leading-6">
            {user?.fullname || ""}
          </h5>
        </div>

        {SIDE_MENU_DATA.map((item, index) => {
          return (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 text-[15px] ${
                activeMenu === item.label ? "text-white bg-primary" : ""
              } py-3 px-6 rounded-lg mb-3 hover:text-white hover:bg-primary-light`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="text-xl" /> {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SideMenu;
