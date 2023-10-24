import React, { useState, useRef, RefObject, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventAddArg } from "@fullcalendar/core";
import Datetime from "react-datetime";
import EventModal from "./EventModal";
import styled from "@emotion/styled";
import Modal from "react-modal";
import moment, { Moment } from "moment";
import axios from "axios";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { deleteEvent, getOneUser, updateEvent } from "../helpers/api";
import Cookies from "js-cookie";
import { HiOutlineXMark } from "react-icons/hi2";
import "../index.css";

export interface EventFormData {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  desc: string;
  uid: string;

  events: EventFormData[];
  event: {
    _id: string;
    title: string;
    desc: string;
    start: Date;
    end: Date;
    uid: string;
  };
}

interface EventData {
  _id: string;
  title: string;
}

interface ResponseData {
  users: {
    data: EventFormData[];
  };
}

interface UserData {
  events: EventData[];
}

interface FullCalendarEvent {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  desc: string;
  uid: string;
  event: {
    _id: string;
    title: string;
    start: Date;
    end: Date;
    desc: string;
    uid: string;
  };
}

export const StyleWrapper = styled.div`
@media screen and (max-width: 400px) {
	.fc {
		height: 60vh;
	}
  .fc-today-button {
	margin-left: -20%
  }

`;

