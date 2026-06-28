/**
 * Footer Component
 *
 * ⚠️ SHARED COMPONENT — Also exists in:
 * - lab_sgg-ui/app/components/ui/Footer.tsx
 * - lab_sgg-admin/app/components/ui/Footer.tsx
 *
 * Last Sync: TBD - Initial sync verification
 *
 * When modifying: Update BOTH projects & update this date
 */

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
