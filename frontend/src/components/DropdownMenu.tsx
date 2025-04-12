'use client';
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function DropdownMenu({ label, items }: { label: string; items: string[] }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex items-center gap-1">
        {label} <ChevronDown size={16} />
      </Dropdown.Trigger>
      <Dropdown.Content className="rounded-md shadow-lg mt-2 p-2 w-32 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
        {items.map((item) => (
          <Dropdown.Item
            key={item}
            className="px-4 py-2 text-sm rounded"
          >
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}