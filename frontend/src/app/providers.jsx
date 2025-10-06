"use client";

import { HeroUIProvider } from "@heroui/react";
import { RoleProvider } from "../store/roleContext";

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <RoleProvider>{children}</RoleProvider>
    </HeroUIProvider>
  );
}
