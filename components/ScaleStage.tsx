"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  html: string;
  designWidth?: number;
  designHeight?: number;
};

export default function ScaleStage({ html, designWidth = 1920, designHeight = 1080 }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function updateScale() {
      const width = wrapper!.clientWidth;
      setScale(width / designWidth);
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [designWidth]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full mx-auto"
      style={{ aspectRatio: `${designWidth} / ${designHeight}`, maxWidth: "100vw", overflow: "hidden" }}
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
