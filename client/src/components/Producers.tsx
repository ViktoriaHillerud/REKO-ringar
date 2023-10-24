import { useEffect, useState } from "react";
import { getAllUsers } from "../helpers/api";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import FindProducer from "./FindProducer";
import "../styles/producers.css";

interface User {
  _id: string;
  name: string;
  desc: string;
}

const style = {
  border: "4px solid green",
  borderRadius: "10px",
  padding: "4px",
  fontSize: "13px",
  cursor: "pointer",
  height: "45px",
  width: "150px",
};

function Producers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [searchedUser, setSearchedUser] = useState<User | null | string>(null);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    console.log(id);
    navigate(`/profile/${id}`);
  };

  const onSearchClick = (search: string) => {
    if (users) {
      const foundUser = users.find(
        (user) => user.name.toLowerCase() === search.toLowerCase()
      );
      setSearchedUser(foundUser || null);
    } else {
      setSearchedUser(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers();
        console.log(response.users.data);
        setUsers(response.users.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Producenter</h1>
      <div className="producers">
        <FindProducer onSearchClick={onSearchClick} />
        <div className="searched-producer">
          {typeof searchedUser === "string" ? (
            <p>{searchedUser}</p>
          ) : (
            searchedUser &&
            typeof searchedUser === "object" && (
              <div className="producers-card" key={searchedUser._id}>
                <div>
                  <p>{searchedUser.name}</p>
                  <span>{searchedUser.desc}</span>
                </div>
                <Button
                  onClick={() => handleClick(searchedUser._id)}
                  style={style}
                >
                  Gå till producent
                </Button>
              </div>
            )
          )}
        </div>
        <div className="producers-div">
          {users
            ? users.map((item) => (
                <div className="producers-card" key={item._id}>
                  <div>
                    <p>{item.name}</p>
                    <span>{item.desc}</span>
                  </div>
                  <Button onClick={() => handleClick(item._id)} style={style}>
                    Gå till producent
                  </Button>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}

export default Producers;
