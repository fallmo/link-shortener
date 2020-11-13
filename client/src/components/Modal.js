import React from "react";

export default function Modal({ title, prompt, children, isOpen }) {
  return (
    <div className={isOpen ? "modal-wrapper" : "hidden"}>
      <div className="modal bd-gray2">
        <div className="modal-header uppercase c-gray">{title}</div>
        <div className="modal-body">
          <p>{prompt}</p>
        </div>
        <div className="modal-footer">{children}</div>
      </div>
    </div>
  );
}
