import axios from "axios";
import Cookies from "js-cookie";

const url = "https://officialu09-production.up.railway.app/"; //ändra sedan till backendshostingen "http://localhost:4000"

interface UserAPI {
  name?: string;
  email: string;
  password: string;
  img?: string;
  gallery?: string[];
  address?: string;
  desc?: string;
  events?: string[];
  tags?: string[];
  other?: string;
}

// interface EventAPI {
//   start?: Date;
//   end?: Date;
//   title?: string;
//   desc?: string;
//   user_id: string;
// }

/*=======USER API=========*/

export const login = async (props: UserAPI) => {
  const { email, password } = props;
  try {
    const response = await axios.post(
      `${url}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${url}/logout`);
    return response.data;
  } catch (error) {
    throw new Error(`Logout failed: ${error}`);
  }
};

export const register = async (props: UserAPI) => {
  const { name, email, password } = props;
  try {
    const response = await axios.post(`${url}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Register failed: ${error}`);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${url}/events/users`);
    return response.data;
  } catch (error) {
    throw new Error(`Fetch users failed: ${error}`);
  }
};

// Frontend API function to get one logged in user
export const getOneUser = async (uid: string) => {
  try {
    // Retrieve the authentication token from cookies
    const token = Cookies.get("authtoken");

    if (!token) {
      throw new Error("Authentication token not found in cookies");
    }

    const response = await axios.get(`${url}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { uid }, // Pass the UID as a query parameter
    });

    return response.data;
  } catch (error) {
    throw new Error(`Get one user failed: ${error}`);
  }
};

// Read one user publicly
export const getOneUserPublic = async (uid: string) => {
  try {
    const response = await axios.get(`${url}/profile/public`, {
      params: { uid }, // Pass the UID as a query parameter
    });
    return response.data;
  } catch (error) {
    throw new Error(`Read one public user failed: ${error}`);
  }
};

export const updateUser = async (userData: unknown) => {
  try {
    const response = await axios.put(`${url}/profile/update`, userData);
    return response.data;
  } catch (error) {
    throw new Error(`User update failed: ${error}`);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${url}/profile/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`User delete failed: ${error}`);
  }
};

/*=======Event API=========*/

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${url}/events`);
    return response.data;
  } catch (error) {
    throw new Error(`Fetch events failed: ${error}`);
  }
};

export const getOneevent = async (id: string) => {
  try {
    const response = await axios.get(`${url}/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Fetch one event failed: ${error}`);
  }
};

export const updateEvent = async (eventData: unknown) => {
  try {
    const response = await axios.put(`${url}/events/update`, eventData);
    return response.data;
  } catch (error) {
    throw new Error(`User update failed: ${error}`);
  }
};

export const deleteEvent = async (eventId: string, uid: string) => {
  try {
    const authToken = Cookies.get("authtoken"); // Retrieve the "authtoken" from cookies

    if (!authToken) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    // Send a DELETE request to your backend endpoint for event deletion
    const response = await axios.delete(
      `${url}/events/delete?eventId=${eventId}&uid=${uid}`,
      {
        headers,
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Delete event failed: ${error}`);
  }
};
