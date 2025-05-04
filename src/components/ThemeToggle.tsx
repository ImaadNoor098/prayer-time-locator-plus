
// This component is now empty as we've removed the theme toggle functionality
import React from 'react';

interface ThemeToggleProps {
  variant?: "button" | "toggle" | "switch";
  className?: string;
}

export function ThemeToggle({ variant = "switch", className }: ThemeToggleProps) {
  // Return null/empty as we've removed theme toggle functionality
  return null;
}
