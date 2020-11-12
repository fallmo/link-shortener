import React, { useState } from "react";

export default function Guest() {
  const [newU, setNew] = useState(false);
  const comp = newU ? <Register /> : <Login />;
  return (
    <div className="screen guest">
      <div className="main">{comp}</div>
      <div className="btns bd-gray2 b-gray2">
        <button onClick={() => setNew(false)}>Login</button>
        <button onClick={() => setNew(true)}>Register</button>
      </div>
    </div>
  );
}

function Login() {
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}
function Register() {
  return (
    <div>
      <h1>Register</h1>
    </div>
  );
}
