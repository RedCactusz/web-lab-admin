import React from "react";

interface WalkthroughFabProps {
  onClick: () => void;
  isVisible: boolean;
}

export const WalkthroughFab: React.FC<WalkthroughFabProps> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      aria-label="Buka Kembali Tur Panduan"
      className="md-fab fixed bottom-6 right-6 z-40 flex items-center gap-2.5 p-4 text-sm font-medium transition-all duration-300"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
};