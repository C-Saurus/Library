import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { registerUser } from "../../service/auth/authThunk";
import { useDispatch } from "react-redux";
import { successToast, errorToast, warnToast } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validate";
import "./index.css";
import { getLocalStorage } from "../../utils/localStore";
export default function Register() {
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
    const newUser = {
      email: data.email,
      username: data.username,
      password: data.password,
    };

    dispatch(registerUser(newUser)).then((res) => {
      if (res.payload?.statusCode === 200) {
        successToast(res.payload.msg);
        navigate(-1);
      } else {
        errorToast(res.payload.msg);
        setLoad(false);
      }
    });
  };

  const handleOnhide = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate(-1);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(registerSchema),
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
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email..."
                name="email"
                {...register("email", { value: "" })}
              />
              <Form.Text className="text-danger">
                {errors.email?.message}
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
                Register
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
              <div onClick={handleLogin} className="change-to-register">
                Have an account? Login
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
