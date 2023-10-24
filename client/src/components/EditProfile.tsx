import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "../styles/profile.css";
import { deleteUser, getOneUser, updateUser } from "../helpers/api";
import { useNavigate } from "react-router-dom";
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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [id]: value,
    }));
  };

  const handleChangeArray = (
    arrayName: string,
    value: string,
    fieldName: "tags" | "social" | "gallery"
  ) => {
    setUser((prevUser) => ({
      ...prevUser!,
      [fieldName]: prevUser![fieldName].map((item, index) =>
        arrayName === `${fieldName}${index + 1}` ? value : item
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      <a
        style={{ fontSize: "1.25rem", textDecoration: "none", color: "green" }}
        href="/profile"
      >
        <HiArrowLeft
          style={{ fontSize: "2rem", marginTop: "20px" }}
        ></HiArrowLeft>
        Tillbaka
      </a>

      {user && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Ändra namn:</label>
          <input
            id="name"
            type="text"
            placeholder={user.name}
            onChange={handleTextareaChange}
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
            onChange={handleTextareaChange}
          ></input>

          <label>Ändra address:</label>
          <input
            id="address"
            type="text"
            placeholder={user.address}
            onChange={handleTextareaChange}
          ></input>

          <label>Ändra telefonnummer:</label>
          <input
            id="phone"
            type="text"
            placeholder={user.phone}
            onChange={handleTextareaChange}
          ></input>

          <label>Ändra sociala medie-länkar:</label>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
              <input
                style={tagStyle}
                id={`social${index + 1}`}
                type="text"
                placeholder={user.social[index] || ""}
                onChange={(e) =>
                  handleChangeArray(`social${index + 1}`, e.target.value, "social")
                } 
              />
            </div>
          ))}

          <label>Ändra profilbild:</label>
          <input
            id="img"
            type="file"
            placeholder={user.img}
            onChange={handleTextareaChange}
          ></input>

          <label>Ändra taggar (max 4)</label>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <input
                style={tagStyle}
                id={`tag${index + 1}`}
                type="text"
                placeholder={user.tags[index] || ""}
                onChange={(e) =>
                  handleChangeArray(`tag${index + 1}`, e.target.value, "tags")
                }
              />
            </div>
          ))}

          <label>Ändra galleri (max 6)</label>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
             <input
                style={tagStyle}
                id={`gallery${index + 1}`}
                type="text"
                placeholder={user.gallery[index] || ""}
                onChange={(e) =>
                  handleChangeArray(`gallery${index + 1}`, e.target.value, "gallery")
                }
              />
            </div>
          ))}

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
