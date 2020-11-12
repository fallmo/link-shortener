import React from "react";
import Dots from "./Dots";

export default function Navbar({ isLoading, user }) {
  return (
    <nav className="navbar">
      <div className="left">
        <div className="logo c-primary">momo.me</div>
      </div>
      <div className="right">
        {isLoading && (
          <p className="c-secondary">
            <Dots />
          </p>
        )}
        {!isLoading && user && (
          <a
            href="#"
            className="c-primary hoverfx"
            data-text={`Hello ${user.name}`}
          >
            Hello {user.name}
          </a>
        )}
        {/* <a href="#" className="btn b-secondary c-white">
          Shorten Now
        </a> */}
      </div>
    </nav>
  );
}
