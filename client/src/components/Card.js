import React from "react";

export default function Card({ children, title, ...rest }) {
  return (
    <div className="card bd-gray2" {...rest}>
      <div className="card-header c-gray bd-gray2">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
}
