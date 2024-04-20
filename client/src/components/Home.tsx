import { useState, useEffect } from "react";
import { getOneUser } from "../helpers/api";
import "../index.css";
import logga from "../assets/Mask.jpg";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface User {
  name: string;
}

const Home = () => {
  const [userLoggedIn, setUserLoggedIn] = useState<User | null>(null);
  const navigate = useNavigate();

  const uidFromCookies = Cookies.get("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!uidFromCookies) {
          throw new Error("UID not found");
        }

        const response = await getOneUser(uidFromCookies);
        console.log(response.user);
        setUserLoggedIn(response.user);
      } catch (error) {
        console.error(error);
      }
    };

    if (uidFromCookies) {
      fetchData();
    }
  }, [uidFromCookies]);

  const handleClickCalendar = () => {
    navigate("/calendar");
  };

  const handleClickSearch = () => {
    navigate("/producers");
  };

  const style = {
    border: "4px solid green",
    borderRadius: "10px",
    padding: "10px",
    fontSize: "20px",
    cursor: "pointer",
  };

  return (
    <div className="home">
      {uidFromCookies && userLoggedIn && (
        <h3>Välkommen tillbaka, {userLoggedIn.name}!</h3>
      )}
      
        <img className="homeImg" src={logga} alt="Reko logga" />
      

      <div className="desc-container">
        <h4>
          Välkommen till Reko! <br />
          Här möts konsumenter och producenter för ett hållbart Sverige!
        </h4>
      </div>

      <div className="goto-btns">
        <Button onClick={handleClickCalendar} style={style}>
          Kalender
        </Button>
        <Button onClick={handleClickSearch} style={style}>
          Sök producenter
        </Button>
      </div>
    </div>
  );
};

export default Home;
