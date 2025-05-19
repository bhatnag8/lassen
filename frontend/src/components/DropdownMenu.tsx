"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type DropdownItem = {
  label: string;
  href: string;
};

export default function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex items-center gap-1 hover:text-zinc-600">
        {label} <ChevronDown size={16} />
      </Dropdown.Trigger>
      <Dropdown.Content className="rounded-md shadow-lg mt-2 p-2 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
        {items.map(({ label, href }) => (
          <Link key={label} href={href} passHref legacyBehavior>
            <Dropdown.Item className="hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 text-sm rounded cursor-pointer">
              {label}
            </Dropdown.Item>
          </Link>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
