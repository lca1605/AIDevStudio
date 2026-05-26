import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "right" | "top" | "bottom" | "left";
}

export function Tooltip({ content, children, side = "right" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), 400);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const positionClass = {
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  }[side];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none ${positionClass}`}
          style={{
            background: "var(--bg-overlay)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
