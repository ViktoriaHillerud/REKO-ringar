import { useState } from "react";

const btnStyle = {
  border: "4px solid green",
  borderRadius: "10px",
  padding: "4px",
  fontSize: "13px",
  cursor: "pointer",
  height: "35px",
  width: "120px",
};

const inputStyle = {
  marginRight: "5px",
  height: "30px",
  width: "200px",
};

interface SearchProps {
  onSearchClick(search: string): void;
}

const FindProducer = ({ onSearchClick }: SearchProps) => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearchClick(search || "");
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
        placeholder="Sök producent"
      />
      <button onClick={handleSearch} style={btnStyle}>
        Sök
      </button>
    </div>
  );
};

export default FindProducer;
