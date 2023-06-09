import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../../service/auth/authThunk";
import { getLocalStorage } from "../../utils/localStore";
import { errorToast, successToast } from "../../utils/toast";
const Header = () => {
  const token = getLocalStorage("token") || undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(logout()).then((res) => {
        if (res?.payload.statusCode === 200) {
          successToast(res?.payload?.msg);
          navigate("/");
        } else {
          errorToast(res?.payload?.msg);
        }
      });
    }
  };
  const handleHome = () => {
    navigate("/");
  };
  const handleAdmin = () => {
    navigate("/admin");
  };
  const handleCart = () => {
    navigate("/order");
  };
  return (
    <div>
      <div className="container">
        <div className="header_container">
          <div>
            <span onClick={handleHome} className="header_logo_text">
              LIBRARY
            </span>
          </div>
          <div>
            <Button
              className="header_btn"
              onClick={handleAdmin}
              variant="outline-info"
            >
              <span>Admin</span>
            </Button>
            <Button
              className="header_btn"
              onClick={handleCart}
              variant="outline-info"
            >
              <span>Cart</span>
            </Button>
            <Button
              className="header_btn"
              onClick={handleClick}
              variant="outline-info"
            >
              <span>{token ? "Logout" : "Login"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
