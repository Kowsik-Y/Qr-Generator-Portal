import { ArrowRight, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { ToggleTheme } from "./utils";

export const TopBar = ({
  logo = {
    url: "/",
    src: "/file.svg",
    alt: "logo",
    title: "Quiz Generate",
  },
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Get Started", url: "#" },
  },
}) => {
  return (
    <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 w-full">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl ">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="hidden sm:block">{logo.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <ToggleTheme />
          <Button
            variant="ghost"
            asChild
          >
            <Link href={auth.login.url}>{auth.login.title}</Link>
          </Button>
          <Button
            asChild
            size={"lg"}
            variant="outline"
          >
            <Link href={auth.signup.url}>
              {auth.signup.title}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