const Calendar = () => {
  const style = {
    border: "4px solid red",
    borderRadius: "10px",
    padding: "10px",
    fontSize: "15px",
    cursor: "pointer",
    marginRight: "5px",
  };

  const editStyle = {
    border: "4px solid green",
    borderRadius: "10px",
    padding: "10px",
    fontSize: "15px",
    cursor: "pointer",
  };

  const btnStyle = {
    marginTop: "30px",
    border: "4px solid green",
    borderRadius: "10px",
    padding: "5px",
    fontSize: "17px",
    width: "130px",
    cursor: "pointer",
    marginRight: "7px",
  };

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

  const customStyles2 = {
    content: {
      top: "50%",
      left: "50%",
      right: "20%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "5%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEventsOpen, setModalEventsOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [evntDetails, setEvntDetails] = useState("");
  const [showModal, setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [eventData, setEventData] = useState<EventFormData[]>([]);
  const [updatedStart, setUpdatedStart] = useState(new Date());
  const [updatedEnd, setUpdatedEnd] = useState(new Date());
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDesc, setUpdatedDesc] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(!!Cookies.get("uid"));

  const calendarRef: RefObject<FullCalendar> = useRef(null);

  const onEventAdded = (event: FullCalendarEvent) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newEvent: EventFormData = {
        _id: event._id,
        title: event.title,
        start: moment(event.start).toDate(),
        end: moment(event.end).toDate(),
        desc: event.desc,
        uid: event.uid,
        events: [],
        event: {
          _id: "",
          title: "",
          desc: "",
          start: new Date(),
          end: new Date(),
          uid: "",
        },
      };

      // Update the state by preserving the existing structure
      setEventData((prevEventData) => {
        return prevEventData.map((data) => {
          if (data.events) {
            return {
              ...data,
              events: [...data.events, newEvent],
            };
          } else {
            // Handle the case when data.events is undefined
            return {
              ...data,
              events: [newEvent],
            };
          }
        });
      });

      calendarApi.addEvent(event);
    }
  };

  const handleEventAdd = async (data: EventFormData) => {
    try {
      const authToken = Cookies.get("authtoken");
      const uid = Cookies.get("uid");

      const eventData = {
        title: data.event.title,
        desc: data.event.desc,
        start: data.event.start,
        end: data.event.end,
        uid: uid,
      };

      console.log("Event Data:", eventData);

      if (!authToken) {
        setErrorMessage("Authentication token not found");
        return;
      }

      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      await axios.post("https://officialu09-production.up.railway.app/createevent", eventData, {
        headers,
        withCredentials: true,
      });
      console.log(data.event);
    } catch (error) {
      setErrorMessage("Couldn't add event");
    }
  };

  const handleDatesSet = async () => {
    const response = await axios.get<ResponseData>(
      "https://officialu09-production.up.railway.app/events/users"
    );

    setEventData(response.data.users.data.map((item) => item.events).flat());

    console.log(response.data.users.data.map((item) => item.events).flat());
  };

  const handleEventClick = (arg: EventClickArg) => {
    setUpdateModal(true);

    const eventTitle = arg.event._def.title;
    const startDate = arg.event.start?.toString().slice(0, 21) || "Odefinierat";
    const endDate = arg.event.end
      ? arg.event.end.toString().slice(0, 21)
      : "Odefinierat";
    const eventDesc = arg.event.extendedProps?.desc || "Odefinierat";

    // Get the unique identifier (_id) from extendedProps
    const eventId = arg.event.extendedProps?._id || null;

    const eventDetails = `
	  Titel: ${eventTitle}\n
	  Start: ${startDate}\n
	  Slut: ${endDate}\n
	  Beskrivning: ${eventDesc}
	`;
    setEvntDetails(eventDetails);
    setSelectedEventId(eventId);
  };

  const fetchData = async () => {
    try {
      const uid = Cookies.get("uid");

      if (!uid) {
        throw new Error("UID not found");
      }

      const response = await getOneUser(uid);
      console.log(response.user);

      if (response && response.user && response.user.events) {
        setUser(response.user);
        setModalEventsOpen(true);
      } else {
        console.error("User or user events data is missing in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEvnt = async (eventId: string) => {
    try {
      const uid = Cookies.get("uid");

      if (!uid) {
        throw new Error("UID not found");
      }
      console.log("EventId", eventId, "uid", uid);
      const response = await deleteEvent(eventId, uid);
      console.log("Event deleted successfully", response);
      navigate("/calendar");
    } catch (error: unknown) {
      setErrorMessage("couldnt delete");
    }
  };

  //get one logged in user
  useEffect(() => {
    try {
      const uid = Cookies.get("uid");

      if (uid) {
        setUserLoggedIn(true);
      } else {
        console.error("UID not found in cookies");
        setUserLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleUpdateEvnt = (eventId: string) => {
    console.log("Updating event with ID:", eventId);
    setSelectedEventId(eventId);
    setModal(true);
    const eventToUpdate = eventData.find(
      (event: EventFormData) => event.event && event.event._id === eventId
    );

    if (eventToUpdate && eventToUpdate.event) {
      setUpdatedTitle(eventToUpdate.event.title || "");
      setUpdatedDesc(eventToUpdate.event.desc || "");
      setUpdatedStart(eventToUpdate.event.start || new Date());
      setUpdatedEnd(eventToUpdate.event.end || new Date());
      setSelectedEventId(eventToUpdate.event._id);
    }
  };

  const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "eventTitle") {
      setUpdatedTitle(value);
    } else if (id === "eventDesc") {
      setUpdatedDesc(value);
    }
  };

  const handleDateChange = (date: string | Moment, identifier: string) => {
    let momentDate: Moment;

    if (typeof date === "string") {
      momentDate = moment(date);
    } else {
      momentDate = date;
    }

    if (identifier === "start") {
      setUpdatedStart(momentDate.toDate());
    } else if (identifier === "end") {
      setUpdatedEnd(momentDate.toDate());
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const uid = Cookies.get("uid");
      if (!uid) {
        setErrorMessage("UID not found in cookies");
        return;
      } else if (!selectedEventId) {
        console.log(`No event ID: ${selectedEventId}`);
      }

      const updatedData = {
        _id: selectedEventId,
        title: updatedTitle,
        desc: updatedDesc,
        start: updatedStart,
        end: updatedEnd,
        uid: uid,
      };

      const response = await updateEvent(updatedData);
      if (response.error) {
        setErrorMessage("Failed to update user data");
      } else {
        setModal(false);
        console.log("Update successful!");
      }
    } catch (error) {
      setErrorMessage("Try again, something went wrong");
    }
  };

  const modal = (
    <Modal
      style={customStyles}
      isOpen={showModal}
      onRequestClose={() => setModal(false)}
    >
      <form onSubmit={handleEditSubmit}>
        <input
          id="eventTitle"
          value={updatedTitle || ""}
          onChange={handleStringChange}
        />
        <input
          id="eventDesc"
          value={updatedDesc || ""}
          onChange={handleStringChange}
        />

        <div>
          <label>Start Date</label>
          <Datetime
            value={updatedStart}
            onChange={(date) => handleDateChange(date, "start")}
          />
        </div>

        <div>
          <label>End Date</label>
          <Datetime
            value={updatedEnd}
            onChange={(date) => handleDateChange(date, "end")}
          />
        </div>

        <Button style={editStyle}>Uppdatera</Button>
      </form>
    </Modal>
  );

  return (
    <div style={{ margin: "100px 5%" }}>
      {userLoggedIn ? (
        <Button style={btnStyle} onClick={() => setModalOpen(true)}>
          Add Event
        </Button>
      ) : (
        ""
      )}

      {userLoggedIn ? (
        <Button style={btnStyle} onClick={fetchData}>
          Mina event
        </Button>
      ) : (
        ""
      )}

      <div style={{ position: "relative", zIndex: "0" }}>
        <StyleWrapper>
          <FullCalendar
            ref={calendarRef}
            events={eventData}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            //   dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventAdd={(event: EventAddArg) => {
              // Map the properties from EventAddArg to create an EventFormData object
              const newEvent: EventFormData = {
                _id: event.event._def.publicId || "",
                title: event.event._def.title,
                start: event.event.start || new Date(), // Use a default value (e.g., new Date()) if start is null
                end: event.event.end || new Date(), // Use a default value if end is null
                desc: event.event.extendedProps?.desc || "",
                uid: "", // Set the UID appropriately
                events: [],
                event: {
                  _id: "",
                  title: event.event._def.title,
                  desc: event.event.extendedProps?.desc || "",
                  start: event.event.start || new Date(),
                  end: event.event.end || new Date(),
                  uid: "",
                },
              };

              handleEventAdd(newEvent);
            }}
            datesSet={handleDatesSet}
          />
        </StyleWrapper>
      </div>
      <Modal
        style={customStyles2}
        isOpen={updateModal}
        onRequestClose={() => setUpdateModal(false)}
      >
        <div style={{ whiteSpace: "pre-line" }}>{evntDetails}</div>
      </Modal>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={(event) => onEventAdded(event)}
      />

      {errorMessage}
      <div>
        <div className={modalEventsOpen ? "my-events" : ""}>
          <div>
            <HiOutlineXMark
              onClick={() => setModalEventsOpen(false)}
              className="x-mark"
            />
          </div>

          <div className="event-holder">
            {user && user.events
              ? (user.events as EventData[]).length > 0
                ? (user.events as EventData[]).map((item) => (
                    <div key={item._id}>
                      <p>{item.title}</p>
                      <Button
                        style={style}
                        onClick={() => handleDeleteEvnt(item._id)}
                      >
                        Radera
                      </Button>
                      <Button
                        style={editStyle}
                        onClick={() => handleUpdateEvnt(item._id)}
                      >
                        Updatera
                      </Button>
                    </div>
                  ))
                : "Du har inga event ännu"
              : null}
          </div>
        </div>
      </div>
      {showModal && modal}
    </div>
  );
};

export default Calendar;
