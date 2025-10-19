"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  House ,
  BookMarked ,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: House ,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookMarked ,
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
