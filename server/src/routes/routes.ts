import express, { Request, Response } from "express";
import {
  createUser,
  readAllUsers,
  readOneUser,
  readOneUserPublic,
  loginUser,
  logOutUser,
  updateUser,
  deleteUserById,
} from "../controllers/userController";
import {
  readAllEvents,
  readOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  readAllUserEvents,
} from "../controllers/eventController";
import { protectRoute } from "../middleware/authMiddleware";
import { access } from "fs";
import multer from 'multer';
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, path.join(__dirname, 'src')); // Use an absolute path
	},
	filename: function (req, file, cb) {
	  const ext = path.extname(file.originalname);
	  cb(null, Date.now() + ext);
	}
  });
  
const upload = multer({ storage: storage });

const router = express.Router(); 

/*-------USER-ROUTES-------*/

router.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('Hello World')
})
// Register route
router.post("/register", async (req: Request, res: Response) => {
	const user = await createUser(req);
  
	if (user && user.error) {
	  res.status(400).json({
		error: user.error.message,  // Send just the error message
	  });
	} else {
	  res.status(201).json({
		user: user,
		message: "User registered successfully",
	  });
	}
  });
  

//Loginroute
router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req, res);

    if (result.accessToken) {
      // Set the token as a cookie in the response
      res.cookie("authtoken", result.accessToken, {
        httpOnly: true,
      });

      res.status(201).json({
        data: {
          accessToken: result.accessToken,
          uid: result.uid, // Include the uid in the response
        },
        message: "User logged in",
      });
    } else {
      return res.status(500).json({
        message: "Wrong credentials",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

//Logout user
router.post("/logout", async (req: Request, res: Response) => {
	try {
		await logOutUser(req)
	
		  res.status(200).json({
			message: "User logged out successfully",
		  });
	} catch (error) {
		console.error(error);
    res.status(500).json({
      error: "Server error",
    });
	}
});

//Get public user
router.get("/profile/public", async (req: Request, res: Response) => {
  const { uid } = req.query;
  try {
    if (!uid) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // uid must be a string
    const uidString = uid.toString();

    const user = await readOneUserPublic(uidString);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      user: user,
      message: "User found successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

//Get private users profile
router.get("/profile", protectRoute, async (req: Request, res: Response) => {
  const { uid } = req.query;
  try {
    if (!uid) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // Ensure that uid is a string
    const uidString = uid.toString();

    // Fetch user data based on the UID
    const user = await readOneUser(uidString);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      user: user,
      message: "User found successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

//Update user
router.put("/profile/update", upload.single('img'), async (req: Request, res: Response) => {
  const user = await updateUser(req);

  if (user) {
    if (user.error) {
      res.status(500).json({
        error: user.error,
      });
    } else {
      res.status(201).json({
        user: user,
        message: "User updated successfully",
      });
    }
  }
});

//Delete user
router.delete("/profile/:userID", async (req: Request, res: Response) => {
  const user = await deleteUserById(req.params.userID);

  if (user) {
    if (user.error) {
      res.status(500).json({
        error: user.error,
      });
    } else {
      res.status(201).json({
        user: user,
        message: "user deleted",
      });
    }
  }
});

/*------EVENT-ROUTES------*/

//get all events
router.get("/events", async (req: Request, res: Response) => {
  const event = await readAllEvents();

  if (event) {
    if (event.error) {
      res.status(500).json({
        error: event.error,
      });
    } else {
      res.status(201).json({
        event: event,
        message: "Events successfully fetched",
      });
    }
  }
});

//Get all registered users and their events
router.get("/events/users", async (req: Request, res: Response) => {
  const users = await readAllUsers();

  if (users) {
    if (!users) {
      res.status(500).json({
        error: users,
      });
    } else {
      res.status(201).json({
        users: users,
        message: "Events successfully fetched",
      });
    }
  }
});

//Get one event
router.get("/events/:eventID", async (req: Request, res: Response) => {
  const event = await readOneEvent(req);

  if (event) {
    if (event.error) {
      res.status(500).json({
        error: event.error,
      });
    } else {
      res.status(201).json({
        event: event,
        message: "Event read successfully",
      });
    }
  }
});

//Create an event
router.post(
  "/createevent",
  protectRoute,
  async (req: Request, res: Response) => {
    const event = await createEvent(req);

    if (event) {
      res.status(201).json({
        event: event,
        message: "event created",
      });
    } else {
      res.status(500).json({
        error: "Error creating event",
      });
    }
  }
);

//Update one event
router.put("/events/update", async (req: Request, res: Response) => {
  console.log("Received update request:", req.body);
  const event = await updateEvent(req);

  if (event.error) {
    console.log("Error updating event:", event.error);
    res.status(500).json({
      error: event.error,
    });
  } else {
    console.log("Event updated successfully.");
    res.status(201).json({
      event: event,
      message: "Event updated",
    });
  }
});

//Delete one event
router.delete("/events/delete", async (req: Request, res: Response) => {
  const eventId = req.query.eventId as string;
  const uid = req.query.uid as string;

  try {
    const result = await deleteEvent(eventId, uid);

    if (result.error) {
      return res.status(500).json({
        error: result.error,
      });
    } else {
      return res.status(200).json({
        message: "Event deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Something wrong",
    });
  }
});

export default router;
