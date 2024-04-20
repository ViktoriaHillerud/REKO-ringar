import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "react-datetime/css/react-datetime.css";
import Home from "./components/Home.tsx";
import Calendar from "./components/Calendar.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Profile from "./components/Profile.tsx";
import EditProfile from "./components/EditProfile.tsx";
import Producers from "./components/Producers.tsx";
import NewProfile from "./components/NewProfile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: <NewProfile />,
      },
      {
        path: "profile/:id",
        element: <NewProfile/>,
      },
      {
        path: "profile/edit",
        element: <EditProfile />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "producers",
        element: <Producers />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
