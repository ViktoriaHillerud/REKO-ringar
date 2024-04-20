import React from "react";
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

const NewProfile = () => {
  const style = {
    border: "none",
    borderRadius: "5px",
    width: "70px",
    padding: "2px",
    fontSize: "13px",
  };

  const btnStyle = {
    border: "4px solid green",
	backgroundColor: "green",
	color: "white",
    borderRadius: "5px",
    padding: "3px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "5px",
    marginBottom: "5px",
    width: "120px",
	display: "block"
  };

  const btnStyleRed = {
    border: "4px solid red",
	backgroundColor: "red",
	color: "white",
    borderRadius: "5px",
    padding: "3px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "5px",
    marginBottom: "5px",
    width: "120px",
  };

  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (id) {
          response = await getOneUserPublic(id);
        } else {
          const uid = Cookies.get("uid");
          if (!uid) throw new Error("UID not found");
          response = await getOneUser(uid);
        }
        setUserProfile(response.user);
      } catch (error) {
        console.error(error);
        setError("Unable to fetch user data");
        navigate("/login");
      }
    };

    fetchData();
  }, [id, navigate]);

  
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
    <div className="container">
      {userProfile && (
        <>
          <div className="image-and-tags">
            <img src={userProfile.img} alt="Profile" className="profileImg" />
            <article className="profile-tags">
              {userProfile.tags ? (
                userProfile.tags.map((tag) => (
                  <Button key={tag}>{tag}</Button>
                ))
              ) : (
                <p>No tags available.</p>
              )}
            </article>
			{!id && (
            <div style={{ marginTop: "20px" }}>
              <Button style={btnStyle} onClick={() => navigate("/profile/edit")}>Redigera profil</Button>
              <Button style={btnStyleRed} onClick={handleClickLogout}>Logga ut</Button>
            </div>
          )}
			<section className="new-section">
  <h4>Prisexempel</h4>
</section>
          </div>

          <div className="profile-info">
			<div className="desc">
			<h2>{userProfile.name}</h2>
            <p>{userProfile.desc}</p>
			</div>
    
          </div>

          <section className="profile-gallery">
			<h3 className="gallery-title">Bilder</h3>
            {userProfile.gallery && userProfile.gallery.length > 0 ? (
              userProfile.gallery.map((item, index) => (
                <img key={index} src={item} alt={`Gallery Image ${index}`} />
              ))
            ) : (
              <p>No gallery images available.</p>
            )}
          </section>

		     
          <div className="next-drop">
		  <h2>Nästa utlämning</h2>
		  {userProfile && userProfile.events
                  ? userProfile.events.map((event, index) => (
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
            <p>{userProfile.desc}</p>
		  </div>
        </>
      )}
    </div>
  );
};

export default NewProfile;
