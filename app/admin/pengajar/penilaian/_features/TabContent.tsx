"use client";

import TabRekap from "./tabs/TabRekap";
import TabInput from "./tabs/TabInput";
import TabTransparansi from "./tabs/TabTransparansi";

interface TabContentProps {
  activeTab: number;
  praktikum: string;
}

export default function TabContent({ activeTab, praktikum }: TabContentProps) {
  if (activeTab === 1) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <TabRekap praktikum={praktikum} />
      </div>
    );
  }

  if (activeTab === 2) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <TabInput praktikum={praktikum} />
      </div>
    );
  }

  if (activeTab === 3) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <TabTransparansi praktikum={praktikum} />
      </div>
    );
  }

  return null;
}
