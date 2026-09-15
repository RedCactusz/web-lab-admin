import React, { useState, useEffect } from "react";           
import { SidebarItem } from "../components/SidebarItem";
import type { MenuItem } from "./types";
import { praktikumService } from "@/services";


interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SideBarProps> = ({ isOpen, onClose }: SideBarProps) => {

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const praktikumList = await praktikumService.getAll();
                const items: MenuItem[] = praktikumList.map((praktikum) => ({
                    id: praktikum.id,
                    label: praktikum.praktikum_label,
                    path: `/praktikum/${praktikum.praktikum_slug}`
                }));
                setMenuItems(items);
            } catch (error) {
                console.error("Error fetching praktikum:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-900 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex h-16 items-center px-4 text-lg font-bold">Lab SGG Admin</div>
            <nav className="flex flex-col px-2">
                <a href="/" className="mb-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700">Dashboard</a>
                <a href="/mahasiswa" className="mb-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700">Mahasiswa</a>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    menuItems.map((item) => (
                        <SidebarItem key={item.id} item={item} />
                    ))
                )}
            </nav>
            <button onClick={onClose} className="absolute top-4 right-4 rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-100">☰</button>
        </aside>
    );
}

export default Sidebar;