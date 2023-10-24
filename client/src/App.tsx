import { Outlet } from "react-router-dom";
import Modal from 'react-modal'
import './App.css'
import Navbar from "./components/Navbar";

Modal.setAppElement('#root');

function App() {


  return (
    <>
	<Navbar/>
      <Outlet></Outlet>
    </>
  )
}

export default App
