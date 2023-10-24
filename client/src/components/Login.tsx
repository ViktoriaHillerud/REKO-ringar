import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../helpers/api";
import Reko from "../assets/logga-reko-cirkel 2.png";
import "../index.css";
import Cookies from "js-cookie";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { email, password } = credentials;
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setError("");
    setCredentials((before) => ({
      ...before,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      return setError("Något eller flera fält är tomma!");
    }

    try {
      const response = await login(credentials);
      console.log(response.data);

      if (response.data) {
        const { accessToken, uid } = response.data;

        // Set the "authtoken" and "uid" cookie with an expiration time (e.g., 2 hours)
        Cookies.set("authtoken", accessToken, { expires: 2 / 24, path: "/" });
        Cookies.set("uid", uid, { expires: 2 / 24, path: "/" });

        navigate("/");
      } else {
        return setError("Wrong credentials");
      }
    } catch (error) {
      console.error("API request error:", error);
      return setError("Hmm något knas hände");
    }
  };

  return (
    <div className="login">
      <div className="form-container">
        <img src={Reko} />
        <h2>Logga in som producent</h2>
        <form onSubmit={handleSubmit}>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Email"
            onChange={handleChange}
          ></input>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Lösenord"
            onChange={handleChange}
          ></input>
          <button>Logga in</button>

          <a href="/register">Inte registrerad ännu?</a>
        </form>
        {errorMessage}
      </div>
    </div>
  );
};

export default Login;
