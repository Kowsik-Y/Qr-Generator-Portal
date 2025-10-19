"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NavMain({ items }) {
  const pathname = usePathname();

  // Debug: Log pathname changes
  useEffect(() => {
    console.log("Current pathname:", pathname);
  }, [pathname]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // Check if current path matches the item URL
          // Exact match or starts with the URL followed by a slash
          const isActive = 
            pathname === item.url || 
            pathname.startsWith(`${item.url}/`);
          
          // Debug: Log each item's active state
          console.log(`${item.title}: pathname=${pathname}, url=${item.url}, isActive=${isActive}`);
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                tooltip={item.title} 
                isActive={isActive}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
