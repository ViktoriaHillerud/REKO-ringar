const express = require("express").setHeader;
import { UpdateQuery } from "mongoose";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, UserDoc } from "../models/userSchema";
import { env } from "process";
require("dotenv").config();
const url = "https://officialu09-production.up.railway.app/";
interface JwtPayload {
  _id: string;
}

//Read ALL users
export const readAllUsers = async () => {
  try {
    const users = await User.find({});

    if (!users) {
      throw new Error("Users not found");
    }

    return { error: null, data: users };
  } catch (error) {
    console.log(error);
    return { error: "Users not found", data: null };
  }
};

//Read one user

export const readOneUser = async (uid: string) => {
  try {
    const user = await User.findOne({ _id: uid });
    return user;
  } catch (error) {
    console.log(error);
    return { error: "User not found" };
  }
};

// Read one user public
export const readOneUserPublic = async (uid: string) => {
  try {
    const user = await User.findOne({ _id: uid });

    if (!user) {
      throw new Error("Users not found");
    }
    
    const publicUserData = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      img: user.img,
      tags: user.tags,
      desc: user.desc,
	  events: user.events,
      other: user.other,
      social: user.social,
      gallery: user.gallery,
    };
    return publicUserData;
  } catch (error) {
    console.error(error);
    throw new Error("User not found");
  }
};

//Create(register) new user
export const createUser = async (req: Request) => {
  try {
	const { name, email } = req.body;

    // Check if the name already exists in the database
    const existingUser = await User.findOne({ name, email});

    if (existingUser) {
      return { error: { message: 'User with this name already exists.' }, newUser: null, uid: null };
    }
    //encrypt the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    // store user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash,
    });
    const uid = newUser._id;
    newUser.save();

    console.log(uid);
    return { error: null, newUser, uid };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { message: error.message }, req: null };
    } else {
      return { error: { message: "Unknown error" }, req: null };
    }
  }
};

//Login user

export const loginUser = async (req: Request, res: Response) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!email) {
      throw new Error("Email is invalid");
    } else if (!password) {
      throw new Error("Password is invalid");
    }

    // Validate if user exists in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token with user _id in the payload
      const accessToken = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "2h",
        }
      );

      // Set the token as a cookie in the response
      res.cookie("authtoken", accessToken, {
        httpOnly: true,
      });

      // Set the "uid" cookie in the response
      res.cookie("uid", user._id.toString(), {
        httpOnly: true,
      });
      // Return both accessToken and user _id in an object
      return { accessToken, uid: user._id.toString() }; // Return as an object
    } else {
      throw new Error("Password does not match");
    }
  } catch (err) {
    console.log(err);
    throw new Error("User not found");
  }
};

//Logout user
export const logOutUser = async (req: Request) => {
	try {

		// Remove the "token" cookie in the response
		req.res?.cookie("authtoken", null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		  });

		 // Remove the "uid" cookie in the response
		 req.res?.cookie("uid", null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		  });


	} catch (error) {
		console.log(error);
		throw new Error("Logout user failed");
	}
};

// Update user
export const updateUser = async (data: Request) => {
  try {

	// data.file contains the uploaded image file
	const imgPath = data.body.img;

    const insert = {
      name: data.body.name,
      address: data.body.address,
      phone: data.body.phone,
      social: data.body.social,
      img: imgPath,
      desc: data.body.desc,
      tags: data.body.tags,
      gallery: data.body.gallery,
      other: data.body.other,
    };
    if (data.body.name) insert.name = data.body.name;
    if (data.body.address) insert.address = data.body.address;
    if (data.body.img) insert.img = data.body.img;
    if (data.body.tags) insert.tags = data.body.tags;
    if (data.body.gallery) insert.gallery = data.body.gallery;
    if (data.body.desc) insert.desc = data.body.desc;
    if (data.body.other) insert.other = data.body.other;
    if (data.body.social) insert.social = data.body.social;
    if (data.body.phone) insert.phone = data.body.phone;

	
	
    if (data.body.password) {
      return { error: "You cant change password in this step" };
    }

    if (insert) {
      const user = await User.findOneAndUpdate({ _id: data.body._id }, insert, {
        new: true,
      });
	  console.log("Updated Insert:", insert);
	  console.log("Updated user:", user);
      return { error: null, data: user };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { message: error.message }, data: null };
    } else {
      return { error: { message: "Unknown error" }, data: null };
    }
  }
};

//Delete user
export const deleteUserById = async (id: string) => {
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    return { error: null, deleteUser };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { message: error.message }, id: null };
    } else {
      return { error: { message: "Unknown error" }, id: null };
    }
  }
};

module.exports = {
  readAllUsers,
  readOneUser,
  readOneUserPublic,
  createUser,
  loginUser,
  logOutUser,
  updateUser,
  deleteUserById,
};
