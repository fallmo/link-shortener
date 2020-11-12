import React from "react";
import Dots from "../components/Dots";

export default function Loading() {
  return (
    <div className="loading screen">
      <p className="c-primary">
        Loading
        <Dots />
      </p>
    </div>
  );
}
