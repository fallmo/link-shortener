import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import Dots from "./Dots";
import Modal from "./Modal";

export default function Navbar() {
  const [askLogout, setAskLogout] = useState(false);
  const {
    unsetUser,
    auth: { isLoading, user },
  } = useContext(Context);

  const logoutUser = () => {
    setAskLogout(false);
    unsetUser();
  };
  return (
    <>
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
            <>
              <a
                href="#"
                className="c-primary hoverfx"
                data-text={`Hello ${user.name}`}
              >
                Hello {user.name}
              </a>
              <a
                className="btn b-red c-white"
                onClick={() => setAskLogout(true)}
              >
                Logout
              </a>
            </>
          )}
        </div>
      </nav>
      <Modal title="confirm" prompt="Are You Sure?" isOpen={askLogout}>
        <div className="btn-row">
          <button
            className="btn b-primary c-white"
            onClick={() => setAskLogout(false)}
          >
            Cancel
          </button>
          <button className="btn b-red c-white" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </Modal>
    </>
  );
}
