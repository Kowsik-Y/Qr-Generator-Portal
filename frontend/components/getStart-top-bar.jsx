import { ArrowRight, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const GetStartTopBar = ({
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
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky w-full top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl ">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="hidden sm:block">{logo.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="bg-none hover:bg-white/10 hover:text-white" asChild>
              <Link href={auth.login.url}>{auth.login.title}</Link>
            </Button>
            <Button asChild size={"lg"} variant="outline" className="!bg-white/5 !border-white/20 hover:!text-white hover:!bg-white/10">
              <Link href={auth.signup.url}>{auth.signup.title}<ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </nav>
  );
};

export { GetStartTopBar };
