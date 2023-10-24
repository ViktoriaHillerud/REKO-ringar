const express = require("express").setHeader;
import { Request, Response } from "express";
import { Event, eventSchema, EventDoc } from "../models/eventSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UpdateQuery } from "mongoose";
import moment, { Moment } from "moment";
import { User } from "../models/userSchema";

require("dotenv").config();

//Read ALL events
export const readAllEvents = async () => {
  try {
    const events = await Event.find({});

    // const events = await Event.find({
    // 	start: { $gte: start},
    // 	end: { $lte: moment(req.query.end).toDate()}
    // });

    if (!events) {
      throw new Error("Events not found");
    }

    return { error: null, data: events };
  } catch (error) {
    console.log(error);
    return { error: "Events not found", data: null };
  }
};

//readAllUserEvents
export const readAllUserEvents = async () => {
  try {
    const users = await User.find({
      events: { $exists: true, $not: { $size: 0 } },
    });
    if (!users) {
      throw new Error("Events not found");
    }
    return users;
  } catch (error) {
    console.log(error);
    return { error: "Events not found", data: null };
  }
};

//Read one event
export const readOneEvent = async (data: Request) => {
  try {
    const event = await Event.findById(data.params.eventID);
    return { error: null, event };
  } catch (error) {
    console.log(error);
    return { error: "Event not found" };
  }
};

// Create event
export const createEvent = async (req: Request) => {
	
  try {
    const authToken = req.cookies.authtoken;
    if (!authToken) {
      return { error: "Authentication token not found" };
    }

    const uid = req.cookies.uid;
    console.log("uid from cookies:", uid);

	console.log("desc from req.body:", req.body.desc);

    const event = await User.findOneAndUpdate(
      { _id: uid },
      { $push: { events: req.body } },
      { new: true }
    );
	

    if (event) {
      console.log("Updated", event);
      return event;
    } else {
      return { error: "ID not found" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { message: error.message }, req: null };
    } else {
      return { error: { message: "Unknown error" }, req: null };
    }
  }
};

//update event
export const updateEvent = async (data: Request) => {
  try {
    const uid = data.body.uid;
    const eventId = data.body._id;

    const update = {
      _id: eventId,
      title: data.body.title,
      desc: data.body.desc,
      start: data.body.start,
      end: data.body.end,
      uid: uid,
    };

    const event = await User.findOneAndUpdate(
      { _id: uid, "events._id": eventId },
      { $set: { "events.$[elem]": update } },
      { new: true, arrayFilters: [{ "elem._id": eventId }] }
    );

    if (!event) {
      return { error: "Event not found", data: null };
    }

    console.log("Updated", event);
    return { error: null, msg: "Event updated successfully" };
  } catch (error: unknown) {
    console.error("Error updating event:", error);
    return { error: "Could not update event", data: null };
  }
};

//delete event
export const deleteEvent = async (eventId: string, uid: string) => {
  try {
    const user = await User.findOne({ _id: uid });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.events || user.events.length === 0) {
      throw new Error("User has no events");
    }

    // Find the index of the event to be deleted
    const eventIndex = user.events.findIndex(
      (event: any) => event._id.toString() === eventId
    );

    if (eventIndex === -1) {
      throw new Error("Event not found");
    }

    // Removing the event from the eventsarray
    const deletedEvent = user.events.splice(eventIndex, 1)[0];

    await user.save();

    console.log("Deleted", eventId);
    return { msg: "Event deleted successfully", deletedEvent };
  } catch (error) {
    console.error(error);
    return { error: error, data: null };
  }
};

module.exports = {
  readAllEvents,
  readOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  readAllUserEvents,
};
