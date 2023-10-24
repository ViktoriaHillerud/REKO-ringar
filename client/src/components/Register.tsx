import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../helpers/api";
import Reko from "../assets/logga-reko-cirkel 2.png";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = credentials;
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

    if (!email || !password || !name) {
      return setError("Något eller flera fält är tomma!");
    }

    try {
      const response = await register(credentials);

      if (response && response.user && response.user.error) {
        console.error("API request error:", response.user.error);
        setError(response.user.error);
      } else {
        console.log("User created:", response.user);
        console.log("User ID:", response.uid);

        // Optionally show a success message or perform any other actions

        navigate("/login");
      }
    } catch (error) {
      console.error("API request error:", error);
      setError("Användarnamn eller email finns redan");
    }
  };

  return (
    <div className="register">
      <div className="form-container">
        <img src={Reko} />
        <h2>Registrera som producent</h2>
        <form onSubmit={handleSubmit}>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Producentnamn"
            onChange={handleChange}
          ></input>
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
          <button>Registrera</button>

          <a href="/login">Redan registrerad?</a>
        </form>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Register;
