import React, { useState } from "react";
import Modal from "react-modal";
import Datetime from "react-datetime";
import Cookies from "js-cookie";
import moment from "moment";
import "../index.css";

export interface EventFormData {
  event: {
    _id: string;
    title: string;
    start: Date;
    end: Date;
    desc: string;
    uid: string;
  };
  _id: string;
  title: string;
  desc: string;
  start: Date;
  end: Date;
  uid: string;
}
interface ModalProps {
  isOpen: boolean;
  onClose(): void;
  onEventAdded(event: EventFormData): void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "5%",
  },
};
function EventModal({ isOpen, onClose, onEventAdded }: ModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const uid = Cookies.get("uid");
      console.log("uid cookie:", uid);
      console.log(start, end);

      if (!uid) {
        throw new Error("User ID not found in cookies");
      }

    
      const eventType = {
        _id :"",
        title: "",
        start: new Date(),
        end: new Date(),
        desc: "",
        uid: "",
      };

      // Combine the minimal event object with the other properties
      const eventFormData: EventFormData = {
        event: eventType,
        _id: "", // Provide an appropriate value
        title,
        desc,
        start,
        end,
        uid,
      };

      onEventAdded(eventFormData);

      onClose();
    } catch (error: unknown) {
      setError("API request error");
    }
  };

  return (
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div>
          <label>Start Date</label>
          <Datetime
            value={start}
            onChange={(value: string | moment.Moment) => {
              if (typeof value === "string") {
                setStart(new Date(value));
              } else {
                setStart(value.toDate());
              }
            }}
          />
        </div>

        <div>
          <label>End Date</label>
          <Datetime
            value={end}
            onChange={(value: string | moment.Moment) => {
              if (typeof value === "string") {
                setEnd(new Date(value));
              } else {
                setEnd(value.toDate());
              }
            }}
          />
        </div>

        <button>Add Event</button>
      </form>
    </Modal>
  );
}

export default EventModal;
