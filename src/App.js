import "./App.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./components/Login";
import Register from "./components/Register";
import BookDetails from "./pages/Admin/BookDetails";
import Book from "./pages/Book";
import Order from "./pages/Order";
function App() {
  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/book/:id" element={<Book />}></Route>
        <Route path="/order" element={<Order />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="admin/book/:id" element={<BookDetails />}></Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
