import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuClipboardList,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expenses",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "04",
    label: "Budget",
    icon: LuClipboardList,
    path: "/budget",
  },
  {
    id: "05",
    label: "My Account",
    icon: LuSettings,
    path: "/me",
  },
  {
    id: "06",
    label: "Log Out",
    icon: LuLogOut,
    path: "logout",
  },
];
