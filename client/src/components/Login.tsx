import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    // Check if the user is already logged in when the component loads.
    const checkLoggedIn = () => {
      const uidFromCookies = Cookies.get("uid");
      if (uidFromCookies) {
        navigate("/");
      }
    };
    checkLoggedIn();
  }, [navigate]);

  const handleChange = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setError("");
    setCredentials((prev) => ({
      ...prev,
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

      if (response.data) {
        const { accessToken, uid } = response.data;

        // Set the "authtoken" and "uid" cookie with an expiration time (e.g., 2 hours)
		Cookies.set("authtoken", accessToken, { expires: 2 / 24, path: "/", sameSite: "None" });
		Cookies.set("uid", uid, { expires: 2 / 24, path: "/", sameSite: "None" });
		

        navigate("/");
      } else {
        return setError("Wrong credentials");
      }
    } catch (error) {
      console.error("API request error:", error);
      setError("Hmm något knas hände");
    }
  };

  return (
    <div className="login">
      <div className="form-container">
        <img src={Reko} alt="Reko logo" />
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
          <Link to="/register">Inte registrerad ännu?</Link>
        </form>
        {errorMessage}
      </div>
    </div>
  );
};

export default Login;
