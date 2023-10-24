import { useEffect, useState } from "react";
import { HiBars3BottomRight, HiOutlineXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { getOneUser } from "../helpers/api";
import Cookies from "js-cookie";
import "../styles/navbarstyle.css";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [errorMessage, setError] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const navigate = useNavigate();
  const uidFromCookies = Cookies.get("uid");

  //get one logged in user
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

  function handle_click() {
    setShowMenu(!showMenu);
  }

  const handleClickProfile = async () => {
    try {
      if (userLoggedIn) {
        navigate("/profile");
        setShowMenu(!showMenu);
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="nav_bar">
      <div onClick={handle_click} className="icon_container menu_switch">
        {showMenu ? (
          <HiOutlineXMark className="logo" />
        ) : (
          <HiBars3BottomRight className="logo bars" />
        )}
      </div>

      <div className={`nav_container ${showMenu ? "menu_active" : null}`}>
        <div className="icon_container logo"></div>
        <ul className="menu_items">
          <li>
            <Link onClick={handle_click} to="/">
              Hem
            </Link>
          </li>
          <li>
            <Link onClick={handle_click} to="/calendar">
              Kalender
            </Link>
          </li>
          <li>
            <Link onClick={handle_click} to="/producers">
              Producenter
            </Link>
          </li>
          <li>
            <Link onClick={handle_click} to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link onClick={handle_click} to="/register">
              Registrera
            </Link>
          </li>
          {uidFromCookies && userLoggedIn ? (
            <li>
              <Link onClick={handleClickProfile} to="profile">
                Profil
              </Link>
            </li>
          ) : null}
          {errorMessage}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
