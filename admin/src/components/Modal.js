import React, { useState, useRef, useEffect } from "react";

export default function Modal({
  isOpen,
  close,
  title,
  actions = [],
  children,
}) {
  const [leaving, setLeaving] = useState("");
  const timeoutRef = useRef();
  const buttons = actions.map(action => (
    <button
      className={`btn ${action.colors} shrink`}
      onClick={action.handler}
      key={action.title}
    >
      {action.title}
    </button>
  ));

  const closeModal = () => {
    timeoutRef.current = setLeaving("leaving");
    setTimeout(() => {
      setLeaving("");
      close();
    }, 250);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <div className={isOpen ? `modal-wrapper ${leaving}` : "hidden"}>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal bd-gray2">
        <div className="modal-header uppercase c-gray">{title}</div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <div className="btn-row">{buttons} </div>
        </div>
      </div>
    </div>
  );
}
