"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { ROLES, useRole } from "../store/roleContext";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <div className="flex items-center gap-3 p-3">
      <span className="text-sm text-gray-600">Role:</span>
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" variant="flat" color="secondary">
            {role}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Select role"
          selectionMode="single"
          onAction={(key) => setRole(String(key))}
        >
          {ROLES.map((r) => (
            <DropdownItem key={r}>{r}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
