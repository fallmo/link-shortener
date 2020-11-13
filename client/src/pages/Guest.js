import React, { useContext, useState } from "react";
import Card from "../components/Card";
import Dots from "../components/Dots";
import Input from "../components/Input";
import { attemptLogin } from "../context/actions/auth";
import { Context } from "../context/Context";

export default function Guest() {
  const [newU, setNew] = useState(false);
  const comp = newU ? (
    <Register leave={() => setNew(false)} />
  ) : (
    <Login leave={() => setNew(true)} />
  );
  return (
    <div className="screen guest">
      <div className="main">{comp}</div>
      <div className="btns bd-gray2 b-gray2">
        <button
          onClick={() => setNew(false)}
          className={!newU ? "selected b-primary c-white" : ""}
        >
          Login
        </button>
        <button
          onClick={() => setNew(true)}
          className={newU ? "selected b-primary c-white" : ""}
        >
          Register
        </button>
      </div>
    </div>
  );
}

function Login({ leave }) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(Context);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error, data } = await attemptLogin(fields);
    setLoading(false);
    if (error) return setError(error);
    else if (data) return setUser(data);
  };
  return (
    <div>
      <Card title="Login">
        {error && <p className="small text-center c-red uppercase">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <Input
              type="email"
              placeholder="example@domain.ext"
              value={fields.email}
              disabled={loading}
              onChange={e => setFields({ ...fields, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <Input
              type="password"
              placeholder="*******"
              disabled={loading}
              value={fields.password}
              onChange={e => setFields({ ...fields, password: e.target.value })}
              required
            />
          </div>
          <div className="submit-div">
            <button className="btn b-primary c-white" disabled={loading}>
              {loading ? "Submitting" : "Submit"}
              {loading && <Dots />}
            </button>
          </div>
        </form>
      </Card>
      <p className="text-center small mt-2">
        Don't have an account?{" "}
        <a
          className="hoverfx c-tertiary"
          data-text="Sign Up"
          onClick={leave}
          disabled={loading}
        >
          Sign Up
        </a>{" "}
        instead.
      </p>
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
