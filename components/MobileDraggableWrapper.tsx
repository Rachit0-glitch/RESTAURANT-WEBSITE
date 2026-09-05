import React from "react";

interface MobileDraggableWrapperProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export default function MobileDraggableWrapper({
  id,
  children,
  className = "",
}: MobileDraggableWrapperProps) {
  return (
    <div data-mobile-id={id} className={className}>
      {children}
    </div>
  );
}
