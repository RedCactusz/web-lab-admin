import React from 'react';

interface FooterProps {
  text?: string;
  className?: string;
}

export default function Footer({
  text = `© ${new Date().getFullYear()} Laboratorium Survei Geodesi & Geometri`,
  className = "text-slate-500 text-sm text-center"
}: FooterProps) {
  return (
    <footer className={className}>
      {text}
    </footer>
  );
}
