"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const ArrowIcon = ({ className, ...props }: ArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-300 hover:translate-x-1", className)}
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
};

export default ArrowIcon;
