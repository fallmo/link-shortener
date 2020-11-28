import React, { useContext, useState } from "react";
import Card from "../components/Card";
import Dots from "../components/Dots";
import Input from "../components/Input";
import { attemptLogin } from "../context/actions/auth";
import { Context } from "../context/Context";

export default function Guest() {
  return (
    <div className="screen guest b-white">
      <div className="main">
        <Login />
      </div>
      <div className="btns bd-gray2 b-gray2"></div>
    </div>
  );
}

function Login() {
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
    </div>
  );
}
