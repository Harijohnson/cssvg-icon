"use client";

import { useRef, useEffect, useState, ComponentType } from "react";

export interface IconControlProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** true = playing (default), false = paused */
  animated?: boolean;
  /** When true, starts paused and plays only while hovered */
  hoverToAnimate?: boolean;
}

export function withIconControls<T extends IconControlProps>(
  Icon: ComponentType<T>
): ComponentType<T> {
  function ControlledIcon(props: T) {
    const { animated = true, hoverToAnimate = false, ...iconProps } = props as IconControlProps;
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const shouldPauseOnMount = !animated || hoverToAnimate;
    const [visible, setVisible] = useState(!shouldPauseOnMount);

    useEffect(() => {
      const svg = wrapperRef.current?.querySelector("svg") as SVGSVGElement | null;
      if (!svg) return;
      if (hoverToAnimate) { svg.pauseAnimations(); }
      else { animated ? svg.unpauseAnimations() : svg.pauseAnimations(); }
      setVisible(true);
    }, [animated, hoverToAnimate]);

    const onMouseEnter = () => {
      if (!hoverToAnimate) return;
      (wrapperRef.current?.querySelector("svg") as SVGSVGElement | null)?.unpauseAnimations();
    };
    const onMouseLeave = () => {
      if (!hoverToAnimate) return;
      (wrapperRef.current?.querySelector("svg") as SVGSVGElement | null)?.pauseAnimations();
    };

    return (
      <span
        ref={wrapperRef}
        style={{ display: "contents", visibility: visible ? "visible" : "hidden" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Icon {...(iconProps as T)} />
      </span>
    );
  }

  ControlledIcon.displayName = `Controlled(${Icon.displayName ?? Icon.name})`;
  return ControlledIcon;
}
