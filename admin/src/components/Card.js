import React from "react";

export default function Card({ children, dark, title, ...rest }) {
  return (
    <div className="card bd-gray2" {...rest}>
      <div className="card-header c-gray bd-gray2">{title}</div>
      <div className={`card-body ${dark ? "dark" : ""}`}>{children}</div>
    </div>
  );
}
