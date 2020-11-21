import React, { forwardRef, useState, useRef, useEffect } from "react";

const Flash = forwardRef((props, ref) => {
  const [state, setState] = useState("hidden");
  const [text, setText] = useState("");
  const [color, setColor] = useState("white");

  const timeoutRef = useRef();

  const controller = {
    dismiss: dismiss,
    show: show,
    isOpen: state === "",
  };

  function dismiss() {
    if (state === "leaving") return;
    setState("leaving");
    timeoutRef.current = setTimeout(() => {
      setState("hidden");
      setText("");
      setColor("white");
    }, 500);
  }
  function show({ color, text, stay }) {
    if (!state) return;
    clearTimeout(timeoutRef.current);
    setText(text);
    setColor(color);
    setState("");
    if (!stay) timeoutRef.current = setTimeout(dismiss, 2000);
  }

  if (ref) ref.current = controller;

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <div className={`flash-container ${state}`}>
      <p className={`flash-text c-${color}`}>{text}</p>
    </div>
  );
});

export default Flash;
