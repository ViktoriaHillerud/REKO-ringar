import mongoose from "mongoose";
import { EventDoc, eventSchema } from "./eventSchema";

export interface IUser {
  name: string;
  email: string;
  password: string;
  img?: string;
  gallery?: string[];
  events?: EventDoc[];
  address?: string;
  phone?: string;
  social?: string[];
  desc?: string;
  tags?: string[];
  other?: string;
  
}

interface userModel extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  img?: string;
  gallery?: string[];
  events?: string[];
  address?: string;
  phone?: string;
  social?: string[];
  desc?: string;
  tags?: string[];
  other?: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  gallery: {
    type: [String],
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  social: {
    type: [String],
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  //such as prices for producers
  other: {
    type: String,
    required: false,
  },
  events: [
    {
      type: eventSchema,
    },
  ],
});

const User = mongoose.model<UserDoc, userModel>("User", userSchema);

export { User };
