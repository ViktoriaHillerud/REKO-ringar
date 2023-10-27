import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import { deleteUser, getOneUser, updateUser } from "../helpers/api";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Cookies from "js-cookie";
import { HiArrowLeft } from "react-icons/hi2";

const tagStyle = {
  width: "50px",
};

const btnStyle = {
  border: "4px solid green",
  borderRadius: "10px",
  padding: "5px",
  fontSize: "15px",
  cursor: "pointer",
  width: "200px",
  margin: "30px auto",
};

const btnStyleRed = {
  border: "4px solid red",
  borderRadius: "10px",
  padding: "5px",
  fontSize: "15px",
  cursor: "pointer",
  width: "200px",
  margin: "30px auto",
};

const btnStyleWarning = {
  backgroundColor: "red",
  borderRadius: "10px",
  padding: "5px",
  fontSize: "15px",
  cursor: "pointer",
  width: "200px",
  margin: "30px auto",
};

interface UserProfile {
  _id: string;
  img: string;
  name: string;
  tags: string[];
  phone: string;
  address: string;
  other: string;
  desc: string;
  social: string[];
  gallery: string[];
}

const EditProfile = () => {
  const [errorMessage, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>({
    _id: "",
    img: "",
    name: "",
    tags: [],
    phone: "",
    address: "",
    other: "",
    desc: "",
    social: [],
    gallery: [],
  });
  const [showModal, setModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = Cookies.get("uid");

        if (!uid) {
          throw new Error("UID not found");
        }

        const response = await getOneUser(uid);
        console.log(response.user);
        setUser(response.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [id]: value,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    // const fileInput = document.getElementById("img") as HTMLInputElement;

    // if (
    //   id.startsWith("img") &&
    //   fileInput &&
    //   fileInput.files &&
    //   fileInput.files.length > 0
    // ) {
    //   const file = fileInput.files[0];
    //   if (file) {
    //     setUser((prevUser: UserProfile | null) => ({
    //       ...prevUser!,
    //       img: URL.createObjectURL(file),
    //     }));
    //   }
    //   return;
    // } else
	if (id.startsWith("tag")) {
      const index = parseInt(id.replace("tag", ""), 10) - 1; // Calculate index
      setUser((prevUser: UserProfile | null) => {
        const updatedTags = [...(prevUser?.tags || [])]; // Initialize with empty array if undefined
        updatedTags[index] = value;
        return {
          ...prevUser!,
          tags: updatedTags,
        };
      });
    } else if (id.startsWith("social")) {
      const index = parseInt(id.replace("social", ""), 10) - 1; // Calculate index
      setUser((prevUser: UserProfile | null) => {
        const updatedSocial = [...(prevUser?.social || [])]; // Initialize with empty array if undefined
        updatedSocial[index] = value;
        return {
          ...prevUser!,
          social: updatedSocial,
        };
      });
    } else if (id.startsWith("gallery")) {
      const index = parseInt(id.replace("gallery", ""), 10) - 1; // Calculate index
      setUser((prevUser: UserProfile | null) => {
        const updatedGallery = [...(prevUser?.gallery || [])]; // Initialize with empty array if undefined
        updatedGallery[index] = value;
        return {
          ...prevUser!,
          gallery: updatedGallery,
        };
      });
    } else {
      setUser((prevUser: UserProfile | null) => ({
        ...prevUser!,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const uid = Cookies.get("uid");
      if (!uid) {
        setError("UID not found in cookies");
        return;
      }

      if (user) {
        const updatedData = {
          _id: user._id,
          img: user.img,
          name: user.name,
          tags: user.tags,
          phone: user.phone,
          address: user.address,
          other: user.other,
          desc: user.desc,
          social: user.social,
          gallery: user.gallery,
        };

        const response = await updateUser(updatedData);
        navigate("/profile");
        if (response.error) {
          setError("Failed to update user data");
        } else {
          console.log("Update successful!");
        }
      } else {
        setError("User data is missing");
      }
    } catch (error) {
      setError("Try again, something went wrong");
    }
  };

  const handleDeleteClick = () => {
    setModal(true);
  };

  const handleDelete = async () => {
    try {
      const uid = Cookies.get("uid");
      if (!uid) {
        setError("UID not found in cookies");
        return;
      }
      await deleteUser(uid);
      navigate("/");
    } catch (error) {
      setError("Try again, something went wrong");
    }
  };

  const modal = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "10%",
        right: "10%",
        bottom: "50%",
        height: "400px",
        border: "1px solid rgba(0,0,0,0.1)",
        padding: "40px",
        backgroundColor: "rgba(255,255,255,0.8)",
      }}
    >
      <p className="text-center">
        Är du säker på att du vill radera din profil?
      </p>
      <Button style={btnStyleWarning} onClick={handleDelete}>
        Ja, radera
      </Button>
    </div>
  );

  return (
    <div className="editForm">
      <Link
        style={{ fontSize: "1.25rem", textDecoration: "none", color: "green" }}
        to="/profile"
      >
        <HiArrowLeft
          style={{ fontSize: "2rem", marginTop: "20px" }}
        ></HiArrowLeft>
        Tillbaka
      </Link>

      {user && (
		/* encType="multipart/form-data" if multer*/
        <form onSubmit={handleSubmit}>
          <label>Ändra namn:</label>
          <input
            id="name"
            type="text"
            placeholder={user.name}
            onChange={handleChange}
          ></input>

          <label>Ändra beskrivning:</label>
          <textarea
            id="desc"
            placeholder={user.desc}
            onChange={handleTextareaChange}
          ></textarea>

          <label>Ändra utlämningsinfo:</label>
          <input
            id="other"
            type="text"
            placeholder={user.other}
            onChange={handleChange}
          ></input>

          <label>Ändra address:</label>
          <input
            id="address"
            type="text"
            placeholder={user.address}
            onChange={handleChange}
          ></input>

          <label>Ändra telefonnummer:</label>
          <input
            id="phone"
            type="text"
            placeholder={user.phone}
            onChange={handleChange}
          ></input>

          <label>Ändra sociala medie-länkar:</label>
          <input
            id="social1"
            type="text"
            placeholder={user.social[0]}
            onChange={handleChange}
          ></input>
          <input
            id="social2"
            type="text"
            placeholder={user.social[1]}
            onChange={handleChange}
          ></input>

          <label>Ändra profilbild:</label>
          <input
            id="img"
            type="text"
            placeholder={user.img}
            onChange={handleChange}
          ></input>

          <label>Ändra taggar (max 4)</label>
          <input
            style={tagStyle}
            id="tag1"
            type="text"
            placeholder={user.tags[0]}
            onChange={handleChange}
          ></input>
          <input
            style={tagStyle}
            id="tag2"
            type="text"
            placeholder={user.tags[1]}
            onChange={handleChange}
          ></input>
          <input
            style={tagStyle}
            id="tag3"
            type="text"
            placeholder={user.tags[2]}
            onChange={handleChange}
          ></input>
          <input
            style={tagStyle}
            id="tag4"
            type="text"
            placeholder={user.tags[3]}
            onChange={handleChange}
          ></input>

          <label>Ändra galleri (max 6)</label>
          <input
            id="gallery1"
            type="text"
            placeholder={user.gallery[0]}
            onChange={handleChange}
          ></input>
          <input
            id="gallery2"
            type="text"
            placeholder={user.gallery[1]}
            onChange={handleChange}
          ></input>
          <input
            id="gallery3"
            type="text"
            placeholder={user.gallery[2]}
            onChange={handleChange}
          ></input>
          <input
            id="gallery4"
            type="text"
            placeholder={user.gallery[3]}
            onChange={handleChange}
          ></input>
          <input
            id="gallery5"
            type="text"
            placeholder={user.gallery[4]}
            onChange={handleChange}
          ></input>
          <input
            id="gallery6"
            type="text"
            placeholder={user.gallery[5]}
            onChange={handleChange}
          ></input>

          <Button style={btnStyle}>Ändra mina uppgifter</Button>
        </form>
      )}

      <Button onClick={handleDeleteClick} style={btnStyleRed}>
        Ta bort mitt konto
      </Button>
      {showModal && modal}
      {errorMessage}
    </div>
  );
};

export default EditProfile;
