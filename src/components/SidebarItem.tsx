import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { MenuItem } from "../layouts/types";

interface SidebarItemProps {
    item: MenuItem;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = !!item.children && item.children.length > 0;

    if (hasChildren) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-300 hover:text-white"
                >
                    <span>{item.label}</span>
                    <span className="text-xs">{isOpen ? "▾" : "▸"}</span>
                </button>
                {isOpen && (
                    <div className="pl-4">
                        {item.children.map((child) => (
                            <SidebarItem key={child.id} item={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path ?? "/"}
            className={({ isActive }) =>
                `block px-3 py-2 text-sm ${isActive ? "text-white" : "text-gray-300 hover:text-white"}`
            }
        >
            {item.label}
        </NavLink>
    );
};
