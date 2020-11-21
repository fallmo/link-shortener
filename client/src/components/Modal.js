import React from "react";

export default function Modal({
  isOpen,
  close,
  title,
  actions = [],
  children,
}) {
  const buttons = actions.map(action => (
    <button
      className={`btn ${action.colors} shrink`}
      onClick={action.handler}
      key={action.title}
    >
      {action.title}
    </button>
  ));
  return (
    <div className={isOpen ? "modal-wrapper" : "hidden"}>
      <div className="modal-overlay" onClick={close}></div>
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
