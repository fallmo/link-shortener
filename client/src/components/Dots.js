import React, { useEffect, useState, useRef } from "react";

export default function Dots() {
  const [dots, setDots] = useState(".");
  const timeoutRef = useRef(null);

  const delayDots = val => {
    timeoutRef.current = setTimeout(() => {
      setDots(val);
    }, 500);
  };
  useEffect(() => {
    if (dots === ".") return delayDots("..");
    if (dots === "..") return delayDots("...");
    if (dots === "...") return delayDots(".");
  }, [dots]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return dots;
}
