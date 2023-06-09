import React, { useState, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { successToast, errorToast, warnToast } from "../../utils/toast";
import { getLocalStorage } from "../../utils/localStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/validate";
import { login } from "../../service/auth/authThunk";
export default function Login() {
  const token = getLocalStorage("token") ?? undefined;
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      warnToast("Bạn đã đăng nhập rồi!");
      navigate("/");
    }
  }, [token, navigate]);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoad(true);
    const user = {
      username: data.username,
      password: data.password,
    };
    dispatch(login(user)).then((res) => {
      if (res.payload?.statusCode === 200) {
        successToast("Đăng nhập thành công");
        navigate(-1);
      } else {
        errorToast(res.payload?.msg);
        setLoad(false);
      }
    });
  };

  const handleOnhide = () => {
    navigate(-1);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(loginSchema),
  });

  return (
    <div>
      <div className="loginBody"></div>
      <Modal
        show={true}
        onHide={handleOnhide}
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Control
                type="text"
                placeholder="Username..."
                name="username"
                {...register("username", { value: "" })}
              />
              <Form.Text className="text-danger">
                {errors.username?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password..."
                name="password"
                {...register("password", { value: "" })}
              />
              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="d-grid">
              <Button variant="success" type="submit" disabled={load}>
                Đăng nhập
              </Button>
            </Form.Group>
          </Form>
          <div className="separate-wrap">
            <div className="separate-dash"></div>
            <div className="separate-text">or</div>
            <div className="separate-dash"></div>
          </div>
          <div>
            <div className="change-modal-wrap">
              <div onClick={handleRegister} className="change-to-register">
                Bạn không có tài khoản? Đăng ký ngay
              </div>
              <div className="forgot-password">Forgot password?</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
