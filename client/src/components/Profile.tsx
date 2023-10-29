import { useEffect, useState } from "react";
import "../styles/profile.css";
import Button from "./Button";
import { getOneUser, getOneUserPublic, logout } from "../helpers/api";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Cookies from "js-cookie";

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  img?: string;
  phone?: string;
  gallery?: string[];
  address: string;
  desc?: string;
  social?: string[];
  events?: [
    {
      start: Date;
      end: Date;
      title: string;
      desc: string;
    }
  ];
  tags?: string[];
  other?: string;
}

const Profile = () => {
  const style = {
    border: "none",
    borderRadius: "5px",
    width: "70px",
    padding: "2px",
    fontSize: "13px",
  };

  const btnStyle = {
    border: "4px solid green",
    borderRadius: "5px",
    padding: "3px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "5px",
    marginBottom: "5px",
    width: "100px",
  };

  const btnStyleRed = {
    border: "4px solid red",
    borderRadius: "5px",
    padding: "3px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "5px",
    marginBottom: "5px",
    width: "100px",
  };

  const { id } = useParams();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<UserResponse | null>(null);
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();

  //get one logged in user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = Cookies.get("uid");

        if (!uid) {
          throw new Error("UID not found");
        }

        const response = await getOneUser(uid);
        // console.log(response.user);
        setUserLoggedIn(response.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  //get public user

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error("User ID is undefined.");
          return;
        }

        const response = await getOneUserPublic(id);

        if (!response) {
          throw new Error("User not found");
        }
        setUser(response.user);
        // console.log(response.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleClickEdit = () => {
    navigate("/profile/edit");
  };

  const handleClickLogout = async () => {
    try {
      const uid = Cookies.get("uid");
      if (!uid) {
        setError("UID not found in cookies");
        return;
      }
      await logout();
      // Clear the cookies on the frontend
      Cookies.remove("authtoken");
      Cookies.remove("uid");
      navigate("/");
    } catch (error) {
      setError("Try again, something went wrong");
    }
  };

  return (
    <div style={{ height: "100%" }}>
      {user ? (
        <>
          <div className="profile">
            <section className="profile-container">
              <img className="profile-pic" src={user.img}></img>
              <article className="profile-tags">
                {user.tags ? (
                  user.tags.map((tag) => (
                    <Button key={tag} style={style}>
                      {tag}
                    </Button>
                  ))
                ) : (
                  <p>No tags available.</p>
                )}
              </article>
              <article className="profile-price">
                <h5>Prisexempel</h5>
                <p>
                  Ägg: <strong>70kr/30st</strong>
                </p>
                <hr></hr>
                <p>
                  Nötkött: <strong>169kr/kg</strong>
                </p>
                <hr></hr>
                <p>
                  Bönor: <strong>50kr/kg</strong>
                </p>
                <hr></hr>
              </article>
            </section>
            <section className="profile-container desc">
              <h4 className="box1">{user.name}</h4>
              <article className="profile-desc box2">
                <p>{user.desc}</p>
              </article>
              <article className="profile-other box3">
                <h5>Nästa utlämning</h5>

                {user && user.events
                  ? user.events.map((event, index) => (
                      <div key={index}>
                        <Link to="/calendar">{event.title}</Link>
                        <p>
                          Start:{" "}
                          {moment(event.start, "YYYY-MM-DDTHH:mm:ss").format(
                            "YYYY-MM-DD"
                          )}
                        </p>
                        <p>
                          Slut:{" "}
                          {moment(event.end, "YYYY-MM-DDTHH:mm:ss").format(
                            "YYYY-MM-DD"
                          )}
                        </p>
                      </div>
                    ))
                  : "Inga utlämningar ännu"}
              </article>
            </section>
          </div>
          <section className="profile-gallery">
            {user.gallery && user.gallery.length > 0 ? (
              <article className="gallery">
                <h4>Bilder</h4>
                <div className="gallery-container">
                  {user.gallery.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      alt={`Gallery Image ${index}`}
                    />
                  ))}
                </div>
              </article>
            ) : (
              <p>No gallery images available.</p>
            )}
            <article className="contact">
                  <h4>Kontakt</h4>
                  <h6>Adress:</h6>
                  <p> {user.address}</p>
                  <h6>Tel: </h6>
                  <p>{user.phone}</p>
                  {user.social && user.social.length > 0 ? (
                    <h6>
                      Sociala medier:
                      {user.social.map((item, index) => (
                        <a key={index} target="_blank" href={item}>
                          <br></br>
                          <span>
                            {item.slice(12, 20)} <br></br>
                          </span>
                        </a>
                      ))}
                    </h6>
                  ) : null}
                </article>
          </section>
        </>
      ) : (
        <div>
          {userLoggedIn && (
            <>
              <div className="profile">
                <section className="profile-container">
                  <img className="profile-pic" src={userLoggedIn.img}></img>
                  <div className="profile-btns">
                    <Button style={btnStyle} onClick={handleClickEdit}>
                      Ändra profil
                    </Button>
                    <Button style={btnStyleRed} onClick={handleClickLogout}>
                      Logga ut
                    </Button>
                  </div>

                  {errorMessage}
                  <article className="profile-tags">
                    {userLoggedIn.tags ? (
                      userLoggedIn.tags.map((tag) => (
                        <Button key={tag} style={style}>
                          {tag}
                        </Button>
                      ))
                    ) : (
                      <p>No tags available.</p>
                    )}
                  </article>
                  <article className="profile-price">
                    <h5>Prisexempel</h5>
                    <p>
                      Ägg: <strong>70kr/30st</strong>
                    </p>
                    <hr></hr>
                    <p>
                      Nötkött: <strong>169kr/kg</strong>
                    </p>
                    <hr></hr>
                    <p>
                      Bönor: <strong>50kr/kg</strong>
                    </p>
                    <hr></hr>
                  </article>
                </section>
                <section className="profile-container desc">
                  <h4 className="box1">{userLoggedIn.name}</h4>

                  <article className="profile-desc box2">
                    <p>{userLoggedIn.desc}</p>
                  </article>
                  <article className="profile-other box3">
                    <h5 className="profile-headline">Nästa utlämning</h5>
                    {userLoggedIn.events && userLoggedIn.events.length > 0
                      ? userLoggedIn.events.map((event, index) => (
                          <div key={index}>
                            <Link to="/calendar">{event.title}</Link>
                            <p>
                              Start:{" "}
                              {moment(
                                event.start,
                                "YYYY-MM-DDTHH:mm:ss"
                              ).format("YYYY-MM-DD")}
                            </p>
                            <p>
                              Slut:{" "}
                              {moment(event.end, "YYYY-MM-DDTHH:mm:ss").format(
                                "YYYY-MM-DD"
                              )}
                            </p>
                          </div>
                        ))
                      : "Inga utlämningar ännu"}
                  </article>
                </section>
              </div>
              <section className="profile-gallery">
                {userLoggedIn.gallery && userLoggedIn.gallery.length > 0 ? (
                  <article className="gallery">
                    <h4>Bilder</h4>
                    <div className="gallery-container">
                      {userLoggedIn.gallery.map((item, index) => (
                        <img
                          key={index}
                          src={item}
                          alt={`Gallery Image ${index}`}
                        />
                      ))}
                    </div>
                  </article>
                ) : (
                  <p>No gallery images available.</p>
                )}
                <article className="contact">
                  <h4>Kontakt</h4>
                  <h6>Adress:</h6>
                  <p> {userLoggedIn.address}</p>
                  <h6>Tel: </h6>
                  <p>{userLoggedIn.phone}</p>
                  {userLoggedIn.social && userLoggedIn.social.length > 0 ? (
                    <h6>
                      Sociala medier:
                      {userLoggedIn.social.map((item, index) => (
                        <a key={index} target="_blank" href={item}>
                          <br></br>
                          <span>
                            {item.slice(12, 20)} <br></br>
                          </span>
                        </a>
                      ))}
                    </h6>
                  ) : null}
                </article>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
