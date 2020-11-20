import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import Dots from "./Dots";
import { attemptLogout } from "../context/actions/auth";
import Modal from "./Modal";

export default function Navbar() {
  const [askLogout, setAskLogout] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const {
    unsetUser,
    auth: { isLoading, user },
  } = useContext(Context);

  const logoutUser = async () => {
    setAskLogout(false);
    unsetUser();
    await attemptLogout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="left">
          <div className="logo c-primary">
            grip<span className="c-secondary">URL</span>
          </div>
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
                onClick={() => setUserModal(true)}
                className="c-primary hoverfx"
                data-text={`Hello ${user.name.split(" ")[0]}`}
              >
                Hello {user.name.split(" ")[0]}
              </a>
              <a
                className="btn b-red c-white shrink"
                onClick={() => setAskLogout(true)}
              >
                Logout
              </a>
            </>
          )}
        </div>
      </nav>
      <Modal
        title="confirm"
        actions={[
          {
            title: "Cancel",
            colors: "b-gray2 bd-gray",
            handler: () => setAskLogout(false),
          },
          { title: "Logout", colors: "b-red c-white", handler: logoutUser },
        ]}
        isOpen={askLogout}
        close={() => setAskLogout(false)}
      >
        <p>Are you sure?</p>
      </Modal>
      <Modal title="user" isOpen={userModal} close={() => setUserModal(false)}>
        <div className="user-table">
          <table>
            <tbody>
              <tr>
                <td className="c-gray uppercase">Name:</td>
                <td className="c-primary purpose">{user && user.name}</td>
              </tr>
              <tr>
                <td className="c-gray uppercase">Email:</td>
                <td className="c-primary purpose">{user && user.email}</td>
              </tr>
              <tr>
                <td className="c-gray uppercase">Role:</td>
                <td className="c-primary purpose">
                  {user && user.admin ? "Admin" : "User"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
