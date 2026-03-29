import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import BookAppointment from "./pages/BookAppointment";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
   
  );
}

export default App;