import { ElementType } from "react";

export type PortalType =
  | "admin"
  | "teacher"
  | "student";

export type SidebarMenu = {
  name: string;
  href: string;
  icon: ElementType;
};

export type AppSidebarProps = {
  title: string;
  portal: PortalType;
  menus: SidebarMenu[];
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  logoutPath?: string;
};

export type TopBarProps = {
  portal: PortalType;
  userName: string;
  onMenuClick: () => void;
};

export type SidebarHeaderProps = {
  userName: string;
  title: string;
  onClose: () => void;
};

export type SidebarItemProps = {
  menu: SidebarMenu;
  active: boolean;
  onClick: () => void;
};

export type SidebarFooterProps = {
  onLogout: () => void;
};