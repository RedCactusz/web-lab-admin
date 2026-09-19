import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { MenuItem } from "../layouts/types";

interface SidebarItemProps {
    item: MenuItem;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (item.children && item.children.length > 0) {
        return (
            <div className="mb-2">
                <div className="flex items-center justify-between">
                    <NavLink
                        to={item.path ?? "/"}
                        className={({ isActive }) =>
                            `flex-1 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 ${isActive ? "text-white" : "text-gray-300"}`
                        }
                    >
                        {item.label}
                    </NavLink>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        aria-label={`Toggle ${item.label}`}
                    >
                        {isOpen ? "▾" : "▸"}
                    </button>
                </div>
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
