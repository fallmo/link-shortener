import React from "react";

export default function Input({ children, ...rest }) {
  return <input {...rest} className="input bd-gray2" />;
}
