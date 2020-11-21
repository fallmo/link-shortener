import React, { useContext, useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import Dots from "../components/Dots";
import Input from "../components/Input";
import {
  attemptLogin,
  attemptResend,
  attemptSignup,
} from "../context/actions/auth";
import { Context } from "../context/Context";

export default function Guest() {
  const [newU, setNew] = useState(false);
  const comp = newU ? (
    <Register leave={() => setNew(false)} />
  ) : (
    <Login leave={() => setNew(true)} />
  );
  return (
    <div className="screen guest b-white">
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
    <div className="fx-fromleft">
      <Card title="Login">
        {error && (
          <p className="small text-center c-red uppercase mb-2">{error}</p>
        )}
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
            <button className="btn b-primary c-white shrink" disabled={loading}>
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
          // ignoring disabled
        >
          Sign Up
        </a>{" "}
        instead.
      </p>
    </div>
  );
}
function Register({ leave }) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error, success } = await attemptSignup(fields);
    setLoading(false);
    if (error) return setError(error);
    else if (success) return setConfirm(success);
  };

  return (
    <div className="fx-fromright">
      <Card title="Register">
        {error && (
          <p className="small text-center c-red uppercase mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit} className={confirm ? "hidden" : ""}>
          <div className="form-group">
            <label>Name:</label>
            <Input
              type="text"
              placeholder="John Doe"
              disabled={loading}
              value={fields.name}
              onChange={e => setFields({ ...fields, name: e.target.value })}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <Input
              type="password"
              placeholder="*******"
              disabled={loading}
              value={fields.password2}
              onChange={e =>
                setFields({ ...fields, password2: e.target.value })
              }
              required
            />
          </div>
          <div className="submit-div">
            <button className="btn b-primary c-white shrink" disabled={loading}>
              {loading ? "Submitting" : "Submit"}
              {loading && <Dots />}
            </button>
          </div>
        </form>
        <div className={confirm ? "" : "hidden"}>
          <p>Email verification is being sent to:</p>
          <p className="verifyp c-tertiary">{confirm}</p>
          <ResendButton email={confirm} />
          <a
            href={`https://${confirm.split("@")[1]}`}
            target="_blank"
            className={
              isCommon(confirm)
                ? "btn b-secondary c-white text-center mt-2 shrink"
                : "hidden"
            }
          >
            Open Mail
          </a>
        </div>
      </Card>
      <p className="text-center small mt-2">
        {confirm ? "Already verified?" : "Already signed up?"}{" "}
        <a
          className="hoverfx c-tertiary"
          data-text="Login"
          onClick={leave}
          disabled={loading}
        >
          Login
        </a>{" "}
        {confirm ? "now." : "instead."}
      </p>
    </div>
  );
}

function ResendButton({ email }) {
  const [count, setCount] = useState(60);
  const timeoutRef = useRef();

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);
  useEffect(() => {
    if (email) {
      if (count > 0) {
        timeoutRef.current = setTimeout(decrementSecs, 1000);
      } else {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [count, email]);

  const decrementSecs = () => {
    return setCount(count => count - 1);
  };

  const resendMail = async () => {
    if (count !== 0) return;
    setCount(120);
    const { error, success } = await attemptResend(email);
  };
  return (
    <a
      className="btn b-primary c-white text-center shrink"
      onClick={resendMail}
    >
      {count > 0 ? `Resend in ${count}s` : "Resend"}
    </a>
  );
}

function isCommon(email) {
  email = email.split("@")[1];
  return email === "gmail.com" || email === "yahoo.com";
}
