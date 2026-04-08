"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  content: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "xs";
  className?: string;
  toastMessage?: string;
}

export function CopyButton({ 
  content, 
  label, 
  variant = "outline", 
  size = "default",
  className,
  toastMessage = "Component copied"
}: CopyButtonProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(content);
    toast.success(toastMessage, {
      description: "The snippet has been saved to your clipboard.",
      duration: 3000,
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
    >
      {label ? (
        <>
          <Copy className="w-4 h-4 mr-2" />
          {label}
        </>
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );
}
