"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import { useEffect } from "react";

/** Leading circle is 33% larger than the previous 18px mark. */
const CURSOR_SIZES = [24, 13, 9, 6] as const;

type CursorColor = MotionValue<string> | string;

function CursorDot({
  x,
  y,
  size,
  color,
  opacity,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  size: number;
  color: CursorColor;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[80] rounded-full"
      style={{
        width: size,
        height: size,
        x,
        y,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: color,
        opacity,
      }}
    />
  );
}

export default function CustomCursor({ color = "#FFFFFF" }: { color?: CursorColor }) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const opacity = useMotionValue(0);
  const trailX1 = useSpring(mouseX, { stiffness: 520, damping: 28, mass: 0.35 });
  const trailY1 = useSpring(mouseY, { stiffness: 520, damping: 28, mass: 0.35 });
  const trailX2 = useSpring(trailX1, { stiffness: 260, damping: 32, mass: 0.55 });
  const trailY2 = useSpring(trailY1, { stiffness: 260, damping: 32, mass: 0.55 });
  const trailX3 = useSpring(trailX2, { stiffness: 140, damping: 36, mass: 0.8 });
  const trailY3 = useSpring(trailY2, { stiffness: 140, damping: 36, mass: 0.8 });

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.cursor;
    root.style.cursor = "none";
    return () => {
      root.style.cursor = previous;
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      opacity.set(1);
    };
    const onLeave = () => opacity.set(0);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY, opacity]);

  const points = reduceMotion
    ? [
        { x: mouseX, y: mouseY },
        { x: mouseX, y: mouseY },
        { x: mouseX, y: mouseY },
        { x: mouseX, y: mouseY },
      ]
    : [
        { x: mouseX, y: mouseY },
        { x: trailX1, y: trailY1 },
        { x: trailX2, y: trailY2 },
        { x: trailX3, y: trailY3 },
      ];

  return (
    <>
      {points.map((point, index) => (
        <CursorDot
          key={index}
          x={point.x}
          y={point.y}
          size={CURSOR_SIZES[index] ?? 6}
          color={color}
          opacity={opacity}
        />
      ))}
    </>
  );
}
