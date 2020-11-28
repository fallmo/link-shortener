import React, { forwardRef, useState, useRef, useEffect } from "react";

const Flash = forwardRef((props, ref) => {
  const [state, setState] = useState("hidden");
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [queue, setActualQueue] = useState([]);
  const [isRunning, setRunning] = useState(false);
  const queRef = useRef();
  const timeoutRef = useRef();

  function setQueue(value) {
    queRef.current = value;
    setActualQueue(value);
  }

  useEffect(() => {
    if (!isRunning && queue.length > 0) {
      const { color, text, duration = 2000 } = queue[0];
      setRunning(true);
      setState("");
      setColor(color);
      setText(text);
      timeoutRef.current = setTimeout(dismiss, duration);
    }
  }, [queue]);

  function show(config) {
    setQueue([...queue, config]);
  }

  function dismiss() {
    setState("leaving");
    timeoutRef.current = setTimeout(() => {
      setState("hidden");
      setRunning(false);
      setQueue(queRef.current.slice(1));
    }, 500);
  }

  if (ref) ref.current = { show };
  return (
    <div className={`flash-container ${state}`}>
      <p className={`flash-text c-${color}`}>{text}</p>
    </div>
  );
});

export default Flash;
